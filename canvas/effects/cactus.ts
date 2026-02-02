/**
 * Cactus エフェクト
 * サボテン + 砂漠 + トゲ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aa44', '#55bb55', '#66cc66'];
interface CactusParticle extends Particle { type: 'body' | 'arm' | 'spike' | 'flower'; size: number; armSide: number; color: string; }
export const cactusEffect: Effect = {
  config: { name: 'cactus', description: 'サボテン + 砂漠', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CactusParticle[] = [];
    particles.push({ id: generateId(), type: 'body', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 30, armSide: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'arm', x: x - 15, y: y - 5, progress: 0, maxProgress: 55, delay: 5, alpha: 0, size: 18, armSide: -1, color: DEFAULT_COLORS[1] });
    particles.push({ id: generateId(), type: 'arm', x: x + 15, y: y + 3, progress: 0, maxProgress: 55, delay: 8, alpha: 0, size: 15, armSide: 1, color: DEFAULT_COLORS[1] });
    const spikeCount = Math.floor(10 * intensity);
    for (let i = 0; i < spikeCount; i++) {
      particles.push({ id: generateId(), type: 'spike', x: x + random(-12, 12), y: y + random(-20, 15), progress: 0, maxProgress: 50, delay: random(10, 25), alpha: 0, size: random(3, 6), armSide: 0, color: '#ffffcc' });
    }
    particles.push({ id: generateId(), type: 'flower', x, y: y - 25, progress: 0, maxProgress: 50, delay: 15, alpha: 0, size: 8, armSide: 0, color: '#ff66aa' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CactusParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CactusParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'body') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(p.x - p.size * 0.3, p.y - p.size * 0.8, p.size * 0.6, p.size * 1.6, p.size * 0.15);
      ctx.fill();
    } else if (p.type === 'arm') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(p.x - p.size * 0.2, p.y - p.size * 0.5, p.size * 0.4, p.size, p.size * 0.1);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(p.x + p.armSide * p.size * 0.2 - p.size * 0.25, p.y - p.size * 0.5, p.size * 0.5, p.size * 0.35, p.size * 0.1);
      ctx.fill();
    } else if (p.type === 'spike') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + random(-1, 1) * p.size, p.y - p.size);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.ellipse(p.x + Math.cos(a) * p.size * 0.5, p.y + Math.sin(a) * p.size * 0.5, p.size * 0.4, p.size * 0.2, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffff44';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
