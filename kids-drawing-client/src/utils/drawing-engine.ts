/**
 * 绘画引擎：笔迹管理、撤销/重做、重绘
 */

/** 二维坐标点 */
export interface DrawPoint {
  x: number;
  y: number;
}

/** 单条笔迹 */
export interface DrawStroke {
  points: DrawPoint[];
  color: string;
  lineWidth: number;
  isEraser: boolean;
}

/** 绘画引擎实例数据 */
export interface DrawingEngineState {
  strokes: DrawStroke[];
  redoStack: DrawStroke[];
  currentStroke: DrawStroke | null;
}

/** 创建空白引擎状态 */
export function createEngineState(): DrawingEngineState {
  return { strokes: [], redoStack: [], currentStroke: null };
}

/** 开始新笔迹 */
export function beginStroke(
  state: DrawingEngineState,
  x: number,
  y: number,
  color: string,
  lineWidth: number,
  isEraser: boolean,
): void {
  state.currentStroke = {
    points: [{ x, y }],
    color,
    lineWidth,
    isEraser,
  };
  state.redoStack = [];
}

/** 追加点到当前笔迹 */
export function appendPoint(state: DrawingEngineState, x: number, y: number): void {
  if (!state.currentStroke) return;
  state.currentStroke.points.push({ x, y });
}

/** 结束当前笔迹 */
export function endStroke(state: DrawingEngineState): void {
  if (!state.currentStroke) return;
  if (state.currentStroke.points.length > 0) {
    state.strokes.push(state.currentStroke);
  }
  state.currentStroke = null;
}

/** 撤销上一笔 */
export function undoStroke(state: DrawingEngineState): boolean {
  if (state.strokes.length === 0) return false;
  const removed = state.strokes.pop();
  if (removed) state.redoStack.push(removed);
  return true;
}

/** 重做 */
export function redoStroke(state: DrawingEngineState): boolean {
  if (state.redoStack.length === 0) return false;
  const restored = state.redoStack.pop();
  if (restored) state.strokes.push(restored);
  return true;
}

/** 清空画布笔迹 */
export function clearStrokes(state: DrawingEngineState): void {
  state.strokes = [];
  state.redoStack = [];
  state.currentStroke = null;
}

/** 获取总笔画数 */
export function getStrokeCount(state: DrawingEngineState): number {
  let count = state.strokes.length;
  if (state.currentStroke) count++;
  return count;
}

/** 在 Canvas 上绘制单条笔迹 */
export function renderStroke(
  ctx: CanvasRenderingContext2D,
  stroke: DrawStroke,
  bgColor: string,
): void {
  const { points } = stroke;
  if (points.length === 0) return;

  const color = stroke.isEraser ? bgColor : stroke.color;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = stroke.lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  /** 单点时用圆点，否则 path 长度为 0 看不见 */
  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, stroke.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

/** 重绘全部笔迹 */
export function redrawAll(
  ctx: CanvasRenderingContext2D,
  state: DrawingEngineState,
  width: number,
  height: number,
  bgColor: string,
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  state.strokes.forEach((stroke) => renderStroke(ctx, stroke, bgColor));
  if (state.currentStroke) renderStroke(ctx, state.currentStroke, bgColor);
}
