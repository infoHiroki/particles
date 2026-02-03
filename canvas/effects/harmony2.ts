/**
 * Harmony2 エフェクト
 * ハーモニー2 + 和音 + 調和
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6699', '#66ff99', '#6699ff'];
interface Harmony2Particle extends Particle { type: 'chord'; size: number; angle: number; dist: number; rotSpeed: number; hue: number; color: string; }
export const harmony2Effect: Effect = {
  config: { name: 'harmony2', description: 'ハーモニー2 + 和音', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Harmony2Particle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'chord', x, y, progress: 0, maxProgress: 65, delay: i * 2, alpha: 0, size: random(5, 10), angle, dist: random(30, 60), rotSpeed: random(0.02, 0.04), hue: (i / count) * 360, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Harmony2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.angle += p.rotSpeed;
    p.hue += 1;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Harmony2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const px = p.x + Math.cos(p.angle) * p.dist;
    const py = p.y + Math.sin(p.angle) * p.dist;
    ctx.fillStyle = `hsl(${p.hue}, 70%, 60%)`;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
