import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/** 前台文章评论提交 */
export class CreateArticleCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nickname!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content!: string;

  /** 与点赞收藏共用的访客标识，便于后续审计 */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  visitorId?: string;
}
