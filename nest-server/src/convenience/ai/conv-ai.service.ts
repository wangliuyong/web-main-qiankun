import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { PrismaService } from '../../prisma/prisma.service';
import { AiConfigService } from '../../ai/services/ai-config.service';
import { ConvCityInfoService } from '../city-info/conv-city-info.service';
import { serializeAiMessage, serializeAiSession } from '../common/serializers';
import { CONV_AI_SYSTEM_PROMPT } from './conv-ai.prompt';
import { encodeAssistantContent, parseAssistantContent } from './conv-ai-message.util';
import type { ConvAiChatDto } from './dto/conv-ai.dto';

/** 带入 LLM 的最大历史消息条数（user+assistant 合计） */
const MAX_HISTORY_MESSAGES = 20;

/** 平台使用说明类问题：不做同城信息检索，避免无关卡片 */
const PLATFORM_FAQ_KEYWORDS = [
  '如何发布',
  '怎么发布',
  '审核要多久',
  '怎么举报',
  '如何举报',
  '怎么收藏',
  '如何收藏',
  '登录',
  '账号设置',
];

@Injectable()
export class ConvAiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiConfig: AiConfigService,
    private readonly cityInfoService: ConvCityInfoService,
  ) {}

  /** 查询用户 AI 会话列表 */
  async findSessions(userId: number) {
    const list = await this.prisma.convAiSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return list.map(serializeAiSession);
  }

  /** 查询会话消息 */
  async findMessages(userId: number, sessionId: number) {
    const session = await this.prisma.convAiSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) {
      throw new NotFoundException('会话不存在');
    }
    const messages = await this.prisma.convAiMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map(serializeAiMessage);
  }

  /** AI 问答：调用管理后台配置的 LLM，结合会话历史生成回答 */
  async chat(userId: number, dto: ConvAiChatDto) {
    let sessionId = dto.sessionId;

    if (sessionId) {
      const session = await this.prisma.convAiSession.findFirst({
        where: { id: sessionId, userId },
      });
      if (!session) {
        throw new NotFoundException('会话不存在');
      }
    } else {
      const session = await this.prisma.convAiSession.create({
        data: {
          userId,
          title: dto.question.slice(0, 20),
        },
      });
      sessionId = session.id;
    }

    const relatedInfos = await this.searchRelatedInfos(userId, dto.question);
    const answer = await this.generateAnswer(sessionId!, dto.question, relatedInfos);
    const now = new Date();

    await this.prisma.convAiMessage.createMany({
      data: [
        {
          sessionId: sessionId!,
          role: 'user',
          content: dto.question,
          createdAt: now,
        },
        {
          sessionId: sessionId!,
          role: 'assistant',
          content: encodeAssistantContent(answer, relatedInfos),
          createdAt: new Date(now.getTime() + 100),
        },
      ],
    });

    return { sessionId: sessionId!, answer, relatedInfos };
  }

  /** 判断是否为平台使用说明类问题（跳过同城信息检索） */
  private shouldSearchCityInfo(question: string): boolean {
    const q = question.trim().replace(/[？?。！!，,]/g, '');
    if (q.length < 2) return false;
    return !PLATFORM_FAQ_KEYWORDS.some((kw) => q.includes(kw));
  }

  /** 提取检索关键词：去掉常见口语前缀 */
  private extractSearchKeyword(question: string): string {
    let q = question.trim().replace(/[？?。！!，,]/g, '');
    q = q.replace(/^(帮我|请|我想|有没有|搜索|搜一下|查一下|找一下|查找|推荐|看看)/, '');
    return q.trim().slice(0, 50);
  }

  /** 检索已审核通过的同城便民信息（最多 5 条） */
  private async searchRelatedInfos(userId: number, question: string) {
    if (!this.shouldSearchCityInfo(question)) return [];

    const keyword = this.extractSearchKeyword(question);
    if (keyword.length < 2) return [];

    const result = await this.cityInfoService.findApprovedList(
      { keyword, page: 1, pageSize: 5, sortBy: 'latest' },
      userId,
    );
    return result.list;
  }

  /** 将检索结果摘要注入 LLM，便于生成引导语 */
  private buildInfoSearchContext(
    relatedInfos: Awaited<ReturnType<ConvAiService['searchRelatedInfos']>>,
  ): string {
    if (!relatedInfos.length) return '';

    const lines = relatedInfos.map((item, index) => {
      const price =
        item.price !== undefined && item.price !== null ? `¥${item.price}` : '面议';
      const category = item.categoryName ? `[${item.categoryName}] ` : '';
      return `${index + 1}. ${category}${item.title} - ${price}${item.address ? ` - ${item.address}` : ''}`;
    });

    return `\n\n以下是平台已审核通过、与用户问题相关的同城信息（共 ${relatedInfos.length} 条）。请在回答中简要说明找到了这些信息，并提示用户点击下方卡片查看详情；不要编造不存在的信息：\n${lines.join('\n')}`;
  }

  /** 拉取平台动态上下文（公告摘要），注入 system 提示 */
  private async buildDynamicContext(): Promise<string> {
    const notices = await this.prisma.convNotice.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { title: true, content: true },
    });
    if (!notices.length) return '';

    const lines = notices.map(
      (n, i) => `${i + 1}. ${n.title}：${n.content.slice(0, 120)}`,
    );
    return `\n\n最新平台公告（回答时可参考）：\n${lines.join('\n')}`;
  }

  /** 组装 LLM 消息：system + 历史 + 当前问题 */
  private async buildMessages(
    sessionId: number,
    question: string,
    relatedInfos: Awaited<ReturnType<ConvAiService['searchRelatedInfos']>>,
  ): Promise<BaseMessage[]> {
    const dynamicContext = await this.buildDynamicContext();
    const searchContext = this.buildInfoSearchContext(relatedInfos);
    const messages: BaseMessage[] = [
      new SystemMessage(CONV_AI_SYSTEM_PROMPT + dynamicContext + searchContext),
    ];

    const history = await this.prisma.convAiMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: MAX_HISTORY_MESSAGES,
    });

    for (const item of history) {
      if (item.role === 'user') {
        messages.push(new HumanMessage(item.content));
      } else if (item.role === 'assistant') {
        const { text } = parseAssistantContent(item.content);
        messages.push(new AIMessage(text));
      }
    }

    messages.push(new HumanMessage(question));
    return messages;
  }

  /** 创建 ChatOpenAI 实例（复用管理后台 AiConfig 配置） */
  private async createLlm(): Promise<ChatOpenAI | null> {
    const config = await this.aiConfig.getResolvedConfig();
    if (!config) return null;

    return new ChatOpenAI({
      apiKey: config.apiKey,
      model: config.chatModel,
      temperature: 0.6,
      streaming: false,
      configuration: { baseURL: config.baseUrl },
    });
  }

  /** 调用 LLM 生成回答 */
  private async generateAnswer(
    sessionId: number,
    question: string,
    relatedInfos: Awaited<ReturnType<ConvAiService['searchRelatedInfos']>>,
  ): Promise<string> {
    const llm = await this.createLlm();
    if (!llm) {
      return 'AI 助手暂未配置。请管理员在后台「AI 小助手」中设置 API Key 后重试。';
    }

    try {
      const messages = await this.buildMessages(sessionId, question, relatedInfos);
      const response = await llm.invoke(messages);
      const text = this.extractTextContent(response.content);
      return text.trim() || '抱歉，我暂时无法回答这个问题，请换个方式描述试试。';
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      throw new InternalServerErrorException(`AI 回答生成失败：${message}`);
    }
  }

  /** 解析 LangChain 消息 content（string 或 multimodal 数组） */
  private extractTextContent(content: unknown): string {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === 'string') return part;
          if (part && typeof part === 'object' && 'text' in part) {
            return String((part as { text: string }).text);
          }
          return '';
        })
        .join('');
    }
    return String(content ?? '');
  }
}
