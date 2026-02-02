/**
 * Gate エフェクト
 * 門 + 入口 + アーチ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#666666', '#888888', '#444444'];
interface GateParticle extends Particle { type: 'pillar' | 'arch' | 'light'; size: number; side: number; color: string; }
export const gateEffect: Effect = {
  config: { name: 'gate', description: '門 + 入口', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GateParticle[] = [];
    particles.push({ id: generateId(), type: 'pillar', x: x - 25, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 50, side: -1, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'pillar', x: x + 25, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 50, side: 1, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'arch', x, y: y - 25, progress: 0, maxProgress: 60, delay: 10, alpha: 0, size: 30, side: 0, color: DEFAULT_COLORS[1] });
    if (intensity > 0.5) {
      particles.push({ id: generateId(), type: 'light', x, y: y - 35, progress: 0, maxProgress: 60, delay: 20, alpha: 0, size: 8, side: 0, color: '#ffaa00' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GateParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GateParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'pillar') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 8, p.y - p.size / 2, 16, p.size);
    } else if (p.type === 'arch') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y + 10, p.size, Math.PI, 0);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
