import { Module } from '@nestjs/common';
import { ArticleEngagementService } from './article-engagement.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, ArticleEngagementService],
  exports: [ArticleService],
})
export class ArticleModule {}
