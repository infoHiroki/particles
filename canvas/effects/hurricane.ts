/**
 * Hurricane エフェクト
 * ハリケーン + 暴風 + 旋風
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#778899', '#668888', '#557777'];
interface HurricaneParticle extends Particle { type: 'wind' | 'eye'; size: number; angle: number; dist: number; rotSpeed: number; color: string; }
export const hurricaneEffect: Effect = {
  config: { name: 'hurricane', description: 'ハリケーン + 暴風', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: HurricaneParticle[] = [];
    particles.push({ id: generateId(), type: 'eye', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 15, angle: 0, dist: 0, rotSpeed: 0, color: '#aabbcc' });
    const windCount = Math.floor(30 * intensity);
    for (let i = 0; i < windCount; i++) {
      const angle = (i / windCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'wind', x, y, progress: 0, maxProgress: 80, delay: i * 2, alpha: 0, size: random(2, 4), angle, dist: random(20, 60), rotSpeed: 0.12, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HurricaneParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'wind') {
      p.angle += p.rotSpeed;
      p.dist += 0.3;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HurricaneParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'eye') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * p.dist;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
