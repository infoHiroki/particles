/**
 * Aurora2 エフェクト
 * オーロラ2 + 極光 + カーテン
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ff88', '#00ffcc', '#88ffaa'];
interface Aurora2Particle extends Particle { type: 'curtain'; width: number; height: number; phase: number; hue: number; color: string; }
export const aurora2Effect: Effect = {
  config: { name: 'aurora2', description: 'オーロラ2 + 極光', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Aurora2Particle[] = [];
    const count = Math.floor(5 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'curtain', x: x - 60 + i * 30, y: y - 40, progress: 0, maxProgress: 90, delay: i * 5, alpha: 0, width: 25, height: 80, phase: random(0, Math.PI * 2), hue: 120 + random(-20, 20), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Aurora2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.05;
    p.hue += 0.3;
    p.alpha = Math.sin(t * Math.PI) * 0.5;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Aurora2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.3, `hsla(${p.hue}, 80%, 60%, 0.8)`);
    gradient.addColorStop(0.7, `hsla(${p.hue + 30}, 70%, 50%, 0.5)`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    for (let i = 0; i <= 10; i++) {
      const py = p.y + (i / 10) * p.height;
      const offset = Math.sin(p.phase + i * 0.5) * 10;
      ctx.lineTo(p.x + offset + p.width / 2, py);
    }
    for (let i = 10; i >= 0; i--) {
      const py = p.y + (i / 10) * p.height;
      const offset = Math.sin(p.phase + i * 0.5 + 1) * 10;
      ctx.lineTo(p.x + offset - p.width / 2, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
