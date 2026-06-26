import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useNavigate } from 'react-router-dom';
import type { DashboardSectionId } from '../config/sectionTypes';
import type { DashboardOverview } from '../types';
import DashboardSectionRenderer from './DashboardSectionRenderer';
import DashboardSortableSection from './DashboardSortableSection';

interface DashboardSortableLayoutProps {
  order: DashboardSectionId[];
  isEditing: boolean;
  overview: DashboardOverview;
  onReorder: (next: DashboardSectionId[]) => void;
}

/** 首页卡片垂直拖拽排序容器 */
export default function DashboardSortableLayout({
  order,
  isEditing,
  overview,
  onReorder,
}: DashboardSortableLayoutProps) {
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id as DashboardSectionId);
    const newIndex = order.indexOf(over.id as DashboardSectionId);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(order, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className={['dashboard-sections', isEditing && 'dashboard-sections--editing'].filter(Boolean).join(' ')}>
          {isEditing ? (
            <p className="dashboard-sections__hint">拖动手柄可调整卡片顺序</p>
          ) : null}
          {order.map((sectionId) => (
            <DashboardSortableSection key={sectionId} id={sectionId} isEditing={isEditing}>
              <DashboardSectionRenderer
                sectionId={sectionId}
                overview={overview}
                onNavigate={(path) => navigate(`/${path}`)}
              />
            </DashboardSortableSection>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
