/**
 * Discord エフェクト
 * ディスコード + 不協和 + 衝突
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0044', '#ff4400', '#ff0088'];
interface DiscordParticle extends Particle { type: 'shard'; size: number; vx: number; vy: number; rotation: number; rotSpeed: number; color: string; }
export const discordEffect: Effect = {
  config: { name: 'discord', description: 'ディスコード + 不協和', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DiscordParticle[] = [];
    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(3, 7);
      particles.push({ id: generateId(), type: 'shard', x, y, progress: 0, maxProgress: 40, delay: random(0, 5), alpha: 0, size: random(4, 10), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rotation: random(0, Math.PI * 2), rotSpeed: random(-0.3, 0.3), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DiscordParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx + random(-1, 1);
    p.y += p.vy + random(-1, 1);
    p.rotation += p.rotSpeed;
    p.alpha = (1 - t);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DiscordParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.lineTo(p.size * 0.5, p.size * 0.5);
    ctx.lineTo(-p.size * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};
