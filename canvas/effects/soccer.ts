/**
 * Soccer エフェクト
 * サッカー + ボール + ゴール
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#222222', '#44aa44'];
interface SoccerParticle extends Particle { type: 'ball' | 'grass' | 'spark'; size: number; vx: number; vy: number; rotation: number; spin: number; color: string; }
export const soccerEffect: Effect = {
  config: { name: 'soccer', description: 'サッカー + ゴール', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SoccerParticle[] = [];
    particles.push({ id: generateId(), type: 'ball', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 16, vx: 3.5, vy: -2.5, rotation: 0, spin: 0.2, color: DEFAULT_COLORS[0] });
    const grassCount = Math.floor(8 * intensity);
    for (let i = 0; i < grassCount; i++) {
      particles.push({ id: generateId(), type: 'grass', x: x + random(-20, 20), y: y + random(5, 15), progress: 0, maxProgress: 40, delay: random(0, 10), alpha: 0, size: random(3, 6), vx: random(-1, 1), vy: random(-2, -0.5), rotation: random(0, Math.PI * 2), spin: random(-0.1, 0.1), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SoccerParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    if (p.type === 'ball') {
      p.vy += 0.1;
    } else {
      p.vy += 0.05;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SoccerParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'ball') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#222222';
      const pentagonAngles = [0, 1.256, 2.512, 3.768, 5.024];
      for (const angle of pentagonAngles) {
        ctx.beginPath();
        const px = Math.cos(angle) * p.size * 0.5;
        const py = Math.sin(angle) * p.size * 0.5;
        ctx.moveTo(px, py - p.size * 0.25);
        for (let i = 1; i <= 5; i++) {
          const a = angle + (i / 5) * Math.PI * 2 / 5;
          ctx.lineTo(px + Math.cos(a - Math.PI/2) * p.size * 0.25, py + Math.sin(a - Math.PI/2) * p.size * 0.25);
        }
        ctx.fill();
      }
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size * 0.3, -p.size, p.size * 0.6, p.size * 2);
    }
    ctx.restore();
  },
};
