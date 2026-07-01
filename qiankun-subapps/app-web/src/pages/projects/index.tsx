import {
  AppButtonGhost,
  AppCard,
  AppEmpty,
  AppError,
  PageTitle,
  SubApp,
} from '../../../../_shared/components';
import ProjectCategoryTag from './components/ProjectCategoryTag';
import ProjectsCategoryFilter from './components/ProjectsCategoryFilter';
import { useProjectsPage } from './useProjectsPage';

/** 作品集列表与外链（原 app-projects） */
export default function ProjectsPage() {
  const {
    projects,
    allProjects,
    error,
    filterCategory,
    setFilterCategory,
    categoryCounts,
  } = useProjectsPage();

  if (error) {
    return (
      <SubApp>
        <AppError message={error} />
      </SubApp>
    );
  }

  return (
    <SubApp>
      <PageTitle className="mb-4">作品集</PageTitle>
      <p className="text-muted text-sm mb-6">
        按项目类型浏览：个人独立开发与企业/团队在职期间负责的项目。
      </p>

      {allProjects.length > 0 && (
        <ProjectsCategoryFilter
          value={filterCategory}
          counts={categoryCounts}
          onChange={setFilterCategory}
        />
      )}

      {projects.length === 0 ? (
        <AppEmpty>暂无符合条件的项目</AppEmpty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 app-stagger">
          {projects.map((item) => (
            <AppCard as="article" key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold font-serif">{item.name}</h2>
                <ProjectCategoryTag category={item.category} className="shrink-0" />
              </div>
              <p title={item.desc} className="text-muted mt-2 line-clamp-2">
                {item.desc}
              </p>
              {item.techStack && (
                <p className="text-sm text-faint mt-2">技术栈：{item.techStack}</p>
              )}
              <div className="flex gap-4 mt-4">
                {item.githubUrl && (
                  <AppButtonGhost
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm"
                  >
                    GitHub 源码
                  </AppButtonGhost>
                )}
                {item.previewUrl && (
                  <AppButtonGhost
                    href={item.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm"
                  >
                    在线预览
                  </AppButtonGhost>
                )}
              </div>
            </AppCard>
          ))}
        </div>
      )}
    </SubApp>
  );
}
