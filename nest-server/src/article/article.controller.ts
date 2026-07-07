import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ArticleEngagementService } from './article-engagement.service';
import { ArticleService } from './article.service';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { ToggleEngagementDto } from './dto/toggle-engagement.dto';

@Controller('api/article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleEngagementService: ArticleEngagementService,
  ) {}

  @Get('list')
  list(
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const filters = { category, tag, year, month };

    // 传入 page 时返回分页结构，否则保持数组响应以兼容搜索、首页等调用方
    if (page != null && page !== '') {
      return this.articleService.findPage({ ...filters, page, pageSize });
    }

    return this.articleService.findAll(filters);
  }

  @Get('slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }

  /** 互动统计与当前访客状态 */
  @Get(':id/engagement')
  engagement(
    @Param('id', ParseIntPipe) id: number,
    @Query('visitorId') visitorId?: string,
  ) {
    return this.articleEngagementService.queryEngagement(id, visitorId);
  }

  /** 文章评论列表 */
  @Get(':id/comments')
  comments(@Param('id', ParseIntPipe) id: number) {
    return this.articleEngagementService.queryComments(id);
  }

  @Post(':id/like')
  toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ToggleEngagementDto,
  ) {
    return this.articleEngagementService.toggleLike(id, dto.visitorId);
  }

  @Post(':id/comments')
  createComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateArticleCommentDto,
  ) {
    return this.articleEngagementService.createComment(id, dto);
  }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }
}
