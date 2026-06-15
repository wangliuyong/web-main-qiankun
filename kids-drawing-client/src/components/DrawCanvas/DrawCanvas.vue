<template>
  <view id="drawCanvasWrap" class="draw-canvas-wrap">
    <canvas
      id="drawCanvas"
      canvas-id="drawCanvas"
      type="2d"
      class="draw-canvas"
      :disable-scroll="true"
      @touchstart.stop.prevent="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop.prevent="onTouchEnd"
      @touchcancel.stop.prevent="onTouchEnd"
      @mousedown.prevent="onMouseDown"
      @mousemove.prevent="onMouseMove"
      @mouseup.prevent="onMouseUp"
      @mouseleave.prevent="onMouseUp"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';
import {
  createEngineState,
  beginStroke,
  appendPoint,
  endStroke,
  undoStroke,
  redoStroke,
  clearStrokes,
  redrawAll,
  getStrokeCount,
  type DrawingEngineState,
} from '@/utils/drawing-engine';

const props = withDefaults(
  defineProps<{
    brushColor?: string;
    brushSize?: number;
    isEraser?: boolean;
    bgColor?: string;
  }>(),
  {
    brushColor: '#2D3436',
    brushSize: 6,
    isEraser: false,
    bgColor: '#FFFFFF',
  },
);

const emit = defineEmits<{
  strokeChange: [count: number];
}>();

const engineState = ref<DrawingEngineState>(createEngineState());
const canvasCtx = ref<CanvasRenderingContext2D | null>(null);

/** Canvas 2d 节点（H5 为 HTMLCanvasElement，小程序为 OffscreenCanvas 类节点） */
interface Canvas2dNode {
  width: number;
  height: number;
  getContext(type: '2d'): CanvasRenderingContext2D | null;
}

type CanvasTouch = Touch & { x?: number; y?: number };

const canvasEl = ref<Canvas2dNode | null>(null);
/** 画布逻辑宽高（与 ctx 坐标系一致，不含 DPR） */
const canvasWidth = ref(0);
const canvasHeight = ref(0);
const isDrawing = ref(false);
/** H5 触摸后短暂忽略鼠标，避免双触发 */
const ignoreMouseUntil = ref(0);

let resizeObserver: ResizeObserver | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

/** 窗口尺寸变化回调（需保持引用以便 off） */
function onWindowResizeHandler(): void {
  scheduleSyncCanvasSize();
}

/** 将屏幕坐标转换为画布逻辑坐标（按显示区域比例映射，避免 CSS 尺寸与 buffer 不一致） */
function getCanvasPoint(clientX: number, clientY: number): { x: number; y: number } | null {
  const canvas = canvasEl.value;
  if (!canvas || canvasWidth.value <= 0 || canvasHeight.value <= 0) return null;

  const rect = (canvas as unknown as HTMLCanvasElement).getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const x = ((clientX - rect.left) / rect.width) * canvasWidth.value;
  const y = ((clientY - rect.top) / rect.height) * canvasHeight.value;

  return {
    x: Math.max(0, Math.min(canvasWidth.value, x)),
    y: Math.max(0, Math.min(canvasHeight.value, y)),
  };
}

/** 初始化 / 同步 Canvas 尺寸（布局变化、横竖屏切换后重新测量） */
function syncCanvasSize(): void {
  const instance = getCurrentInstance();
  uni
    .createSelectorQuery()
    .in(instance?.proxy as Parameters<ReturnType<typeof uni.createSelectorQuery>['in']>[0])
    .select('#drawCanvasWrap')
    .boundingClientRect()
    .select('#drawCanvas')
    .fields({ node: true, size: true }, () => {})
    .exec((res: UniNamespace.NodeInfo[]) => {
      const wrapRect = res?.[0] as UniApp.NodeInfo | undefined;
      const item = res?.[1] as { node?: Canvas2dNode; width?: number; height?: number } | undefined;
      if (!item?.node) return;

      /** 优先用容器实际布局尺寸，避免 canvas height:100% 尚未撑开时测到 0 */
      const layoutW = Math.round(wrapRect?.width ?? item.width ?? 0);
      const layoutH = Math.round(wrapRect?.height ?? item.height ?? 0);
      if (layoutW <= 0 || layoutH <= 0) return;

      /** 尺寸未变则跳过，避免重复 reset 上下文 */
      if (
        canvasEl.value === item.node
        && canvasWidth.value === layoutW
        && canvasHeight.value === layoutH
        && canvasCtx.value
      ) {
        return;
      }

      const canvas = item.node;
      const dpr = uni.getSystemInfoSync().pixelRatio || 1;

      /** 修改 width/height 会重置上下文状态 */
      canvas.width = layoutW * dpr;
      canvas.height = layoutH * dpr;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      canvasCtx.value = ctx;
      canvasEl.value = canvas;
      canvasWidth.value = layoutW;
      canvasHeight.value = layoutH;

      redrawAll(ctx, engineState.value, layoutW, layoutH, props.bgColor);
      emit('strokeChange', getStrokeCount(engineState.value));
    });
}

