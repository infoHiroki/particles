/**
 * Electron エフェクト
 * エレクトロン + 電子 + 軌道
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00aaff', '#44ccff', '#88eeff'];
interface ElectronParticle extends Particle { type: 'electron'; size: number; angle: number; orbitRadius: number; orbitSpeed: number; orbitTilt: number; color: string; }
export const electronEffect: Effect = {
  config: { name: 'electron', description: 'エレクトロン + 電子', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ElectronParticle[] = [];
    const orbits = Math.floor(3 * intensity);
    for (let o = 0; o < orbits; o++) {
      const count = 2 + o;
      for (let i = 0; i < count; i++) {
        particles.push({ id: generateId(), type: 'electron', x, y, progress: 0, maxProgress: 70, delay: o * 5, alpha: 0, size: random(3, 5), angle: (i / count) * Math.PI * 2, orbitRadius: 25 + o * 20, orbitSpeed: 0.1 - o * 0.02, orbitTilt: o * 0.3, color: DEFAULT_COLORS[o % 3] });
      }
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ElectronParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.orbitSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ElectronParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha * 0.3;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.orbitTilt);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.orbitRadius, p.orbitRadius * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = p.alpha;
    const px = Math.cos(p.angle) * p.orbitRadius;
    const py = Math.sin(p.angle) * p.orbitRadius * 0.4;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
