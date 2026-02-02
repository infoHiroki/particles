/**
 * Clock エフェクト
 * 時計 + 時間 + 回転
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aabbcc', '#8899aa', '#667788'];
interface ClockParticle extends Particle { type: 'face' | 'hand' | 'tick'; size: number; angle: number; speed: number; color: string; }
export const clockEffect: Effect = {
  config: { name: 'clock', description: '時計 + 時間', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: ClockParticle[] = [];
    particles.push({ id: generateId(), type: 'face', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 35, angle: 0, speed: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'hand', x, y, progress: 0, maxProgress: 55, delay: 5, alpha: 0, size: 25, angle: -Math.PI / 2, speed: 0.1, color: DEFAULT_COLORS[1] });
    particles.push({ id: generateId(), type: 'hand', x, y, progress: 0, maxProgress: 55, delay: 5, alpha: 0, size: 18, angle: 0, speed: 0.02, color: DEFAULT_COLORS[1] });
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 - Math.PI / 2; particles.push({ id: generateId(), type: 'tick', x: x + Math.cos(a) * 30, y: y + Math.sin(a) * 30, progress: 0, maxProgress: 50, delay: i * 2, alpha: 0, size: i % 3 === 0 ? 4 : 2, angle: a, speed: 0, color: DEFAULT_COLORS[2] }); }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ClockParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'face') { p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1; }
    else if (p.type === 'hand') { p.angle += p.speed; p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1; }
    else { p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7; }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ClockParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'face') { ctx.strokeStyle = p.color; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.stroke(); }
    else if (p.type === 'hand') { ctx.strokeStyle = p.color; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size); ctx.stroke(); }
    else { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  },
};
