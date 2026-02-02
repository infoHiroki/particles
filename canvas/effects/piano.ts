/**
 * Piano エフェクト
 * ピアノ + 鍵盤 + 音符
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#333333', '#ffdd44'];
interface PianoParticle extends Particle { type: 'key' | 'note'; size: number; vy: number; isBlack: boolean; color: string; }
export const pianoEffect: Effect = {
  config: { name: 'piano', description: 'ピアノ + 鍵盤', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PianoParticle[] = [];
    for (let i = 0; i < 7; i++) {
      particles.push({ id: generateId(), type: 'key', x: x - 42 + i * 12, y, progress: 0, maxProgress: 50, delay: i * 3, alpha: 0, size: 10, vy: 0, isBlack: false, color: DEFAULT_COLORS[0] });
    }
    const blackKeys = [0, 1, 3, 4, 5];
    for (const i of blackKeys) {
      particles.push({ id: generateId(), type: 'key', x: x - 36 + i * 12, y: y - 10, progress: 0, maxProgress: 50, delay: i * 3 + 2, alpha: 0, size: 8, vy: 0, isBlack: true, color: DEFAULT_COLORS[1] });
    }
    const noteCount = Math.floor(5 * intensity);
    for (let i = 0; i < noteCount; i++) {
      particles.push({ id: generateId(), type: 'note', x: x + random(-30, 30), y: y - 20, progress: 0, maxProgress: 60, delay: 20 + i * 8, alpha: 0, size: 10, vy: -1.5, isBlack: false, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PianoParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'note') {
      p.y += p.vy;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PianoParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'key') {
      ctx.fillStyle = p.color;
      const h = p.isBlack ? 20 : 30;
      ctx.fillRect(p.x - p.size / 2, p.y - h / 2, p.size, h);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.6, p.size * 0.4, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x + p.size * 0.5, p.y);
      ctx.lineTo(p.x + p.size * 0.5, p.y - p.size);
      ctx.stroke();
    }
    ctx.restore();
  },
};