function scheduleSyncCanvasSize(): void {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeTimer = null;
    syncCanvasSize();
  }, 80);
}

/** 获取触摸点坐标 */
function getPointFromTouch(e: TouchEvent): { x: number; y: number } | null {
  if (!e.touches?.length) return null;
  const touch = e.touches[0] as CanvasTouch;

  /** 优先 clientX/Y + 比例换算（H5 / iPad 最准确） */
  if (touch.clientX != null && touch.clientY != null) {
    return getCanvasPoint(touch.clientX, touch.clientY);
  }

  /** 小程序 canvas 专用坐标（已是相对 canvas 的逻辑像素） */
  if (touch.x != null && touch.y != null) {
    return {
      x: Math.max(0, Math.min(canvasWidth.value, touch.x)),
      y: Math.max(0, Math.min(canvasHeight.value, touch.y)),
    };
  }

  return null;
}

function getPointFromMouse(e: MouseEvent): { x: number; y: number } | null {
  if (Date.now() < ignoreMouseUntil.value) return null;
  return getCanvasPoint(e.clientX, e.clientY);
}

function refreshCanvas(): void {
  const ctx = canvasCtx.value;
  if (!ctx) return;
  redrawAll(ctx, engineState.value, canvasWidth.value, canvasHeight.value, props.bgColor);
  emit('strokeChange', getStrokeCount(engineState.value));
}

function onTouchStart(e: TouchEvent): void {
  ignoreMouseUntil.value = Date.now() + 400;
  const point = getPointFromTouch(e);
  if (!point || !canvasCtx.value) return;
  isDrawing.value = true;
  beginStroke(engineState.value, point.x, point.y, props.brushColor, props.brushSize, props.isEraser);
  refreshCanvas();
}

function onTouchMove(e: TouchEvent): void {
  if (!isDrawing.value) return;
  const point = getPointFromTouch(e);
  if (!point) return;
  appendPoint(engineState.value, point.x, point.y);
  refreshCanvas();
}

function onTouchEnd(): void {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  endStroke(engineState.value);
  refreshCanvas();
}

/** H5 鼠标绘画（App/小程序不触发） */
function onMouseDown(e: MouseEvent): void {
  const point = getPointFromMouse(e);
  if (!point || !canvasCtx.value) return;
  isDrawing.value = true;
  beginStroke(engineState.value, point.x, point.y, props.brushColor, props.brushSize, props.isEraser);
  refreshCanvas();
}

function onMouseMove(e: MouseEvent): void {
  if (!isDrawing.value) return;
  const point = getPointFromMouse(e);
  if (!point) return;
  appendPoint(engineState.value, point.x, point.y);
  refreshCanvas();
}

function onMouseUp(): void {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  endStroke(engineState.value);
  refreshCanvas();
}

function undo(): boolean {
  const ok = undoStroke(engineState.value);
  if (ok) refreshCanvas();
  return ok;
}

function redo(): boolean {
  const ok = redoStroke(engineState.value);
  if (ok) refreshCanvas();
  return ok;
}

function clear(): void {
  clearStrokes(engineState.value);
  refreshCanvas();
}

function getCount(): number {
  return getStrokeCount(engineState.value);
}

function exportImage(): string {
  const canvas = canvasEl.value;
  if (!canvas) return '';
  return (canvas as unknown as HTMLCanvasElement).toDataURL('image/png');
}

defineExpose({ undo, redo, clear, getCount, exportImage, syncCanvasSize });

onMounted(() => {
  /** 等 flex 布局稳定后再测量（多次兜底） */
  setTimeout(syncCanvasSize, 50);
  setTimeout(syncCanvasSize, 300);

  // #ifdef H5
  setTimeout(() => {
    const wrap = document.getElementById('drawCanvasWrap');
    if (wrap && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => scheduleSyncCanvasSize());
      resizeObserver.observe(wrap);
    }
  }, 100);
  uni.onWindowResize(onWindowResizeHandler);
  // #endif
});

onBeforeUnmount(() => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeObserver?.disconnect();
  resizeObserver = null;
  // #ifdef H5
  uni.offWindowResize(onWindowResizeHandler);
  // #endif
});
</script>

<style lang="scss" scoped>
.draw-canvas-wrap {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 260px;
  border-radius: $kd-radius-md;
  border: $kd-border-width solid $kd-border-color;
  overflow: hidden;
  background-color: $kd-surface;
  box-shadow: $kd-shadow-card;
  position: relative;

  @include kd-landscape {
    min-height: 0;
  }
}

.draw-canvas {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
}
</style>
