/**
 * Sunburst エフェクト
 * 太陽光 + 放射 + 輝き
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffdd44', '#ffcc00', '#ffaa00'];

interface SunburstParticle extends Particle {
  type: 'ray' | 'core' | 'flare';
  size: number;
  angle: number;
  length: number;
  color: string;
}

export const sunburstEffect: Effect = {
  config: { name: 'sunburst', description: '太陽光 + 放射', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SunburstParticle[] = [];

    // Core
    particles.push({
      id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 60,
      alpha: 0, size: 30, angle: 0, length: 0, color: '#ffffff',
    });

    // Rays
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'ray', x, y, progress: 0, maxProgress: 50,
        delay: i * 2, alpha: 0, size: 4, angle, length: random(60, 100),
        color: DEFAULT_COLORS[i % 3],
      });
    }

    // Flares
    const flareCount = Math.floor(15 * intensity);
    for (let i = 0; i < flareCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'flare', x, y, progress: 0, maxProgress: 40,
        delay: random(5, 25), alpha: 0, size: random(3, 6), angle,
        length: random(40, 80), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SunburstParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'core') {
      p.size = 30 + Math.sin(p.progress * 0.15) * 5;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 0.9;
    } else if (p.type === 'ray') {
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7;
    } else {
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SunburstParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'core') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color);
      g.addColorStop(0.5, '#ffdd44');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'ray') {
      const g = ctx.createLinearGradient(
        p.x, p.y,
        p.x + Math.cos(p.angle) * p.length,
        p.y + Math.sin(p.angle) * p.length
      );
      g.addColorStop(0, p.color);
      g.addColorStop(1, 'transparent');
      ctx.strokeStyle = g;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.length, p.y + Math.sin(p.angle) * p.length);
      ctx.stroke();
    } else {
      const px = p.x + Math.cos(p.angle) * p.length;
      const py = p.y + Math.sin(p.angle) * p.length;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
