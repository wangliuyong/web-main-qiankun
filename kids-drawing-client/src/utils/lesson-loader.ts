/**
 * 课程数据加载与解锁逻辑
 */
import lessonsJson from '@/data/lessons.json';
import type { ChapterItem, LessonItem, LessonsData, BadgeDef } from '@/types/lesson';
import type { ProgressData } from '@/types/progress';

const cachedData = lessonsJson as LessonsData;

/** 加载课程数据 */
export function queryLessonsData(): LessonsData {
  return cachedData;
}

/** 获取全部章节 */
export function queryChapters(): ChapterItem[] {
  return queryLessonsData().chapters;
}

/** 根据 id 查找课时 */
export function queryLessonById(lessonId: string): LessonItem | null {
  for (const chapter of queryChapters()) {
    const found = chapter.lessons.find((l) => l.id === lessonId);
    if (found) return found;
  }
  return null;
}

/** 根据 id 查找章节 */
export function queryChapterById(chapterId: string): ChapterItem | null {
  return queryChapters().find((c) => c.id === chapterId) ?? null;
}

/** 获取徽章列表 */
export function queryBadges(): BadgeDef[] {
  return queryLessonsData().badges;
}

/** 获取课时完成星星数 */
export function queryLessonStars(progress: ProgressData, lessonId: string): number {
  const record = progress.lessonRecords.find((r) => r.lessonId === lessonId);
  return record?.stars ?? 0;
}

/** 判断课时是否已解锁 */
export function isLessonUnlocked(progress: ProgressData, lesson: LessonItem): boolean {
  if (!lesson.prevLessonId) return true;
  return queryLessonStars(progress, lesson.prevLessonId) >= 1;
}

/** 判断课时是否已完成 */
export function isLessonCompleted(progress: ProgressData, lessonId: string): boolean {
  return queryLessonStars(progress, lessonId) >= 1;
}

/** 获取章节完成课时数 */
export function queryChapterCompletedCount(progress: ProgressData, chapter: ChapterItem): number {
  return chapter.lessons.filter((l) => isLessonCompleted(progress, l.id)).length;
}

/** 获取推荐继续学习的课时 */
export function queryContinueLesson(progress: ProgressData): LessonItem | null {
  for (const chapter of queryChapters()) {
    for (const lesson of chapter.lessons) {
      if (isLessonUnlocked(progress, lesson) && !isLessonCompleted(progress, lesson.id)) {
        return lesson;
      }
    }
  }
  const chapters = queryChapters();
  const lastChapter = chapters[chapters.length - 1];
  const lastLessons = lastChapter.lessons;
  return lastLessons[lastLessons.length - 1];
}

/** 根据笔画数和步骤完成度计算星星 */
export function calcRewardStars(
  lesson: LessonItem,
  strokeCount: number,
  completedSteps: number,
  totalSteps: number,
): number {
  if (strokeCount < lesson.minStrokes) return 0;
  const stepRatio = totalSteps > 0 ? completedSteps / totalSteps : 1;
  if (stepRatio >= 1 && strokeCount >= lesson.minStrokes + 2) return 3;
  if (stepRatio >= 0.8) return 2;
  return 1;
}
