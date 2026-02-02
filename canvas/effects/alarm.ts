/**
 * Alarm エフェクト
 * アラーム + 振動 + 起床
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc00', '#ff6600', '#ffffff'];
interface AlarmParticle extends Particle { type: 'clock' | 'bell' | 'wave'; size: number; shake: number; color: string; }
export const alarmEffect: Effect = {
  config: { name: 'alarm', description: 'アラーム + 振動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: AlarmParticle[] = [];
    particles.push({ id: generateId(), type: 'clock', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 30, shake: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'bell', x: x - 20, y: y - 25, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 10, shake: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'bell', x: x + 20, y: y - 25, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 10, shake: 0, color: DEFAULT_COLORS[0] });
    const waveCount = Math.floor(4 * intensity);
    for (let i = 0; i < waveCount; i++) {
      particles.push({ id: generateId(), type: 'wave', x, y, progress: 0, maxProgress: 40, delay: i * 12, alpha: 0, size: 35 + i * 10, shake: 0, color: DEFAULT_COLORS[1] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as AlarmParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.shake = Math.sin(p.progress * 0.8) * 3;
    if (p.type === 'wave') {
      p.size += 0.5;
    }
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'wave' ? 0.5 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as AlarmParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'clock') {
      ctx.translate(p.x + p.shake, p.y);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -p.size * 0.6);
      ctx.moveTo(0, 0);
      ctx.lineTo(p.size * 0.4, 0);
      ctx.stroke();
    } else if (p.type === 'bell') {
      ctx.translate(p.x + p.shake, p.y);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
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
