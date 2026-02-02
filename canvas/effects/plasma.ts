/**
 * Plasma エフェクト
 * プラズマ + 電撃 + エネルギー
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#ff44ff', '#ff66ff', '#ff88ff'];

interface PlasmaParticle extends Particle {
  type: 'core' | 'arc' | 'energy';
  size: number;
  angle: number;
  angleSpeed: number;
  points: { x: number; y: number }[];
  color: string;
}

export const plasmaEffect: Effect = {
  config: { name: 'plasma', description: 'プラズマ + 電撃', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PlasmaParticle[] = [];

    // Core
    particles.push({
      id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 60,
      alpha: 0, size: 25, angle: 0, angleSpeed: 0, points: [], color: DEFAULT_COLORS[0],
    });

    // Electric arcs
    const arcCount = Math.floor(6 * intensity);
    for (let i = 0; i < arcCount; i++) {
      const angle = (i / arcCount) * Math.PI * 2;
      const points: { x: number; y: number }[] = [];
      let px = x, py = y;
      for (let j = 0; j < 6; j++) {
        px += Math.cos(angle) * 12 + random(-8, 8);
        py += Math.sin(angle) * 12 + random(-8, 8);
        points.push({ x: px, y: py });
      }
      particles.push({
        id: generateId(), type: 'arc', x, y, progress: 0, maxProgress: 40,
        delay: random(0, 20), alpha: 0, size: 2, angle, angleSpeed: 0.05,
        points, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Energy particles
    const energyCount = Math.floor(20 * intensity);
    for (let i = 0; i < energyCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'energy', x, y, progress: 0, maxProgress: 35,
        delay: random(0, 25), alpha: 0, size: random(2, 5), angle,
        angleSpeed: random(0.05, 0.15), points: [], color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PlasmaParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'core') {
      p.size = 25 + Math.sin(p.progress * 0.2) * 8;
      p.alpha = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 0.8;
    } else if (p.type === 'arc') {
      // Jitter the arc points
      for (let i = 1; i < p.points.length - 1; i++) {
        p.points[i].x += random(-3, 3);
        p.points[i].y += random(-3, 3);
      }
      p.alpha = Math.random() > 0.2 ? 1 - t * 0.5 : 0;
    } else {
      p.angle += p.angleSpeed;
      p.alpha = 1 - t;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PlasmaParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'core') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.3, p.color);
      g.addColorStop(0.7, p.color + '80');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'arc') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      for (const pt of p.points) {
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    } else {
      const dist = 20 + p.progress * 1.5;
      const px = p.x + Math.cos(p.angle) * dist;
      const py = p.y + Math.sin(p.angle) * dist;
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
