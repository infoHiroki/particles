/**
 * Music エフェクト
 * 音楽 + 音符 + リズム
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff88ff', '#ff66ff', '#ff44ff'];
interface MusicParticle extends Particle { type: 'note' | 'wave'; size: number; currentX: number; currentY: number; vx: number; vy: number; noteType: number; color: string; }
export const musicEffect: Effect = {
  config: { name: 'music', description: '音楽 + 音符', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MusicParticle[] = [];
    const noteCount = Math.floor(8 * intensity);
    for (let i = 0; i < noteCount; i++) particles.push({ id: generateId(), type: 'note', x, y, progress: 0, maxProgress: 50, delay: random(0, 25), alpha: 0, size: random(15, 22), currentX: x + random(-30, 30), currentY: y, vx: random(-1, 1), vy: -random(2, 4), noteType: Math.floor(random(0, 2)), color: DEFAULT_COLORS[Math.floor(random(0, 3))] });
    for (let i = 0; i < 5; i++) particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 40, delay: i * 5, alpha: 0, size: 20, currentX: x, currentY: y, vx: 0, vy: 0, noteType: 0, color: DEFAULT_COLORS[0] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MusicParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'note') { p.currentX += p.vx + Math.sin(p.progress * 0.1) * 0.5; p.currentY += p.vy; p.vy *= 0.98; p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8; }
    else { p.size = 20 + t * 40; p.alpha = (1 - t) * 0.5; }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MusicParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'note') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(p.currentX, p.currentY, p.size * 0.5, p.size * 0.35, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.currentX + p.size * 0.4, p.currentY - p.size * 0.2);
      ctx.lineTo(p.currentX + p.size * 0.4, p.currentY - p.size);
      ctx.stroke();
      if (p.noteType === 1) {
        ctx.beginPath();
        ctx.moveTo(p.currentX + p.size * 0.4, p.currentY - p.size);
        ctx.quadraticCurveTo(p.currentX + p.size * 0.8, p.currentY - p.size * 0.7, p.currentX + p.size * 0.4, p.currentY - p.size * 0.5);
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },
};
