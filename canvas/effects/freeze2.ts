/**
 * Freeze2 エフェクト
 * 凍結 + 氷結 + 冷凍
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ddff', '#aaeeff', '#ccffff'];
interface Freeze2Particle extends Particle { type: 'crystal' | 'shard'; size: number; rotation: number; rotSpeed: number; vx: number; vy: number; color: string; }
export const freeze2Effect: Effect = {
  config: { name: 'freeze2', description: '凍結 + 氷結', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: Freeze2Particle[] = [];
    particles.push({ id: generateId(), type: 'crystal', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: 25, rotation: 0, rotSpeed: 0, vx: 0, vy: 0, color: DEFAULT_COLORS[0] });
    const shardCount = Math.floor(12 * intensity);
    for (let i = 0; i < shardCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 3);
      particles.push({ id: generateId(), type: 'shard', x, y, progress: 0, maxProgress: 40, delay: 10, alpha: 0, size: random(3, 6), rotation: random(0, Math.PI * 2), rotSpeed: random(-0.1, 0.1), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as Freeze2Particle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'shard') {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.rotation += p.rotSpeed;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as Freeze2Particle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    if (p.type === 'crystal') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(angle) * p.size;
        const py = Math.sin(angle) * p.size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    }
    ctx.restore();
  },
};
