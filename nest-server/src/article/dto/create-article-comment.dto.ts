import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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

  /** 与点赞共用的访客标识，便于后续审计 */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  visitorId?: string;

  /** 回复目标评论 ID，顶级评论不传 */
  @IsOptional()
  @IsInt()
  parentId?: number;
}
