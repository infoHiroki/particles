/**
 * Sunrise エフェクト
 * 日の出 + 希望 + 光
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6644', '#ffaa44', '#ffdd88'];
interface SunriseParticle extends Particle { type: 'sun' | 'ray' | 'horizon' | 'glow'; size: number; angle: number; riseSpeed: number; color: string; }
export const sunriseEffect: Effect = {
  config: { name: 'sunrise', description: '日の出 + 希望', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SunriseParticle[] = [];
    particles.push({ id: generateId(), type: 'glow', x, y: y + 20, progress: 0, maxProgress: 75, alpha: 0, size: 80, angle: 0, riseSpeed: -0.5, color: DEFAULT_COLORS[2] });
    particles.push({ id: generateId(), type: 'sun', x, y: y + 30, progress: 0, maxProgress: 70, delay: 5, alpha: 0, size: 25, angle: 0, riseSpeed: -0.6, color: DEFAULT_COLORS[0] });
    const rayCount = Math.floor(10 * intensity);
    for (let i = 0; i < rayCount; i++) {
      const a = -Math.PI + (i / rayCount) * Math.PI;
      particles.push({ id: generateId(), type: 'ray', x, y: y + 25, progress: 0, maxProgress: 60, delay: 10 + i * 2, alpha: 0, size: random(30, 50), angle: a, riseSpeed: -0.4, color: DEFAULT_COLORS[i % 3] });
    }
    particles.push({ id: generateId(), type: 'horizon', x, y: y + 25, progress: 0, maxProgress: 70, alpha: 0, size: 100, angle: 0, riseSpeed: 0, color: '#000033' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SunriseParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type !== 'horizon') {
      p.y += p.riseSpeed;
    }
    p.alpha = t < 0.2 ? t / 0.2 : t > 0.85 ? (1 - t) / 0.15 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SunriseParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'sun') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '88');
      g.addColorStop(0.5, p.color + '44');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'ray') {
      ctx.strokeStyle = p.color + 'aa';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      const startDist = 30;
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(p.angle) * startDist, p.y + Math.sin(p.angle) * startDist);
      ctx.lineTo(p.x + Math.cos(p.angle) * (startDist + p.size), p.y + Math.sin(p.angle) * (startDist + p.size));
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size, p.y, p.size * 2, 50);
    }
    ctx.restore();
  },
};
