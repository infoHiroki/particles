/**
 * Earthquake エフェクト
 * 地震 + 振動 + 岩石
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#886644', '#aa8866', '#ccaa88'];

interface EarthquakeParticle extends Particle {
  type: 'crack' | 'rock' | 'dust' | 'shake';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

export const earthquakeEffect: Effect = {
  config: { name: 'earthquake', description: '地震 + 振動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EarthquakeParticle[] = [];

    // Shake indicator
    particles.push({
      id: generateId(), type: 'shake', x, y, progress: 0, maxProgress: 40,
      alpha: 0, size: 60, currentX: x, currentY: y, vx: 0, vy: 0, rotation: 0,
      color: DEFAULT_COLORS[0],
    });

    // Cracks
    const crackCount = Math.floor(5 * intensity);
    for (let i = 0; i < crackCount; i++) {
      const angle = random(-Math.PI * 0.3, Math.PI * 0.3) + (i / crackCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'crack', x, y: y + 20, progress: 0, maxProgress: 45,
        delay: i * 3, alpha: 0, size: random(30, 60),
        currentX: x, currentY: y + 20, vx: Math.cos(angle), vy: Math.sin(angle),
        rotation: angle, color: '#333333',
      });
    }

    // Rocks
    const rockCount = Math.floor(12 * intensity);
    for (let i = 0; i < rockCount; i++) {
      particles.push({
        id: generateId(), type: 'rock', x, y, progress: 0, maxProgress: 35,
        delay: random(0, 10), alpha: 0, size: random(5, 15),
        currentX: x + random(-40, 40), currentY: y + 10,
        vx: random(-3, 3), vy: -random(4, 10),
        rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Dust
    const dustCount = Math.floor(20 * intensity);
    for (let i = 0; i < dustCount; i++) {
      particles.push({
        id: generateId(), type: 'dust', x, y, progress: 0, maxProgress: 50,
        delay: random(5, 20), alpha: 0, size: random(3, 8),
        currentX: x + random(-50, 50), currentY: y + random(0, 30),
        vx: random(-1, 1), vy: -random(0.5, 1.5),
        rotation: 0, color: '#aa9988',
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EarthquakeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'shake') {
      p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.3;
      p.currentX = p.x + Math.sin(p.progress * 2) * 8 * (1 - t);
    } else if (p.type === 'crack') {
      p.size = Math.min(p.size, 60) * (1 + t * 0.5);
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7;
    } else if (p.type === 'rock') {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.vy += 0.4;
      p.rotation += 0.1;
      p.alpha = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9;
    } else {
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.alpha = t < 0.2 ? (t / 0.2) * 0.6 : (1 - t) / 0.8 * 0.6;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EarthquakeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'shake') {
      ctx.strokeStyle = p.color + '60';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.arc(p.currentX, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'crack') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      let cx = p.x, cy = p.y;
      for (let i = 0; i < 5; i++) {
        cx += p.vx * p.size * 0.2 + random(-5, 5);
        cy += p.vy * p.size * 0.2 + random(-3, 3);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    } else if (p.type === 'rock') {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.5, -p.size * 0.3);
      ctx.lineTo(p.size * 0.3, -p.size * 0.5);
      ctx.lineTo(p.size * 0.5, p.size * 0.2);
      ctx.lineTo(-p.size * 0.2, p.size * 0.5);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = p.color + '80';
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
