/**
 * Jackpot エフェクト
 * ジャックポット + 大当たり + 祝福
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ff6600', '#ffffff'];
interface JackpotParticle extends Particle { type: 'text' | 'coin' | 'star'; size: number; vx: number; vy: number; gravity: number; rotation: number; color: string; }
export const jackpotEffect: Effect = {
  config: { name: 'jackpot', description: 'ジャックポット + 大当たり', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: JackpotParticle[] = [];
    particles.push({ id: generateId(), type: 'text', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 30, vx: 0, vy: 0, gravity: 0, rotation: 0, color: DEFAULT_COLORS[0] });
    const coinCount = Math.floor(15 * intensity);
    for (let i = 0; i < coinCount; i++) {
      particles.push({ id: generateId(), type: 'coin', x, y: y - 30, progress: 0, maxProgress: 60, delay: 10 + i * 2, alpha: 0, size: random(8, 12), vx: random(-3, 3), vy: random(-4, -2), gravity: 0.15, rotation: random(0, Math.PI * 2), color: DEFAULT_COLORS[0] });
    }
    const starCount = Math.floor(10 * intensity);
    for (let i = 0; i < starCount; i++) {
      particles.push({ id: generateId(), type: 'star', x: x + random(-50, 50), y: y + random(-40, 40), progress: 0, maxProgress: 50, delay: random(0, 20), alpha: 0, size: random(4, 8), vx: 0, vy: 0, gravity: 0, rotation: 0, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as JackpotParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'coin') {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += 0.2;
    } else if (p.type === 'text') {
      p.size = 30 + Math.sin(p.progress * 0.2) * 5;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as JackpotParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'text') {
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#ff6600';
      ctx.lineWidth = 2;
      ctx.font = `bold ${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('JACKPOT!', p.x, p.y);
      ctx.fillText('JACKPOT!', p.x, p.y);
    } else if (p.type === 'coin') {
      ctx.translate(p.x, p.y);
      ctx.scale(Math.cos(p.rotation), 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cc9900';
      ctx.font = `bold ${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 0);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? p.size : p.size * 0.4;
        if (i === 0) ctx.moveTo(p.x + Math.cos(angle) * r, p.y + Math.sin(angle) * r);
        else ctx.lineTo(p.x + Math.cos(angle) * r, p.y + Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },
};
