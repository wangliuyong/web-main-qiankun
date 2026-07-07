import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('api/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }
}
