'use client';

import { useEffect, useId, useState } from 'react';
import { cn } from '../utils/cn';
import type { MarkdownHeading } from '../utils/markdownHeadings';

export interface ArticleTocProps {
  /** 从 Markdown 解析出的标题列表 */
  headings: MarkdownHeading[];
  /** 宽屏下目录默认是否展开 */
  defaultOpen?: boolean;
  className?: string;
}

/** 宽屏断点：低于此宽度时默认收起，避免遮挡正文 */
const DESKTOP_TOC_MIN_WIDTH = 1280;

/**
 * 博客详情左侧浮动目录。
 * 编辑型窄栏：竖向轨道 + 当前章节高亮，可折叠为贴边标签。
 */
export function ArticleToc({
  headings,
  defaultOpen = true,
  className,
}: ArticleTocProps) {
  const listId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  /** 窄屏默认收起 */
  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${DESKTOP_TOC_MIN_WIDTH}px)`);
    const syncOpenState = () => setOpen(media.matches ? defaultOpen : false);

    syncOpenState();
    media.addEventListener('change', syncOpenState);
    return () => media.removeEventListener('change', syncOpenState);
  }, [defaultOpen]);

  /** 滚动时高亮当前章节 */
  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element != null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-18% 0px -60% 0px',
        threshold: 0,
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      className={cn('article-toc', open && 'article-toc--open', className)}
      aria-label="文章目录"
    >
      <div className="article-toc__shell">
        {/* 折叠态：贴左窄标签，点击展开 */}
        {!open ? (
          <button
            type="button"
            className="article-toc__tab"
            aria-expanded={false}
            aria-controls={listId}
            onClick={() => setOpen(true)}
          >
            <span className="article-toc__tab-mark" aria-hidden />
            <span className="article-toc__tab-label">目录</span>
          </button>
        ) : null}

        {/* 展开态：目录面板 */}
        <div className="article-toc__panel" hidden={!open} aria-hidden={!open}>
          <div className="article-toc__head">
            <p className="article-toc__title">目录</p>
            <button
              type="button"
              className="article-toc__collapse"
              aria-expanded
              aria-controls={listId}
              onClick={() => setOpen(false)}
            >
              收起
            </button>
          </div>

          <ol id={listId} className="article-toc__list">
            {headings.map((heading) => {
              const isActive = heading.id === activeId;
              return (
                <li
                  key={heading.id}
                  className={cn(
                    'article-toc__item',
                    heading.level === 3 && 'article-toc__item--nested',
                    isActive && 'article-toc__item--active',
                  )}
                >
                  <a
                    className="article-toc__link"
                    href={`#${heading.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={() => setActiveId(heading.id)}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}
