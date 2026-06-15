/**
 * 儿童绘画全局状态 — 进度、作品集、档案
 */
import { defineStore } from 'pinia';
import type { LessonItem } from '@/types/lesson';
import type { ProgressData, ProfileData, LessonProgress } from '@/types/progress';
import type { GalleryData, GalleryWork } from '@/types/gallery';
import { GALLERY_MAX_COUNT } from '@/types/gallery';
import {
  createDefaultProgress,
  createDefaultProfile,
  createDefaultGallery,
  loadProgress,
  loadGallery,
  loadProfile,
  saveProgress,
  saveGallery,
  saveProfile,
  getTodayDateStr,
  generateId,
} from '@/utils/storage';
import { queryBadges, queryChapters } from '@/utils/lesson-loader';

interface KidsState {
  progress: ProgressData;
  gallery: GalleryData;
  profile: ProfileData;
  hydrated: boolean;
  tabIndex: number;
}

/** 获取昨天日期 YYYY-MM-DD */
function getYesterdayStr(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const useKidsStore = defineStore('kids', {
  state: (): KidsState => ({
    progress: createDefaultProgress(),
    gallery: createDefaultGallery(),
    profile: createDefaultProfile(),
    hydrated: false,
    tabIndex: 0,
  }),

  getters: {
    totalStars: (state) => state.progress.totalStars,
    streakDays: (state) => state.progress.streakDays,
    workCount: (state) => state.gallery.works.length,
  },

  actions: {
    /** 从本地存储水合全部状态 */
    hydrateFromStorage() {
      this.progress = loadProgress();
      this.gallery = loadGallery();
      this.profile = loadProfile();
      this.hydrated = true;
    },

    setTabIndex(index: number) {
      this.tabIndex = index;
    },

    /** 查询课时记录 */
    queryLessonRecord(lessonId: string): LessonProgress | null {
      return this.progress.lessonRecords.find((r) => r.lessonId === lessonId) ?? null;
    },

    /** 重新计算总星星 */
    recalcTotalStars() {
      this.progress.totalStars = this.progress.lessonRecords.reduce((sum, r) => sum + r.stars, 0);
    },

    /** 更新连续学习天数 */
    updateStreak() {
      const today = getTodayDateStr();
      if (this.progress.lastStudyDate === today) return;
      if (this.progress.lastStudyDate === getYesterdayStr()) {
        this.progress.streakDays += 1;
      } else {
        this.progress.streakDays = 1;
      }
      this.progress.lastStudyDate = today;
    },

    /** 检查并解锁徽章 */
    checkBadges() {
      const badges = queryBadges();
      const chapters = queryChapters();
      for (const badge of badges) {
        if (this.progress.unlockedBadges.includes(badge.id)) continue;
        const chapter = chapters.find((c) => c.id === badge.chapterId);
        if (!chapter) continue;
        const allDone = chapter.lessons.every((lesson) => {
          const record = this.queryLessonRecord(lesson.id);
          return record != null && record.stars >= 1;
        });
        if (allDone) this.progress.unlockedBadges.push(badge.id);
      }
    },

    /** 提交课时完成记录 */
    postLessonComplete(lesson: LessonItem, stars: number, strokeCount: number) {
      const newRecord: LessonProgress = {
        lessonId: lesson.id,
        stars,
        completedAt: Date.now(),
        strokeCount,
      };
      const idx = this.progress.lessonRecords.findIndex((r) => r.lessonId === lesson.id);
      if (idx >= 0) {
        if (stars > this.progress.lessonRecords[idx].stars) {
          this.progress.lessonRecords[idx] = newRecord;
        }
      } else {
        this.progress.lessonRecords.push(newRecord);
      }
      this.recalcTotalStars();
      this.updateStreak();
      this.checkBadges();
      saveProgress(this.progress);
    },

    /** 添加作品到画廊 */
    postAddWork(lessonId: string, lessonTitle: string, thumbnail: string): boolean {
      if (this.gallery.works.length >= GALLERY_MAX_COUNT) return false;
      const work: GalleryWork = {
        id: generateId(),
        lessonId,
        lessonTitle,
        thumbnail,
        createdAt: Date.now(),
      };
      this.gallery.works.unshift(work);
      saveGallery(this.gallery);
      return true;
    },

    /** 删除作品 */
    postRemoveWork(workId: string) {
      this.gallery.works = this.gallery.works.filter((w) => w.id !== workId);
      saveGallery(this.gallery);
    },

    /** 更新昵称 */
    postUpdateNickname(nickname: string) {
      this.profile.nickname = nickname;
      saveProfile(this.profile);
    },
  },
});
