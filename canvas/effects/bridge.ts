/**
 * Bridge エフェクト
 * 橋 + 架け + 接続
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#996633', '#aa7744', '#cc9966'];
interface BridgeParticle extends Particle { type: 'deck' | 'cable' | 'pillar'; size: number; offsetX: number; color: string; }
export const bridgeEffect: Effect = {
  config: { name: 'bridge', description: '橋 + 架け', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BridgeParticle[] = [];
    particles.push({ id: generateId(), type: 'deck', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 80, offsetX: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'pillar', x: x - 30, y, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: 30, offsetX: -30, color: DEFAULT_COLORS[1] });
    particles.push({ id: generateId(), type: 'pillar', x: x + 30, y, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: 30, offsetX: 30, color: DEFAULT_COLORS[1] });
    const cableCount = Math.floor(6 * intensity);
    for (let i = 0; i < cableCount; i++) {
      const offsetX = -35 + (i / (cableCount - 1)) * 70;
      particles.push({ id: generateId(), type: 'cable', x: x + offsetX, y, progress: 0, maxProgress: 60, delay: 10 + i * 2, alpha: 0, size: 20, offsetX, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BridgeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BridgeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'deck') {
      ctx.fillRect(p.x - p.size / 2, p.y - 3, p.size, 6);
    } else if (p.type === 'pillar') {
      ctx.fillRect(p.x - 4, p.y - p.size, 8, p.size + 5);
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 3);
      ctx.lineTo(p.x, p.y - p.size);
      ctx.stroke();
    }
    ctx.restore();
  },
};
