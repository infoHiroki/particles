/**
 * Gem エフェクト
 * 宝石 + 輝き + 散乱
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff0066', '#00ff66', '#0066ff', '#ffff00', '#ff00ff', '#00ffff'];

interface GemParticle extends Particle {
  type: 'gem';
  size: number; angle: number; distance: number; rotation: number; rotationSpeed: number;
  currentX: number; currentY: number; color: string; facets: number;
}

export const gemEffect: Effect = {
  config: { name: 'gem', description: '宝石 + 輝き', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: GemParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(-Math.PI * 0.8, -Math.PI * 0.2);
      particles.push({
        id: generateId(), type: 'gem', x, y, progress: 0, maxProgress: 50 + random(0, 20),
        delay: random(0, 10), alpha: 0, size: random(8, 14), angle,
        distance: random(40, 100), rotation: random(0, Math.PI * 2),
        rotationSpeed: random(0.05, 0.15), currentX: x, currentY: y,
        color: randomPick(colors), facets: Math.floor(random(5, 8)),
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GemParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    const eased = easeOutCubic(t);
    p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
    p.currentY = p.y + Math.sin(p.angle) * p.distance * eased + t * t * 200;
    p.rotation += p.rotationSpeed;
    p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GemParticle;
    ctx.save(); ctx.globalAlpha = p.alpha;
    ctx.translate(p.currentX, p.currentY); ctx.rotate(p.rotation);
    ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let i = 0; i < p.facets; i++) {
      const a = (i / p.facets) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(a) * p.size;
      const py = Math.sin(a) * p.size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
    // highlight
    ctx.fillStyle = '#ffffff40';
    ctx.beginPath(); ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
};
