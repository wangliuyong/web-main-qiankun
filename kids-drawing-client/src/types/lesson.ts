/** 课程相关类型定义 */

/** 单步引导 */
export interface LessonStep {
  order: number;
  hint: string;
  /** 参考图形类型 */
  shapeType: string;
  required: boolean;
}

/** 单个课时 */
export interface LessonItem {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  difficulty: number;
  rewardStars: number;
  minStrokes: number;
  steps: LessonStep[];
  prevLessonId: string;
}

/** 章节 */
export interface ChapterItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: LessonItem[];
}

/** 徽章定义 */
export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  chapterId: string;
}

/** 课程根数据 */
export interface LessonsData {
  chapters: ChapterItem[];
  badges: BadgeDef[];
}
