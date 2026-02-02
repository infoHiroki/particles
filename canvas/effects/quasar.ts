/**
 * Quasar エフェクト
 * クエーサー + ジェット + 高エネルギー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ffff', '#ff00ff', '#ffff00'];
interface QuasarParticle extends Particle { type: 'core' | 'jet' | 'disk'; size: number; angle: number; dist: number; speed: number; color: string; }
export const quasarEffect: Effect = {
  config: { name: 'quasar', description: 'クエーサー + ジェット', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: QuasarParticle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 8, angle: 0, dist: 0, speed: 0, color: '#ffffff' });
    const jetCount = Math.floor(10 * intensity);
    for (let i = 0; i < jetCount; i++) {
      const dir = i % 2 === 0 ? -Math.PI / 2 : Math.PI / 2;
      particles.push({ id: generateId(), type: 'jet', x, y, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: random(3, 6), angle: dir + random(-0.2, 0.2), dist: 0, speed: random(2, 4), color: DEFAULT_COLORS[0] });
    }
    const diskCount = Math.floor(8 * intensity);
    for (let i = 0; i < diskCount; i++) {
      const angle = (i / diskCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'disk', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: random(2, 4), angle, dist: random(15, 25), speed: 0.05, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as QuasarParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'jet') {
      p.dist += p.speed;
      p.alpha = (1 - t) * 0.8;
    } else if (p.type === 'disk') {
      p.angle += p.speed;
      p.alpha = Math.sin(t * Math.PI) * 0.7;
    } else {
      p.alpha = 1;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as QuasarParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'core') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'jet') {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * p.dist;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * (p.dist * 0.3);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
