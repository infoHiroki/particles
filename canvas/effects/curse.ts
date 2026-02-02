/**
 * Curse エフェクト
 * 呪い + 呪詛 + カース
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#8800aa', '#aa22cc', '#cc44ee'];
interface CurseParticle extends Particle { type: 'rune' | 'wisp'; size: number; rotation: number; rotSpeed: number; vy: number; color: string; }
export const curseEffect: Effect = {
  config: { name: 'curse', description: '呪い + 呪詛', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CurseParticle[] = [];
    particles.push({ id: generateId(), type: 'rune', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, rotation: 0, rotSpeed: 0.03, vy: 0, color: DEFAULT_COLORS[0] });
    const wispCount = Math.floor(10 * intensity);
    for (let i = 0; i < wispCount; i++) {
      particles.push({ id: generateId(), type: 'wisp', x: x + random(-30, 30), y: y + random(-20, 20), progress: 0, maxProgress: 50, delay: random(10, 30), alpha: 0, size: random(3, 6), rotation: 0, rotSpeed: 0, vy: random(-0.5, -0.2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CurseParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'rune') {
      p.rotation += p.rotSpeed;
    } else {
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI) * 0.8;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CurseParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'rune') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
      }
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
