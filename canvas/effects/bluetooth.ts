/**
 * Bluetooth エフェクト
 * Bluetooth + 接続 + 同期
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#0082fc', '#4aa8ff', '#88ccff'];
interface BluetoothParticle extends Particle { type: 'icon' | 'pulse' | 'dot'; size: number; color: string; }
export const bluetoothEffect: Effect = {
  config: { name: 'bluetooth', description: 'Bluetooth + 接続', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BluetoothParticle[] = [];
    particles.push({ id: generateId(), type: 'icon', x, y, progress: 0, maxProgress: 55, alpha: 0, size: 20, color: DEFAULT_COLORS[0] });
    for (let i = 0; i < 3; i++) {
      particles.push({ id: generateId(), type: 'pulse', x, y, progress: 0, maxProgress: 50, delay: i * 10, alpha: 0, size: 25 + i * 15, color: DEFAULT_COLORS[i] });
    }
    const dotCount = Math.floor(4 * intensity);
    for (let i = 0; i < dotCount; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(25, 40);
      particles.push({ id: generateId(), type: 'dot', x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist, progress: 0, maxProgress: 40, delay: random(10, 30), alpha: 0, size: random(2, 4), color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BluetoothParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'pulse') {
      p.size += 0.5;
    }
    p.alpha = t < 0.15 ? t / 0.15 : (1 - t) * (p.type === 'pulse' ? 0.6 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BluetoothParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'icon') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 0.3, p.y - p.size * 0.5);
      ctx.lineTo(p.x + p.size * 0.3, p.y);
      ctx.lineTo(p.x - p.size * 0.3, p.y + p.size * 0.5);
      ctx.moveTo(p.x - p.size * 0.3, p.y + p.size * 0.5);
      ctx.lineTo(p.x + p.size * 0.3, p.y);
      ctx.lineTo(p.x, p.y - p.size * 0.7);
      ctx.lineTo(p.x, p.y + p.size * 0.7);
      ctx.lineTo(p.x + p.size * 0.3, p.y);
      ctx.lineTo(p.x - p.size * 0.3, p.y - p.size * 0.5);
      ctx.stroke();
    } else if (p.type === 'pulse') {
      ctx.strokeStyle = p.color + '88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
