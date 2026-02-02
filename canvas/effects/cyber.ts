/**
 * Cyber エフェクト
 * サイバー + 電脳 + ネオン
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#00ffff', '#ff00ff', '#ffff00'];
interface CyberParticle extends Particle { type: 'line' | 'node'; size: number; angle: number; length: number; color: string; }
export const cyberEffect: Effect = {
  config: { name: 'cyber', description: 'サイバー + 電脳', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CyberParticle[] = [];
    const lineCount = Math.floor(8 * intensity);
    for (let i = 0; i < lineCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({ id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 40, delay: i * 3, alpha: 0, size: 2, angle, length: random(20, 50), color: DEFAULT_COLORS[i % 3] });
    }
    const nodeCount = Math.floor(6 * intensity);
    for (let i = 0; i < nodeCount; i++) {
      particles.push({ id: generateId(), type: 'node', x: x + random(-40, 40), y: y + random(-40, 40), progress: 0, maxProgress: 45, delay: random(5, 20), alpha: 0, size: random(4, 8), angle: 0, length: 0, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CyberParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CyberParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'line') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.angle) * p.length, p.y + Math.sin(p.angle) * p.length);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
