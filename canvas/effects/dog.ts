/**
 * Dog エフェクト
 * 犬 + 肉球 + しっぽ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ddaa77', '#cc9966', '#bb8855'];
interface DogParticle extends Particle { type: 'paw' | 'bone' | 'tail'; size: number; vx: number; vy: number; rotation: number; color: string; }
export const dogEffect: Effect = {
  config: { name: 'dog', description: '犬 + 肉球', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DogParticle[] = [];
    const pawCount = Math.floor(4 * intensity);
    for (let i = 0; i < pawCount; i++) {
      particles.push({ id: generateId(), type: 'paw', x: x + random(-35, 35), y: y + random(-25, 25), progress: 0, maxProgress: 50, delay: i * 5, alpha: 0, size: random(14, 20), vx: 0, vy: random(-0.3, 0.3), rotation: random(-0.2, 0.2), color: DEFAULT_COLORS[i % 3] });
    }
    for (let i = 0; i < 2; i++) {
      particles.push({ id: generateId(), type: 'bone', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 55, delay: random(8, 20), alpha: 0, size: random(10, 14), vx: random(-0.5, 0.5), vy: random(-0.5, 0.5), rotation: random(0, Math.PI), color: '#eeeecc' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DogParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === 'bone') p.rotation += 0.03;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DogParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'paw') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, p.size * 0.15, p.size * 0.45, p.size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      const toePositions = [[-p.size * 0.3, -p.size * 0.2], [0, -p.size * 0.3], [p.size * 0.3, -p.size * 0.2], [0, -p.size * 0.15]];
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(toePositions[i][0], toePositions[i][1], p.size * 0.18, p.size * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-p.size * 0.6, -p.size * 0.15, p.size * 1.2, p.size * 0.3, p.size * 0.1);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-p.size * 0.6, 0, p.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.size * 0.6, 0, p.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
