/**
 * Bamboo エフェクト
 * 竹 + 和風 + 成長
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#44aa44', '#66bb66', '#88cc88'];
interface BambooParticle extends Particle { type: 'segment' | 'leaf' | 'node'; size: number; segmentIndex: number; leafSide: number; color: string; }
export const bambooEffect: Effect = {
  config: { name: 'bamboo', description: '竹 + 和風', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BambooParticle[] = [];
    for (let i = 0; i < 4; i++) {
      particles.push({ id: generateId(), type: 'segment', x, y: y + 30 - i * 20, progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: 18, segmentIndex: i, leafSide: 0, color: DEFAULT_COLORS[i % 3] });
      particles.push({ id: generateId(), type: 'node', x, y: y + 20 - i * 20, progress: 0, maxProgress: 55, delay: i * 3 + 2, alpha: 0, size: 10, segmentIndex: i, leafSide: 0, color: '#338833' });
    }
    const leafCount = Math.floor(6 * intensity);
    for (let i = 0; i < leafCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const yPos = y + 15 - (i % 3) * 20;
      particles.push({ id: generateId(), type: 'leaf', x: x + side * 8, y: yPos, progress: 0, maxProgress: 50, delay: 10 + i * 3, alpha: 0, size: random(12, 18), segmentIndex: 0, leafSide: side, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BambooParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BambooParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'segment') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(p.x - p.size * 0.25, p.y - p.size * 0.5, p.size * 0.5, p.size, 2);
      ctx.fill();
    } else if (p.type === 'node') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.35, p.size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.leafSide * 0.4);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.leafSide * p.size * 0.8, -p.size * 0.2, p.leafSide * p.size, 0);
      ctx.quadraticCurveTo(p.leafSide * p.size * 0.8, p.size * 0.1, 0, 0);
      ctx.fill();
    }
    ctx.restore();
  },
};
