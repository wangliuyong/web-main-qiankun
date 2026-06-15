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
      @mousedown.stop.prevent="onMouseDown"
      @mousemove.stop.prevent="onMouseMove"
      @mouseup.stop.prevent="onMouseUp"
      @mouseleave.stop.prevent="onMouseUp"
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

interface Canvas2dNode {
  width: number;
  height: number;
  getContext(type: '2d'): CanvasRenderingContext2D | null;
}

type CanvasTouch = Touch & { x?: number; y?: number };

const canvasEl = ref<Canvas2dNode | null>(null);
/** 画布逻辑宽高（CSS 像素，与绘制坐标系一致） */
const canvasWidth = ref(0);
const canvasHeight = ref(0);
const isDrawing = ref(false);
const ignoreMouseUntil = ref(0);

/** canvas 未就绪时暂存首点 */
let pendingStart: { x: number; y: number } | null = null;
let resizeObserver: ResizeObserver | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
let bindRetryTimer: ReturnType<typeof setTimeout> | null = null;

function onWindowResizeHandler(): void {
  scheduleSyncCanvasSize();
}

function getDomCanvas(): HTMLCanvasElement | null {
  // #ifdef H5
  const el = document.getElementById('drawCanvas');
  return el instanceof HTMLCanvasElement ? el : null;
  // #endif
  // #ifndef H5
  return null;
  // #endif
}

/** 获取 canvas 当前显示区域（优先真实 DOM） */
function readDisplaySize(): { width: number; height: number } | null {
  // #ifdef H5
  const dom = getDomCanvas();
  if (dom) {
    const rect = dom.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return { width: rect.width, height: rect.height };
    }
  }
  // #endif
  return null;
}

function applyCanvasSize(canvas: Canvas2dNode, layoutW: number, layoutH: number): void {
  if (layoutW <= 0 || layoutH <= 0) return;

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : uni.getSystemInfoSync().pixelRatio || 1;

  canvas.width = Math.round(layoutW * dpr);
  canvas.height = Math.round(layoutH * dpr);

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

  if (pendingStart) {
    const p = pendingStart;
    pendingStart = null;
    doStartStroke(p.x, p.y);
  }
}

/** 同步 canvas 尺寸（uni 节点 + 显示区域） */
function syncCanvasSize(onReady?: () => void): void {
  const instance = getCurrentInstance();
  const display = readDisplaySize();

  uni
    .createSelectorQuery()
    .in(instance?.proxy as Parameters<ReturnType<typeof uni.createSelectorQuery>['in']>[0])
    .select('#drawCanvas')
    .boundingClientRect()
    .select('#drawCanvas')
    .fields({ node: true, size: true }, () => {})
    .exec((res: UniNamespace.NodeInfo[]) => {
      const rect = res?.[0] as UniApp.NodeInfo | undefined;
      const item = res?.[1] as { node?: Canvas2dNode; width?: number; height?: number } | undefined;
      if (!item?.node) {
        onReady?.();
        return;
      }

      const layoutW = display?.width ?? rect?.width ?? item.width ?? 0;
      const layoutH = display?.height ?? rect?.height ?? item.height ?? 0;
      if (layoutW <= 0 || layoutH <= 0) {
        onReady?.();
        return;
      }

      if (
        canvasEl.value === item.node
        && Math.abs(canvasWidth.value - layoutW) < 1
        && Math.abs(canvasHeight.value - layoutH) < 1
        && canvasCtx.value
      ) {
        onReady?.();
        return;
      }

      applyCanvasSize(item.node, layoutW, layoutH);
      onReady?.();
    });
}

function scheduleSyncCanvasSize(): void {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeTimer = null;
    syncCanvasSize();
  }, 80);
}

/** 屏幕/client 坐标 → 画布逻辑坐标 */
function resolvePoint(clientX: number, clientY: number): { x: number; y: number } | null {
  if (canvasWidth.value <= 0 || canvasHeight.value <= 0) return null;

  // #ifdef H5
  const dom = getDomCanvas();
  if (dom) {
    const rect = dom.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    return {
      x: Math.max(0, Math.min(canvasWidth.value, ((clientX - rect.left) / rect.width) * canvasWidth.value)),
      y: Math.max(0, Math.min(canvasHeight.value, ((clientY - rect.top) / rect.height) * canvasHeight.value)),
    };
  }
  // #endif

  const canvas = canvasEl.value as unknown as HTMLCanvasElement | null;
  const rect = canvas?.getBoundingClientRect?.();
  if (!rect || rect.width <= 0) return null;

  return {
    x: Math.max(0, Math.min(canvasWidth.value, ((clientX - rect.left) / rect.width) * canvasWidth.value)),
    y: Math.max(0, Math.min(canvasHeight.value, ((clientY - rect.top) / rect.height) * canvasHeight.value)),
  };
}

