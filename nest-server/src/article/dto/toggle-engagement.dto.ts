import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** 点赞切换：依赖前端 localStorage 生成的访客标识 */
export class ToggleEngagementDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  visitorId!: string;
}
