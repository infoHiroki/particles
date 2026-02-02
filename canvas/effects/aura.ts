/**
 * Aura エフェクト
 * オーラ + 揺らめき + 放射
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

const DEFAULT_COLORS = ['#6644ff', '#8866ff', '#aa88ff'];

interface AuraParticle extends Particle {
  type: 'glow' | 'particle';
  size: number; angle: number; radius: number; speed: number;
  currentX: number; currentY: number; color: string; pulsePhase: number;
}

export const auraEffect: Effect = {
  config: { name: 'aura', description: 'オーラ + 揺らめき', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: AuraParticle[] = [];
    // Glow layers
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 80,
        delay: i * 5, alpha: 0, size: 40 + i * 20, angle: 0, radius: 0, speed: 0,
        currentX: x, currentY: y, color: colors[i % colors.length], pulsePhase: i * 0.5,
      });
    }
    // Particles
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(), type: 'particle', x, y, progress: 0, maxProgress: 60 + random(0, 30),
        delay: random(0, 20), alpha: 0, size: random(2, 4), angle,
        radius: random(20, 50), speed: random(0.5, 1.5),
        currentX: x, currentY: y, color: randomPick(colors), pulsePhase: 0,
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as AuraParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'glow') {
      p.pulsePhase += 0.08;
      p.size = (40 + Math.sin(p.pulsePhase) * 10);
      p.alpha = (t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.4;
    } else {
      p.angle += 0.03;
      p.currentX = p.x + Math.cos(p.angle) * p.radius;
      p.currentY = p.y + Math.sin(p.angle) * p.radius - p.speed * p.progress;
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as AuraParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '60'); g.addColorStop(0.5, p.color + '30'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};