function getPointFromTouch(e: TouchEvent): { x: number; y: number } | null {
  if (!e.touches?.length) return null;
  const touch = e.touches[0] as CanvasTouch;

  /** 小程序 canvas：touch.x/y 即逻辑坐标 */
  if (touch.x != null && touch.y != null) {
    return {
      x: Math.max(0, Math.min(canvasWidth.value, touch.x)),
      y: Math.max(0, Math.min(canvasHeight.value, touch.y)),
    };
  }

  if (touch.clientX != null && touch.clientY != null) {
    return resolvePoint(touch.clientX, touch.clientY);
  }

  return null;
}

function getPointFromMouse(e: MouseEvent): { x: number; y: number } | null {
  if (Date.now() < ignoreMouseUntil.value) return null;
  return resolvePoint(e.clientX, e.clientY);
}

function refreshCanvas(): void {
  const ctx = canvasCtx.value;
  if (!ctx) return;
  redrawAll(ctx, engineState.value, canvasWidth.value, canvasHeight.value, props.bgColor);
  emit('strokeChange', getStrokeCount(engineState.value));
}

function doStartStroke(x: number, y: number): void {
  if (!canvasCtx.value) return;
  isDrawing.value = true;
  beginStroke(engineState.value, x, y, props.brushColor, props.brushSize, props.isEraser);
  refreshCanvas();
}

function startStroke(x: number, y: number): void {
  if (canvasCtx.value && canvasWidth.value > 0) {
    doStartStroke(x, y);
    return;
  }

  pendingStart = { x, y };
  syncCanvasSize();
}

function moveStroke(x: number, y: number): void {
  if (!isDrawing.value || !canvasCtx.value) return;
  appendPoint(engineState.value, x, y);
  refreshCanvas();
}

function endActiveStroke(): void {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  endStroke(engineState.value);
  refreshCanvas();
}

function onTouchStart(e: TouchEvent): void {
  ignoreMouseUntil.value = Date.now() + 500;

  const tryDraw = (): void => {
    const point = getPointFromTouch(e);
    if (point) startStroke(point.x, point.y);
  };

  if (!canvasCtx.value) {
    syncCanvasSize(tryDraw);
    return;
  }
  tryDraw();
}

function onTouchMove(e: TouchEvent): void {
  if (!isDrawing.value) return;
  const point = getPointFromTouch(e);
  if (!point) return;
  moveStroke(point.x, point.y);
}

function onTouchEnd(): void {
  endActiveStroke();
}

function onMouseDown(e: MouseEvent): void {
  if (Date.now() < ignoreMouseUntil.value) return;

  const tryDraw = (): void => {
    const point = getPointFromMouse(e);
    if (point) startStroke(point.x, point.y);
  };

  if (!canvasCtx.value) {
    syncCanvasSize(tryDraw);
    return;
  }
  tryDraw();
}

function onMouseMove(e: MouseEvent): void {
  if (!isDrawing.value) return;
  const point = getPointFromMouse(e);
  if (!point) return;
  moveStroke(point.x, point.y);
}

function onMouseUp(): void {
  endActiveStroke();
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

/** 多次尝试初始化（等 flex 布局稳定） */
function initCanvasWithRetry(retry = 0): void {
  syncCanvasSize(() => {
    if (canvasCtx.value && canvasWidth.value > 0) return;
    if (retry >= 8) return;
    bindRetryTimer = setTimeout(() => initCanvasWithRetry(retry + 1), 120);
  });
}

onMounted(() => {
  initCanvasWithRetry();

  // #ifdef H5
  setTimeout(() => {
    const wrap = document.getElementById('drawCanvasWrap');
    if (wrap && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => scheduleSyncCanvasSize());
      resizeObserver.observe(wrap);
    }
  }, 200);
  uni.onWindowResize(onWindowResizeHandler);
  // #endif
});

onBeforeUnmount(() => {
  pendingStart = null;
  if (resizeTimer) clearTimeout(resizeTimer);
  if (bindRetryTimer) clearTimeout(bindRetryTimer);
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
  box-sizing: border-box;
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
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>
