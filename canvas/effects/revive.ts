/**
 * Revive エフェクト
 * 復活 + 光輪 + 上昇
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ffdd88', '#ffcc66', '#ffbb44'];

interface ReviveParticle extends Particle {
  type: 'halo' | 'pillar' | 'feather' | 'glow';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  rotation: number;
  color: string;
}

export const reviveEffect: Effect = {
  config: { name: 'revive', description: '復活 + 光輪', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ReviveParticle[] = [];

    // Halo
    particles.push({
      id: generateId(), type: 'halo', x, y: y - 40, progress: 0, maxProgress: 60,
      alpha: 0, size: 30, currentX: x, currentY: y - 40, vy: 0, rotation: 0,
      color: DEFAULT_COLORS[0],
    });

    // Light pillar
    particles.push({
      id: generateId(), type: 'pillar', x, y, progress: 0, maxProgress: 50,
      alpha: 0, size: 50, currentX: x, currentY: y, vy: 0, rotation: 0,
      color: DEFAULT_COLORS[1],
    });

    // Glow at center
    particles.push({
      id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 55,
      delay: 5, alpha: 0, size: 40, currentX: x, currentY: y, vy: 0, rotation: 0,
      color: '#ffffff',
    });

    // Feathers
    const featherCount = Math.floor(8 * intensity);
    for (let i = 0; i < featherCount; i++) {
      particles.push({
        id: generateId(), type: 'feather', x, y, progress: 0, maxProgress: 70,
        delay: random(10, 30), alpha: 0, size: random(8, 15),
        currentX: x + random(-40, 40), currentY: y + random(0, 30),
        vy: -random(1, 2), rotation: random(0, Math.PI),
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ReviveParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'halo') {
      p.rotation += 0.02;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 0.9;
    } else if (p.type === 'pillar') {
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7 * 0.7;
    } else if (p.type === 'glow') {
      p.size = 40 + Math.sin(p.progress * 0.15) * 10;
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1) * 0.6;
    } else {
      p.currentY += p.vy;
      p.currentX += Math.sin(p.progress * 0.1 + p.rotation) * 0.5;
      p.rotation += 0.02;
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ReviveParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'halo') {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'pillar') {
      const g = ctx.createLinearGradient(p.x, p.y - 100, p.x, p.y + 20);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.2, p.color + '40');
      g.addColorStop(0.5, p.color + '80');
      g.addColorStop(0.8, p.color + '40');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.size / 2, p.y - 100, p.size, 120);
    } else if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color);
      g.addColorStop(0.5, p.color + '66');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.3, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
