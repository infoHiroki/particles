/**
 * Circuit エフェクト
 * 回路 + 電流 + 基板
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ff00', '#00cc00', '#009900'];
interface CircuitParticle extends Particle { type: 'line' | 'node' | 'pulse'; startX: number; startY: number; endX: number; endY: number; size: number; pulsePos: number; color: string; }
export const circuitEffect: Effect = {
  config: { name: 'circuit', description: '回路 + 電流', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CircuitParticle[] = [];
    const lineCount = Math.floor(8 * intensity);
    for (let i = 0; i < lineCount; i++) {
      const startX = x + random(-40, 40);
      const startY = y + random(-40, 40);
      const horizontal = Math.random() > 0.5;
      const length = random(20, 40);
      const endX = horizontal ? startX + length : startX;
      const endY = horizontal ? startY : startY + length;
      particles.push({ id: generateId(), type: 'line', x: startX, y: startY, progress: 0, maxProgress: 60, delay: random(0, 20), alpha: 0, startX, startY, endX, endY, size: 2, pulsePos: 0, color: DEFAULT_COLORS[1] });
    }
    const nodeCount = Math.floor(5 * intensity);
    for (let i = 0; i < nodeCount; i++) {
      particles.push({ id: generateId(), type: 'node', x: x + random(-35, 35), y: y + random(-35, 35), progress: 0, maxProgress: 60, delay: random(0, 15), alpha: 0, startX: 0, startY: 0, endX: 0, endY: 0, size: random(3, 5), pulsePos: 0, color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CircuitParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'line') {
      p.pulsePos = t;
    }
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CircuitParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'line') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.startX, p.startY);
      ctx.lineTo(p.endX, p.endY);
      ctx.stroke();
      const pulseX = p.startX + (p.endX - p.startX) * p.pulsePos;
      const pulseY = p.startY + (p.endY - p.startY) * p.pulsePos;
      ctx.fillStyle = '#00ff00';
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
