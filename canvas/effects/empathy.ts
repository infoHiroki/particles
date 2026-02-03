/**
 * Empathy エフェクト
 * エンパシー + 共感 + 繋がり
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff88aa', '#88aaff', '#aa88ff'];
interface EmpathyParticle extends Particle { type: 'link'; size: number; targetX: number; targetY: number; pulse: number; color: string; }
export const empathyEffect: Effect = {
  config: { name: 'empathy', description: 'エンパシー + 共感', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EmpathyParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = random(40, 70);
      particles.push({ id: generateId(), type: 'link', x, y, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: random(4, 8), targetX: x + Math.cos(angle) * dist, targetY: y + Math.sin(angle) * dist, pulse: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EmpathyParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.pulse += 0.1;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EmpathyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha * 0.5;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -p.pulse * 10;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.targetX, p.targetY);
    ctx.stroke();
    ctx.globalAlpha = p.alpha;
    ctx.setLineDash([]);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.targetX, p.targetY, p.size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
