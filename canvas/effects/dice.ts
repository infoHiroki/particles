/**
 * Dice エフェクト
 * サイコロ + 転がり + 出目
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ff0000', '#333333'];
interface DiceParticle extends Particle { type: 'dice' | 'dot'; size: number; rotation: number; rotSpeed: number; value: number; color: string; }
export const diceEffect: Effect = {
  config: { name: 'dice', description: 'サイコロ + 転がり', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DiceParticle[] = [];
    const count = Math.floor(2 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'dice', x: x + (i - 0.5) * 40, y, progress: 0, maxProgress: 60, delay: i * 5, alpha: 0, size: 30, rotation: 0, rotSpeed: random(0.2, 0.4), value: Math.floor(random(1, 7)), color: DEFAULT_COLORS[0] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DiceParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += p.rotSpeed * (1 - t);
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DiceParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.strokeStyle = DEFAULT_COLORS[2];
    ctx.lineWidth = 2;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.fillStyle = DEFAULT_COLORS[2];
    const dotPositions: Record<number, number[][]> = {
      1: [[0, 0]],
      2: [[-0.3, -0.3], [0.3, 0.3]],
      3: [[-0.3, -0.3], [0, 0], [0.3, 0.3]],
      4: [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]],
      5: [[-0.3, -0.3], [0.3, -0.3], [0, 0], [-0.3, 0.3], [0.3, 0.3]],
      6: [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0], [0.3, 0], [-0.3, 0.3], [0.3, 0.3]],
    };
    const dots = dotPositions[p.value] || [];
    for (const [dx, dy] of dots) {
      ctx.beginPath();
      ctx.arc(dx * p.size, dy * p.size, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
