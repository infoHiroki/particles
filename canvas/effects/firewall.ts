/**
 * Firewall エフェクト
 * ファイアウォール + 防壁 + シールド
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff8800', '#ffaa44', '#ffcc88'];
interface FirewallParticle extends Particle { type: 'wall' | 'spark'; size: number; vy: number; color: string; }
export const firewallEffect: Effect = {
  config: { name: 'firewall', description: 'ファイアウォール + 防壁', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FirewallParticle[] = [];
    const wallCount = Math.floor(5 * intensity);
    for (let i = 0; i < wallCount; i++) {
      particles.push({ id: generateId(), type: 'wall', x, y: y + (i - 2) * 12, progress: 0, maxProgress: 50, delay: i * 3, alpha: 0, size: 60, vy: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const sparkCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({ id: generateId(), type: 'spark', x: x + random(-30, 30), y: y + random(-30, 30), progress: 0, maxProgress: 40, delay: random(5, 25), alpha: 0, size: random(2, 4), vy: random(-1, -0.5), color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FirewallParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'spark') {
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FirewallParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'wall') {
      const grad = ctx.createLinearGradient(p.x - p.size / 2, p.y, p.x + p.size / 2, p.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x - p.size / 2, p.y - 4, p.size, 8);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
