/**
 * Eclipse エフェクト
 * 日食 + 神秘 + コロナ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffaa44', '#ff8822', '#ffffff'];
interface EclipseParticle extends Particle { type: 'sun' | 'moon' | 'corona' | 'flare'; size: number; angle: number; pulsePhase: number; color: string; }
export const eclipseEffect: Effect = {
  config: { name: 'eclipse', description: '日食 + 神秘', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EclipseParticle[] = [];
    particles.push({ id: generateId(), type: 'corona', x, y, progress: 0, maxProgress: 70, alpha: 0, size: 55, angle: 0, pulsePhase: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'sun', x, y, progress: 0, maxProgress: 65, delay: 2, alpha: 0, size: 35, angle: 0, pulsePhase: 0, color: '#ffdd00' });
    particles.push({ id: generateId(), type: 'moon', x, y, progress: 0, maxProgress: 65, delay: 5, alpha: 0, size: 32, angle: 0, pulsePhase: 0, color: '#111111' });
    const flareCount = Math.floor(8 * intensity);
    for (let i = 0; i < flareCount; i++) {
      const a = (i / flareCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'flare', x, y, progress: 0, maxProgress: 55, delay: random(5, 20), alpha: 0, size: random(20, 40), angle: a, pulsePhase: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EclipseParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.pulsePhase += 0.08;
    if (p.type === 'flare') {
      p.size = 30 + Math.sin(p.pulsePhase) * 10;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EclipseParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'corona') {
      const g = ctx.createRadialGradient(p.x, p.y, p.size * 0.6, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '88');
      g.addColorStop(0.5, p.color + '44');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'sun') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'moon') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      const dist = 40;
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(p.angle) * dist, p.y + Math.sin(p.angle) * dist);
      ctx.lineTo(p.x + Math.cos(p.angle) * (dist + p.size), p.y + Math.sin(p.angle) * (dist + p.size));
      ctx.stroke();
    }
    ctx.restore();
  },
};
