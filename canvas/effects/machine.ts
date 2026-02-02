/**
 * Machine エフェクト
 * 機械 + 動作 + メカ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#777777', '#999999', '#555555'];
interface MachineParticle extends Particle { type: 'part' | 'light'; size: number; offsetX: number; offsetY: number; phase: number; color: string; }
export const machineEffect: Effect = {
  config: { name: 'machine', description: '機械 + 動作', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MachineParticle[] = [];
    const partCount = Math.floor(6 * intensity);
    for (let i = 0; i < partCount; i++) {
      particles.push({ id: generateId(), type: 'part', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: random(8, 15), offsetX: random(-25, 25), offsetY: random(-25, 25), phase: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    const lightCount = Math.floor(4 * intensity);
    for (let i = 0; i < lightCount; i++) {
      particles.push({ id: generateId(), type: 'light', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 3, offsetX: random(-30, 30), offsetY: random(-30, 30), phase: random(0, Math.PI * 2), color: i % 2 === 0 ? '#ff0000' : '#00ff00' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MachineParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.phase += 0.1;
    if (p.type === 'light') {
      p.alpha = Math.sin(p.phase * 2) > 0 ? 1 : 0.2;
    } else {
      p.alpha = Math.sin(t * Math.PI);
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MachineParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const px = p.x + p.offsetX + Math.sin(p.phase) * 2;
    const py = p.y + p.offsetY + Math.cos(p.phase) * 2;
    if (p.type === 'part') {
      ctx.fillStyle = p.color;
      ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
