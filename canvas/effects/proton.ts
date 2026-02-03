/**
 * Proton エフェクト
 * プロトン + 陽子 + 正電荷
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#ff6666', '#ff8888'];
interface ProtonParticle extends Particle { type: 'core'; size: number; vx: number; vy: number; pulse: number; color: string; }
export const protonEffect: Effect = {
  config: { name: 'proton', description: 'プロトン + 陽子', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: ProtonParticle[] = [];
    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 4);
      particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 50, delay: random(0, 10), alpha: 0, size: random(5, 10), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, pulse: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ProtonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.pulse += 0.15;
    p.alpha = Math.sin(t * Math.PI) * (0.7 + Math.sin(p.pulse) * 0.3);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ProtonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.4, p.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `${p.size * 0.8}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', p.x, p.y);
    ctx.restore();
  },
};
