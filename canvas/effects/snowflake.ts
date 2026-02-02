/**
 * Snowflake エフェクト
 * 雪の結晶 + 雪片 + クリスタル
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeff', '#ddddff'];
interface SnowflakeParticle extends Particle { type: 'flake'; size: number; rotation: number; rotSpeed: number; vy: number; color: string; }
export const snowflakeEffect: Effect = {
  config: { name: 'snowflake', description: '雪の結晶 + 雪片', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SnowflakeParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'flake', x: x + random(-40, 40), y: y + random(-30, 30), progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: random(8, 14), rotation: random(0, Math.PI * 2), rotSpeed: random(-0.03, 0.03), vy: random(0.5, 1), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SnowflakeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SnowflakeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -p.size);
      ctx.moveTo(0, -p.size * 0.6);
      ctx.lineTo(-p.size * 0.3, -p.size * 0.8);
      ctx.moveTo(0, -p.size * 0.6);
      ctx.lineTo(p.size * 0.3, -p.size * 0.8);
      ctx.stroke();
    }
    ctx.restore();
  },
};
