/**
 * Wings エフェクト
 * 翼 + 羽ばたき + 羽
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeff', '#ddddff'];
interface WingsParticle extends Particle { type: 'wing' | 'feather'; size: number; side: number; flapPhase: number; currentX: number; currentY: number; vy: number; rotation: number; color: string; }
export const wingsEffect: Effect = {
  config: { name: 'wings', description: '翼 + 羽ばたき', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: WingsParticle[] = [];
    particles.push({ id: generateId(), type: 'wing', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 40, side: -1, flapPhase: 0, currentX: x, currentY: y, vy: 0, rotation: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'wing', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 40, side: 1, flapPhase: 0, currentX: x, currentY: y, vy: 0, rotation: 0, color: DEFAULT_COLORS[0] });
    const featherCount = Math.floor(10 * intensity);
    for (let i = 0; i < featherCount; i++) particles.push({ id: generateId(), type: 'feather', x, y, progress: 0, maxProgress: 70, delay: random(10, 40), alpha: 0, size: random(8, 15), side: random(-1, 1) > 0 ? 1 : -1, flapPhase: 0, currentX: x + random(-50, 50), currentY: y + random(-20, 20), vy: random(0.5, 1.5), rotation: random(0, Math.PI), color: DEFAULT_COLORS[Math.floor(random(0, 3))] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as WingsParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'wing') { p.flapPhase += 0.2; p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1; }
    else { p.currentY += p.vy; p.currentX += Math.sin(p.progress * 0.1) * 0.5 * p.side; p.rotation += 0.03 * p.side; p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8; }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as WingsParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'wing') {
      const flapAngle = Math.sin(p.flapPhase) * 0.4;
      ctx.translate(p.x, p.y);
      ctx.scale(p.side, 1);
      ctx.rotate(flapAngle);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.size * 0.5, -p.size * 0.5, p.size, -p.size * 0.3);
      ctx.quadraticCurveTo(p.size * 0.8, 0, p.size, p.size * 0.3);
      ctx.quadraticCurveTo(p.size * 0.5, p.size * 0.2, 0, 0);
      ctx.fill();
    } else {
      ctx.translate(p.currentX, p.currentY);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.2, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
