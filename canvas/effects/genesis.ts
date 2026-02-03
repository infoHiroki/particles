/**
 * Genesis エフェクト
 * ジェネシス + 創世 + 誕生
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ff9900', '#ff6600'];
interface GenesisParticle extends Particle { type: 'core' | 'ray'; size: number; angle: number; length: number; pulse: number; color: string; }
export const genesisEffect: Effect = {
  config: { name: 'genesis', description: 'ジェネシス + 創世', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GenesisParticle[] = [];
    particles.push({ id: generateId(), type: 'core', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 5, angle: 0, length: 0, pulse: 0, color: '#ffffff' });
    const rayCount = Math.floor(12 * intensity);
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      particles.push({ id: generateId(), type: 'ray', x, y, progress: 0, maxProgress: 60, delay: 15, alpha: 0, size: 3, angle, length: random(40, 80), pulse: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GenesisParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'core') {
      p.size = 5 + t * 30;
      p.pulse += 0.2;
      p.alpha = Math.sin(t * Math.PI) * (0.8 + Math.sin(p.pulse) * 0.2);
    } else {
      p.pulse += 0.1;
      p.length = 40 + Math.sin(p.pulse) * 20;
      p.alpha = Math.sin(t * Math.PI) * 0.6;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GenesisParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'core') {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.4, '#ffcc44');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const endX = p.x + Math.cos(p.angle) * p.length;
      const endY = p.y + Math.sin(p.angle) * p.length;
      const gradient = ctx.createLinearGradient(p.x, p.y, endX, endY);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    ctx.restore();
  },
};
