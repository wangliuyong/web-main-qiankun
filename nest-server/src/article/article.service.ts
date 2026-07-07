import { Injectable, NotFoundException } from '@nestjs/common';
import { sanitizeArticleContent } from '../../prisma/articles-seed-content';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  /** 构建文章列表查询条件（分类、标签、年月归档） */
  private buildListWhere(query: {
    category?: string;
    tag?: string;
    year?: string;
    month?: string;
  }) {
    const where: Record<string, unknown> = {};

    if (query.category) {
      where.category = query.category;
    }
    if (query.tag) {
      where.tags = { contains: query.tag };
    }
    if (query.year) {
      const year = parseInt(query.year, 10);
      const month = query.month ? parseInt(query.month, 10) - 1 : 0;
      const start = new Date(year, month, 1);
      const end = query.month
        ? new Date(year, month + 1, 0, 23, 59, 59)
        : new Date(year + 1, 0, 0, 23, 59, 59);
      where.publishedAt = { gte: start, lte: end };
    }

    return where;
  }

  /** 列表项附带点赞 / 评论计数 */
  private mapArticleWithEngagement<
    T extends {
      _count: { likes: number; comments: number };
    },
  >(article: T) {
    const { _count, ...rest } = article;
    return {
      ...rest,
      likeCount: _count.likes,
      commentCount: _count.comments,
    };
  }

  /** 文章列表，支持分类、标签、年月归档筛选 */
  async findAll(query: {
    category?: string;
    tag?: string;
    year?: string;
    month?: string;
  }) {
    const articles = await this.prisma.article.findMany({
      where: this.buildListWhere(query),
      orderBy: { publishedAt: 'desc' },
      include: {
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    return articles.map((article) => this.mapArticleWithEngagement(article));
  }

  /** 分页文章列表；page 从 1 开始，pageSize 默认 10、最大 50 */
  async findPage(query: {
    category?: string;
    tag?: string;
    year?: string;
    month?: string;
    page?: string;
    pageSize?: string;
  }) {
    const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize || '10', 10) || 10));
    const where = this.buildListWhere(query);

    const [list, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      list: list.map((article) => this.mapArticleWithEngagement(article)),
      total,
      page,
      pageSize,
    };
  }

  /** 详情接口返回前清理种子数据页脚等冗余内容 */
  private sanitizeArticle<T extends { content: string }>(article: T): T {
    return {
      ...article,
      content: sanitizeArticleContent(article.content),
    };
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return this.sanitizeArticle(article);
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return this.sanitizeArticle(article);
  }

  create(data: {
    title: string;
    summary?: string;
    content: string;
    category?: string;
    tags?: string;
    slug?: string;
    publishedAt?: string;
  }) {
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '')
        .slice(0, 80) ||
      `article-${Date.now()}`;

    return this.prisma.article.create({
      data: {
        title: data.title,
        summary: data.summary,
        content: data.content,
        category: data.category,
        tags: data.tags,
        slug,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      },
    });
  }

  update(
    id: number,
    data: Partial<{
      title: string;
      summary: string;
      content: string;
      category: string;
      tags: string;
      slug: string;
      publishedAt: string;
    }>,
  ) {
    const { publishedAt, ...rest } = data;
    return this.prisma.article.update({
      where: { id },
      data: {
        ...rest,
        ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.article.delete({ where: { id } });
  }
}
