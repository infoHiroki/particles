/**
 * Corona エフェクト
 * コロナ + 太陽コロナ + 放射
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd44', '#ffaa22', '#ff8800'];
interface CoronaParticle extends Particle { type: 'core' | 'flare'; size: number; angle: number; length: number; flicker: number; color: string; }
export const coronaEffect: Effect = {
  config: { name: 'corona', description: 'コロナ + 太陽コロナ', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CoronaParticle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 20, angle: 0, length: 0, flicker: 0, color: '#ffff88' });
    const flareCount = Math.floor(12 * intensity);
    for (let i = 0; i < flareCount; i++) {
      const angle = (i / flareCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'flare', x, y, progress: 0, maxProgress: 55, delay: random(0, 5), alpha: 0, size: random(3, 6), angle, length: random(30, 60), flicker: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CoronaParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'core') {
      p.alpha = Math.sin(t * Math.PI);
    } else {
      p.flicker += 0.2;
      p.length = 30 + Math.sin(p.flicker) * 20;
      p.alpha = Math.sin(t * Math.PI) * 0.7;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CoronaParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'core') {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, '#ffff88');
      gradient.addColorStop(0.7, '#ffaa44');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const endX = p.x + Math.cos(p.angle) * (20 + p.length);
      const endY = p.y + Math.sin(p.angle) * (20 + p.length);
      const gradient = ctx.createLinearGradient(p.x + Math.cos(p.angle) * 20, p.y + Math.sin(p.angle) * 20, endX, endY);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(p.angle) * 20, p.y + Math.sin(p.angle) * 20);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    ctx.restore();
  },
};
