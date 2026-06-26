import type { Components } from 'react-markdown';
import type { MarkdownHeading } from '../utils/markdownHeadings';

/**
 * 根据预解析的标题列表，为 Markdown 中的 h2 / h3 挂载锚点 id。
 * id 顺序与 extractMarkdownHeadings 保持一致，供目录跳转使用。
 */
export function createArticleMarkdownComponents(headings: MarkdownHeading[]): Components {
  let headingIndex = 0;

  /** 按文档顺序消费下一个标题 id */
  const consumeHeadingId = (): string | undefined => {
    const heading = headings[headingIndex];
    headingIndex += 1;
    return heading?.id;
  };

  return {
    /** 一级标题：文章内大节 */
    h1: ({ children }) => <h1 className="article-prose__h1">{children}</h1>,

    /** 二级标题：主要小节，带底部分割线与锚点 */
    h2: ({ children }) => {
      const id = consumeHeadingId();
      return (
        <h2 id={id} className="article-prose__h2">
          {children}
        </h2>
      );
    },

    /** 三级标题：子小节 */
    h3: ({ children }) => {
      const id = consumeHeadingId();
      return (
        <h3 id={id} className="article-prose__h3">
          {children}
        </h3>
      );
    },

    /** 四级标题：细节标题 */
    h4: ({ children }) => <h4 className="article-prose__h4">{children}</h4>,

    /** 段落：正文基本单元 */
    p: ({ children }) => <p className="article-prose__p">{children}</p>,

    /** 强调与斜体 */
    strong: ({ children }) => <strong className="article-prose__strong">{children}</strong>,
    em: ({ children }) => <em className="article-prose__em">{children}</em>,

    /** 外链：新窗口打开并带安全属性 */
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http');
      return (
        <a
          className="article-prose__link"
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    },

    /** 无序列表 */
    ul: ({ children }) => <ul className="article-prose__ul">{children}</ul>,

    /** 有序列表 */
    ol: ({ children }) => <ol className="article-prose__ol">{children}</ol>,

    li: ({ children }) => <li className="article-prose__li">{children}</li>,

    /** 引用块 */
    blockquote: ({ children }) => (
      <blockquote className="article-prose__quote">{children}</blockquote>
    ),

    /** 行内代码与 fenced code（由 className 区分块级） */
    code: ({ className, children, ...props }) => {
      const isBlock = Boolean(className);
      if (isBlock) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code className="article-prose__code" {...props}>
          {children}
        </code>
      );
    },

    /** 代码块容器 */
    pre: ({ children }) => <pre className="article-prose__pre">{children}</pre>,

    /** 分隔线 */
    hr: () => <hr className="article-prose__hr" />,

    /** 图片：懒加载 + 圆角 */
    img: ({ src, alt }) => (
      <img className="article-prose__img" src={src} alt={alt ?? ''} loading="lazy" />
    ),

    /** 表格：外层包裹横向滚动 */
    table: ({ children }) => (
      <div className="article-prose__table-wrap">
        <table className="article-prose__table">{children}</table>
      </div>
    ),

    thead: ({ children }) => <thead className="article-prose__thead">{children}</thead>,
    tbody: ({ children }) => <tbody className="article-prose__tbody">{children}</tbody>,
    tr: ({ children }) => <tr className="article-prose__tr">{children}</tr>,
    th: ({ children }) => <th className="article-prose__th">{children}</th>,
    td: ({ children }) => <td className="article-prose__td">{children}</td>,
  };
}

/** 默认组件映射（无锚点 id，兼容无目录场景） */
export const articleMarkdownComponents = createArticleMarkdownComponents([]);
