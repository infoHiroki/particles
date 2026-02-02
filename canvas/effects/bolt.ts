/**
 * Bolt エフェクト
 * 稲妻 + 衝撃 + パワー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffff00', '#ffffff', '#aaddff'];
interface BoltParticle extends Particle { type: 'bolt' | 'glow' | 'spark'; size: number; points: {x: number, y: number}[]; color: string; }
export const boltEffect: Effect = {
  config: { name: 'bolt', description: '稲妻 + 衝撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BoltParticle[] = [];
    const points: {x: number, y: number}[] = [];
    let px = x, py = y - 40;
    points.push({x: px, y: py});
    for (let i = 0; i < 5; i++) {
      px += random(-15, 15);
      py += 20;
      points.push({x: px, y: py});
    }
    particles.push({ id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 35, alpha: 0, size: 60, points: [], color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'bolt', x, y, progress: 0, maxProgress: 30, delay: 2, alpha: 0, size: 4, points, color: DEFAULT_COLORS[1] });
    const sparkCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({ id: generateId(), type: 'spark', x: x + random(-30, 30), y: y + random(-20, 40), progress: 0, maxProgress: 25, delay: random(3, 10), alpha: 0, size: random(2, 4), points: [], color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BoltParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.1 ? t / 0.1 : (1 - t) / 0.9;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BoltParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'bolt' && p.points.length > 0) {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#ffff88';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(p.points[0].x, p.points[0].y);
      for (let i = 1; i < p.points.length; i++) {
        ctx.lineTo(p.points[i].x, p.points[i].y);
      }
      ctx.stroke();
    } else if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '66');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
