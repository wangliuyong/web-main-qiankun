import { AI_SOURCE_OPTIONS } from '../../../../api/ai.api';
import { TechStatCard } from '../../../../components/tech-ui';

export interface VectorStatsRowProps {
  stats: Record<string, number>;
}

/** 各数据源向量块数量统计 */
export default function VectorStatsRow({ stats }: VectorStatsRowProps) {
  return (
    <div className="ai-data-page__stats">
      {AI_SOURCE_OPTIONS.map((opt) => (
        <TechStatCard
          key={opt.value}
          label={opt.label}
          value={stats[opt.value] ?? 0}
          hint="向量块"
        />
      ))}
    </div>
  );
}
