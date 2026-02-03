/**
 * Vibration エフェクト
 * バイブレーション + 振動 + 揺れ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4444', '#ff6666', '#ff8888'];
interface VibrationParticle extends Particle { type: 'line'; baseX: number; baseY: number; amplitude: number; frequency: number; phase: number; length: number; color: string; }
export const vibrationEffect: Effect = {
  config: { name: 'vibration', description: 'バイブレーション + 振動', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: VibrationParticle[] = [];
    const count = Math.floor(8 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = random(20, 40);
      particles.push({ id: generateId(), type: 'line', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 45, delay: i * 2, alpha: 0, baseX: x + Math.cos(angle) * dist, baseY: y + Math.sin(angle) * dist, amplitude: random(3, 8), frequency: random(0.3, 0.6), phase: random(0, Math.PI * 2), length: random(15, 25), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as VibrationParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.phase += p.frequency;
    p.x = p.baseX + Math.sin(p.phase) * p.amplitude;
    p.y = p.baseY + Math.cos(p.phase * 1.3) * p.amplitude * 0.5;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as VibrationParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) {
      const px = p.x + (i - 5) * 2;
      const py = p.y + Math.sin(p.phase + i * 0.5) * 3;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  },
};
