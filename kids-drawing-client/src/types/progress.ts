/** 进度与档案类型定义 */

/** 单课时完成记录 */
export interface LessonProgress {
  lessonId: string;
  stars: number;
  completedAt: number;
  strokeCount: number;
}

/** 用户进度数据 */
export interface ProgressData {
  lessonRecords: LessonProgress[];
  totalStars: number;
  streakDays: number;
  lastStudyDate: string;
  unlockedBadges: string[];
}

/** 用户档案 */
export interface ProfileData {
  nickname: string;
  avatarEmoji: string;
}
