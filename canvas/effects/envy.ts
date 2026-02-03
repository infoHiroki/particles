/**
 * Envy エフェクト
 * エンヴィ + 嫉妬 + 羨望
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#228b22', '#2e8b57', '#3cb371'];
interface EnvyParticle extends Particle { type: 'eye'; size: number; pupilOffset: number; blink: number; color: string; }
export const envyEffect: Effect = {
  config: { name: 'envy', description: 'エンヴィ + 嫉妬', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EnvyParticle[] = [];
    const count = Math.floor(10 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(20, 50);
      particles.push({ id: generateId(), type: 'eye', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(8, 15), pupilOffset: 0, blink: 1, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EnvyParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.pupilOffset = Math.sin(t * Math.PI * 4) * 2;
    p.blink = t > 0.4 && t < 0.5 ? 0.2 : 1;
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EnvyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size, p.size * 0.6 * p.blink, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(p.x + p.pupilOffset, p.y, p.size * 0.3 * p.blink, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
