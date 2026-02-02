/**
 * Sun エフェクト
 * 太陽 + 光線 + 暖かい
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd00', '#ffaa00', '#ff8800'];
interface SunParticle extends Particle { type: 'core' | 'ray' | 'corona'; size: number; angle: number; pulsePhase: number; color: string; }
export const sunEffect: Effect = {
  config: { name: 'sun', description: '太陽 + 光線', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SunParticle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 70, alpha: 0, size: 30, angle: 0, pulsePhase: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'corona', x, y, progress: 0, maxProgress: 65, delay: 3, alpha: 0, size: 45, angle: 0, pulsePhase: 0, color: DEFAULT_COLORS[1] });
    const rayCount = Math.floor(12 * intensity);
    for (let i = 0; i < rayCount; i++) {
      const a = (i / rayCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'ray', x, y, progress: 0, maxProgress: 55, delay: i * 2, alpha: 0, size: random(25, 40), angle: a, pulsePhase: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SunParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.pulsePhase += 0.1;
    if (p.type === 'core') {
      p.size = 30 + Math.sin(p.pulsePhase) * 3;
    } else if (p.type === 'ray') {
      p.size = 30 + Math.sin(p.pulsePhase) * 10;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SunParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'core') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'corona') {
      const g = ctx.createRadialGradient(p.x, p.y, p.size * 0.5, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '88');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      const startDist = 35;
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(p.angle) * startDist, p.y + Math.sin(p.angle) * startDist);
      ctx.lineTo(p.x + Math.cos(p.angle) * (startDist + p.size), p.y + Math.sin(p.angle) * (startDist + p.size));
      ctx.stroke();
    }
    ctx.restore();
  },
};
