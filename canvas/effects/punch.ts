/**
 * Punch エフェクト
 * パンチ + 衝撃 + 風圧
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ffaa00', '#ff8800', '#ff6600'];

interface PunchParticle extends Particle {
  type: 'impact' | 'wind' | 'star';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

export const punchEffect: Effect = {
  config: { name: 'punch', description: 'パンチ + 衝撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const direction = (options.direction as number) ?? 1;
    const particles: PunchParticle[] = [];

    // Impact
    particles.push({
      id: generateId(), type: 'impact', x, y, progress: 0, maxProgress: 20,
      alpha: 0, size: 40, currentX: x, currentY: y, vx: 0, vy: 0, rotation: 0,
      color: DEFAULT_COLORS[0],
    });

    // Wind lines
    const windCount = Math.floor(8 * intensity);
    for (let i = 0; i < windCount; i++) {
      particles.push({
        id: generateId(), type: 'wind', x, y, progress: 0, maxProgress: 18,
        delay: random(0, 3), alpha: 0, size: random(30, 50),
        currentX: x - direction * random(10, 30), currentY: y + random(-30, 30),
        vx: direction * random(15, 25), vy: random(-2, 2), rotation: 0,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Stars
    const starCount = Math.floor(6 * intensity);
    for (let i = 0; i < starCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'star', x, y, progress: 0, maxProgress: 25,
        delay: 0, alpha: 0, size: random(8, 14),
        currentX: x, currentY: y,
        vx: Math.cos(angle) * random(5, 10), vy: Math.sin(angle) * random(5, 10),
        rotation: random(0, Math.PI), color: '#ffffff',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PunchParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'impact') {
      p.size = 40 + easeOutCubic(t) * 30;
      p.alpha = (1 - t) * 0.8;
    } else if (p.type === 'wind') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.rotation += 0.15;
      p.alpha = 1 - easeOutCubic(t);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PunchParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'impact') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'wind') {
      const g = ctx.createLinearGradient(p.currentX - p.size, p.currentY, p.currentX, p.currentY);
      g.addColorStop(0, 'transparent');
      g.addColorStop(1, p.color);
      ctx.strokeStyle = g;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.currentX - p.size, p.currentY);
      ctx.lineTo(p.currentX, p.currentY);
      ctx.stroke();
    } else {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      // 4-point star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const r = i % 2 === 0 ? p.size : p.size * 0.4;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },
};
