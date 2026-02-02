/**
 * Stun エフェクト
 * スタン + 星 + 回転
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffff44', '#ffdd00', '#ffaa00'];

interface StunParticle extends Particle {
  type: 'star' | 'circle';
  size: number;
  angle: number;
  radius: number;
  rotationSpeed: number;
  points: number;
  color: string;
}

export const stunEffect: Effect = {
  config: { name: 'stun', description: 'スタン + 星回転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: StunParticle[] = [];

    // Orbiting circle
    particles.push({
      id: generateId(), type: 'circle', x, y, progress: 0, maxProgress: 80,
      alpha: 0, size: 35, angle: 0, radius: 35, rotationSpeed: 0,
      points: 0, color: DEFAULT_COLORS[0],
    });

    // Stars
    const starCount = Math.floor(4 * intensity);
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'star', x, y, progress: 0, maxProgress: 80,
        delay: i * 3, alpha: 0, size: random(8, 14), angle,
        radius: 35, rotationSpeed: 0.08, points: Math.random() > 0.5 ? 4 : 5,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StunParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'circle') {
      p.alpha = (t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.3;
    } else {
      p.angle += p.rotationSpeed;
      p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StunParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'circle') {
      ctx.strokeStyle = p.color + '60';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(p.x, p.y - 20, p.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const cx = p.x + Math.cos(p.angle) * p.radius;
      const cy = p.y - 20 + Math.sin(p.angle) * p.radius * 0.4;

      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();

      // Draw star
      const spikes = p.points;
      const outerRadius = p.size;
      const innerRadius = p.size * 0.4;

      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const a = (i * Math.PI) / spikes - Math.PI / 2 + p.progress * 0.1;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },
};
