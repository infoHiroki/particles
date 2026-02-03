/**
 * Constellation エフェクト
 * コンステレーション + 星座 + 接続
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#aaddff', '#88bbff'];
interface ConstellationParticle extends Particle { type: 'star' | 'line'; size: number; targetX: number; targetY: number; twinkle: number; color: string; }
export const constellationEffect: Effect = {
  config: { name: 'constellation', description: 'コンステレーション + 星座', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ConstellationParticle[] = [];
    const starCount = Math.floor(7 * intensity);
    const stars: {x: number; y: number}[] = [];
    for (let i = 0; i < starCount; i++) {
      const sx = x + random(-60, 60);
      const sy = y + random(-40, 40);
      stars.push({x: sx, y: sy});
      particles.push({ id: generateId(), type: 'star', x: sx, y: sy, progress: 0, maxProgress: 70, delay: i * 3, alpha: 0, size: random(2, 5), targetX: 0, targetY: 0, twinkle: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < stars.length - 1; i++) {
      particles.push({ id: generateId(), type: 'line', x: stars[i].x, y: stars[i].y, progress: 0, maxProgress: 70, delay: starCount * 3 + i * 2, alpha: 0, size: 1, targetX: stars[i + 1].x, targetY: stars[i + 1].y, twinkle: 0, color: '#aaddff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ConstellationParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'star') {
      p.twinkle += 0.15;
      p.alpha = Math.sin(t * Math.PI) * (0.7 + Math.sin(p.twinkle) * 0.3);
    } else {
      p.alpha = Math.sin(t * Math.PI) * 0.5;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ConstellationParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'star') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.targetX, p.targetY);
      ctx.stroke();
    }
    ctx.restore();
  },
};
