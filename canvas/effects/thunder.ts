/**
 * Thunder エフェクト
 * 雷鳴 + 閃光 + 衝撃
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#aaccff', '#88aaff'];

interface ThunderParticle extends Particle {
  type: 'flash' | 'bolt' | 'spark';
  size: number;
  currentX: number;
  currentY: number;
  segments: { x: number; y: number }[];
  color: string;
}

export const thunderEffect: Effect = {
  config: { name: 'thunder', description: '雷鳴 + 閃光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ThunderParticle[] = [];

    // Flash
    particles.push({
      id: generateId(), type: 'flash', x, y, progress: 0, maxProgress: 15,
      alpha: 0, size: 200, currentX: x, currentY: y, segments: [], color: '#ffffff',
    });

    // Main bolt
    const segments: { x: number; y: number }[] = [];
    let bx = x;
    let by = y - 100;
    segments.push({ x: bx, y: by });
    for (let i = 0; i < 8; i++) {
      bx += random(-30, 30);
      by += random(20, 35);
      segments.push({ x: bx, y: by });
    }
    particles.push({
      id: generateId(), type: 'bolt', x, y, progress: 0, maxProgress: 20,
      alpha: 0, size: 4, currentX: x, currentY: y, segments, color: DEFAULT_COLORS[0],
    });

    // Sparks
    const sparkCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(20, 60);
      particles.push({
        id: generateId(), type: 'spark', x, y, progress: 0, maxProgress: 25,
        delay: random(0, 8), alpha: 0, size: random(2, 4),
        currentX: x + Math.cos(angle) * dist, currentY: y + Math.sin(angle) * dist,
        segments: [], color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ThunderParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'flash') {
      p.alpha = t < 0.1 ? t / 0.1 : (1 - t) / 0.9 * 0.5;
    } else if (p.type === 'bolt') {
      p.alpha = t < 0.1 ? 1 : Math.max(0, 1 - (t - 0.1) / 0.3);
      // Jitter the bolt
      if (t < 0.4) {
        for (let i = 1; i < p.segments.length - 1; i++) {
          p.segments[i].x += random(-3, 3);
        }
      }
    } else {
      p.alpha = 1 - t;
      p.size *= 0.95;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ThunderParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'flash') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '88');
      g.addColorStop(0.3, p.color + '44');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
    } else if (p.type === 'bolt') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#4488ff';
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.moveTo(p.segments[0].x, p.segments[0].y);
      for (let i = 1; i < p.segments.length; i++) {
        ctx.lineTo(p.segments[i].x, p.segments[i].y);
      }
      ctx.stroke();

      // Glow
      ctx.strokeStyle = '#aaddff';
      ctx.lineWidth = p.size * 2;
      ctx.globalAlpha = p.alpha * 0.3;
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
