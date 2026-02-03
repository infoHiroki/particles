/**
 * Plastic エフェクト
 * プラスチック + 光沢 + 弾性
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4757', '#2ed573', '#1e90ff'];
interface PlasticParticle extends Particle { type: 'piece'; size: number; rotation: number; rotSpeed: number; vx: number; vy: number; bounce: number; color: string; }
export const plasticEffect: Effect = {
  config: { name: 'plastic', description: 'プラスチック + 光沢', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PlasticParticle[] = [];
    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(3, 6);
      particles.push({ id: generateId(), type: 'piece', x, y, progress: 0, maxProgress: 50, delay: 0, alpha: 0, size: random(4, 10), rotation: random(0, Math.PI * 2), rotSpeed: random(-0.2, 0.2), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, bounce: 0.7, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PlasticParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.rotation += p.rotSpeed;
    p.alpha = (1 - t) * 0.9;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PlasticParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size * 0.4, p.size * 0.3);
    ctx.restore();
  },
};
