import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';

const commentSelect = {
  id: true,
  nickname: true,
  content: true,
  parentId: true,
  replyToNickname: true,
  createdAt: true,
} as const;

@Injectable()
export class ArticleEngagementService {
  constructor(private readonly prisma: PrismaService) {}

  /** 确认文章存在，不存在则抛 404 */
  private async assertArticleExists(articleId: number) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
  }

  /** 查询互动统计与当前访客是否已点赞 / 收藏 */
  async queryEngagement(articleId: number, visitorId?: string) {
    await this.assertArticleExists(articleId);

    const [likeCount, bookmarkCount, commentCount, liked, bookmarked] =
      await Promise.all([
        this.prisma.articleLike.count({ where: { articleId } }),
        this.prisma.articleBookmark.count({ where: { articleId } }),
        this.prisma.articleComment.count({ where: { articleId } }),
        visitorId
          ? this.prisma.articleLike.findUnique({
              where: { articleId_visitorId: { articleId, visitorId } },
            })
          : null,
        visitorId
          ? this.prisma.articleBookmark.findUnique({
              where: { articleId_visitorId: { articleId, visitorId } },
            })
          : null,
      ]);

    return {
      likeCount,
      bookmarkCount,
      commentCount,
      liked: Boolean(liked),
      bookmarked: Boolean(bookmarked),
    };
  }

  /** 切换点赞：已赞则取消，未赞则添加 */
  async toggleLike(articleId: number, visitorId: string) {
    await this.assertArticleExists(articleId);

    const existing = await this.prisma.articleLike.findUnique({
      where: { articleId_visitorId: { articleId, visitorId } },
    });

    if (existing) {
      await this.prisma.articleLike.delete({ where: { id: existing.id } });
    } else {
      await this.prisma.articleLike.create({
        data: { articleId, visitorId },
      });
    }

    return this.queryEngagement(articleId, visitorId);
  }

  /** 切换收藏：已藏则取消，未藏则添加 */
  async toggleBookmark(articleId: number, visitorId: string) {
    await this.assertArticleExists(articleId);

    const existing = await this.prisma.articleBookmark.findUnique({
      where: { articleId_visitorId: { articleId, visitorId } },
    });

    if (existing) {
      await this.prisma.articleBookmark.delete({ where: { id: existing.id } });
    } else {
      await this.prisma.articleBookmark.create({
        data: { articleId, visitorId },
      });
    }

    return this.queryEngagement(articleId, visitorId);
  }

  /** 查询文章评论列表（时间正序，含回复字段） */
  async queryComments(articleId: number) {
    await this.assertArticleExists(articleId);

    return this.prisma.articleComment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'asc' },
      select: commentSelect,
    });
  }

  /** 发表评论或回复 */
  async createComment(articleId: number, dto: CreateArticleCommentDto) {
    await this.assertArticleExists(articleId);

    let replyToNickname: string | null = null;

    if (dto.parentId != null) {
      const parent = await this.prisma.articleComment.findFirst({
        where: { id: dto.parentId, articleId },
        select: { id: true, nickname: true },
      });

      if (!parent) {
        throw new BadRequestException('回复目标不存在');
      }

      replyToNickname = parent.nickname;
    }

    const comment = await this.prisma.articleComment.create({
      data: {
        articleId,
        nickname: dto.nickname.trim(),
        content: dto.content.trim(),
        visitorId: dto.visitorId?.trim() || null,
        parentId: dto.parentId ?? null,
        replyToNickname,
      },
      select: commentSelect,
    });

    const commentCount = await this.prisma.articleComment.count({
      where: { articleId },
    });

    return { comment, commentCount };
  }
}
