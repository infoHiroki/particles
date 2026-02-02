/**
 * Roulette エフェクト
 * ルーレット + 回転 + 賭け
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff0000', '#000000', '#00aa00'];
interface RouletteParticle extends Particle { type: 'wheel' | 'ball' | 'segment'; size: number; rotation: number; rotSpeed: number; segmentIndex: number; color: string; }
export const rouletteEffect: Effect = {
  config: { name: 'roulette', description: 'ルーレット + 回転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: RouletteParticle[] = [];
    particles.push({ id: generateId(), type: 'wheel', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 40, rotation: 0, rotSpeed: 0.15, segmentIndex: 0, color: DEFAULT_COLORS[2] });
    const segmentCount = 12;
    for (let i = 0; i < segmentCount; i++) {
      particles.push({ id: generateId(), type: 'segment', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 35, rotation: 0, rotSpeed: 0.15, segmentIndex: i, color: i % 2 === 0 ? DEFAULT_COLORS[0] : DEFAULT_COLORS[1] });
    }
    particles.push({ id: generateId(), type: 'ball', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 5, rotation: Math.PI, rotSpeed: -0.2, segmentIndex: 0, color: '#ffffff' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RouletteParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += p.rotSpeed * (1 - t * 0.7);
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RouletteParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'wheel') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'segment') {
      const angle = (p.segmentIndex / 12) * Math.PI * 2;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, p.size, angle, angle + Math.PI / 6);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.rotate(-p.rotation * 2);
      const ballDist = 30;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(ballDist, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
