<template>
  <view class="draw-canvas-wrap">
    <canvas
      id="drawCanvas"
      canvas-id="drawCanvas"
      type="2d"
      class="draw-canvas"
      :disable-scroll="true"
      @touchstart.stop.prevent="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop="onTouchEnd"
      @touchcancel.stop="onTouchEnd"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
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
const canvasWidth = ref(0);
const canvasHeight = ref(0);
const isDrawing = ref(false);

/** 初始化 Canvas 2d 上下文（H5 / 小程序 / App 通用） */
function initCanvas(): void {
  const instance = getCurrentInstance();
  uni
    .createSelectorQuery()
    .in(instance?.proxy as Parameters<ReturnType<typeof uni.createSelectorQuery>['in']>[0])
    .select('#drawCanvas')
    .fields({ node: true, size: true }, () => {})
    .exec((res: UniNamespace.NodeInfo[]) => {
      const item = res?.[0] as { node?: Canvas2dNode; width?: number; height?: number } | undefined;
      if (!item?.node || !item.width || !item.height) return;

      const canvas = item.node;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = uni.getSystemInfoSync().pixelRatio || 1;
      canvas.width = item.width * dpr;
      canvas.height = item.height * dpr;
      ctx.scale(dpr, dpr);

      canvasCtx.value = ctx;
      canvasEl.value = canvas;
      canvasWidth.value = item.width;
      canvasHeight.value = item.height;
      ctx.fillStyle = props.bgColor;
      ctx.fillRect(0, 0, item.width, item.height);
    });
}

/** 获取触摸/鼠标相对画布坐标 */
function getPointFromTouch(e: TouchEvent): { x: number; y: number } | null {
  const canvas = canvasEl.value;
  if (!canvas || !e.touches?.length) return null;
  const touch = e.touches[0] as CanvasTouch;
  if (touch.clientX != null && touch.clientY != null) {
    const rect = (canvas as unknown as HTMLCanvasElement).getBoundingClientRect();
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }
  if (touch.x != null && touch.y != null) {
    return { x: touch.x, y: touch.y };
  }
  return null;
}

function getPointFromMouse(e: MouseEvent): { x: number; y: number } | null {
  const canvas = canvasEl.value;
  if (!canvas) return null;
  const rect = (canvas as unknown as HTMLCanvasElement).getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function refreshCanvas(): void {
  const ctx = canvasCtx.value;
  if (!ctx) return;
  redrawAll(ctx, engineState.value, canvasWidth.value, canvasHeight.value, props.bgColor);
  emit('strokeChange', getStrokeCount(engineState.value));
}

function onTouchStart(e: TouchEvent): void {
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

defineExpose({ undo, redo, clear, getCount, exportImage });

onMounted(() => {
  // 延迟一帧确保 canvas 节点已挂载
  setTimeout(initCanvas, 50);
});
</script>

<style lang="scss" scoped>
.draw-canvas-wrap {
  flex: 1;
  width: 100%;
  border-radius: 12px;
  border: 3px solid #2d3436;
  overflow: hidden;
  background-color: #ffffff;
}

.draw-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
