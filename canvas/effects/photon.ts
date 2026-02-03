/**
 * Photon エフェクト
 * フォトン + 光子 + 光速
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ffffaa', '#ffff00'];
interface PhotonParticle extends Particle { type: 'light'; size: number; vx: number; vy: number; trail: {x: number; y: number}[]; color: string; }
export const photonEffect: Effect = {
  config: { name: 'photon', description: 'フォトン + 光子', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PhotonParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(8, 12);
      particles.push({ id: generateId(), type: 'light', x, y, progress: 0, maxProgress: 30, delay: random(0, 5), alpha: 0, size: random(2, 4), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, trail: [], color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PhotonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.trail.push({x: p.x, y: p.y});
    if (p.trail.length > 5) p.trail.shift();
    p.x += p.vx;
    p.y += p.vy;
    p.alpha = (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PhotonParticle;
    ctx.save();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.size;
    ctx.lineCap = 'round';
    ctx.globalAlpha = p.alpha * 0.5;
    ctx.beginPath();
    if (p.trail.length > 0) {
      ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for (const pt of p.trail) ctx.lineTo(pt.x, pt.y);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
