import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/** 项目分类取值 */
export const PROJECT_CATEGORY_VALUES = ['personal', 'enterprise'] as const;

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  desc!: string;

  @IsOptional()
  @IsString()
  techStack?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsString()
  previewUrl?: string;

  /** personal 个人项目 | enterprise 企业项目 */
  @IsOptional()
  @IsString()
  @IsIn(PROJECT_CATEGORY_VALUES)
  category?: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
