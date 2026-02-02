/**
 * Blackhole エフェクト
 * ブラックホール + 吸い込み + 重力
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#110022', '#220044', '#440088'];
interface BlackholeParticle extends Particle { type: 'core' | 'ring' | 'debris'; size: number; angle: number; dist: number; speed: number; color: string; }
export const blackholeEffect: Effect = {
  config: { name: 'blackhole', description: 'ブラックホール + 吸い込み', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BlackholeParticle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 20, angle: 0, dist: 0, speed: 0, color: '#000000' });
    const ringCount = Math.floor(3 * intensity);
    for (let i = 0; i < ringCount; i++) {
      particles.push({ id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 80, delay: i * 5, alpha: 0, size: 30 + i * 15, angle: 0, dist: 0, speed: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const debrisCount = Math.floor(20 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(60, 100);
      particles.push({ id: generateId(), type: 'debris', x, y, progress: 0, maxProgress: 80, delay: random(0, 20), alpha: 0, size: random(2, 5), angle, dist, speed: random(0.02, 0.05), color: `hsl(${random(260, 300)}, 80%, 60%)` });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BlackholeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'debris') {
      p.angle += p.speed * (1 + t * 2);
      p.dist = p.dist * (1 - t * 0.02);
    }
    p.alpha = p.type === 'core' ? 1 : Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BlackholeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'core') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(0.7, '#110022');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * p.dist;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
