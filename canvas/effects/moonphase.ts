/**
 * Moonphase エフェクト
 * ムーンフェイズ + 月齢 + 満ち欠け
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#f0f0d0', '#e0e0c0', '#d0d0b0'];
interface MoonphaseParticle extends Particle { type: 'moon'; size: number; phase: number; glow: number; color: string; }
export const moonphaseEffect: Effect = {
  config: { name: 'moonphase', description: 'ムーンフェイズ + 月齢', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const particles: MoonphaseParticle[] = [];
    particles.push({ id: generateId(), type: 'moon', x, y, progress: 0, maxProgress: 100, delay: 0, alpha: 0, size: 30, phase: 0, glow: 0, color: DEFAULT_COLORS[0] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MoonphaseParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.phase = t * Math.PI * 2;
    p.glow = Math.sin(t * Math.PI * 4) * 0.3 + 0.7;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MoonphaseParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha * 0.3;
    const glowGradient = ctx.createRadialGradient(p.x, p.y, p.size, p.x, p.y, p.size * 1.5);
    glowGradient.addColorStop(0, `rgba(240,240,200,${p.glow})`);
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a2e';
    const shadowOffset = Math.cos(p.phase) * p.size;
    ctx.beginPath();
    ctx.arc(p.x + shadowOffset * 0.5, p.y, p.size * 0.95, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.9, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.restore();
  },
};
