/**
 * Cog エフェクト
 * コグ + 噛み合い + 連動
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#996633', '#aa7744', '#bb8855'];
interface CogParticle extends Particle { type: 'cog'; size: number; teeth: number; rotation: number; rotSpeed: number; centerX: number; centerY: number; color: string; }
export const cogEffect: Effect = {
  config: { name: 'cog', description: 'コグ + 噛み合い', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CogParticle[] = [];
    particles.push({ id: generateId(), type: 'cog', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 25, teeth: 10, rotation: 0, rotSpeed: 0.04, centerX: x, centerY: y, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'cog', x: x + 38, y: y - 5, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 18, teeth: 8, rotation: Math.PI / 8, rotSpeed: -0.05, centerX: x + 38, centerY: y - 5, color: DEFAULT_COLORS[1] });
    if (intensity > 0.5) {
      particles.push({ id: generateId(), type: 'cog', x: x - 35, y: y + 10, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 20, teeth: 9, rotation: 0.1, rotSpeed: -0.045, centerX: x - 35, centerY: y + 10, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CogParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CogParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.centerX, p.centerY);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    for (let i = 0; i < p.teeth; i++) {
      const angle = (i / p.teeth) * Math.PI * 2;
      const midAngle = ((i + 0.4) / p.teeth) * Math.PI * 2;
      const nextAngle = ((i + 0.6) / p.teeth) * Math.PI * 2;
      ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
      ctx.lineTo(Math.cos(midAngle) * p.size, Math.sin(midAngle) * p.size);
      ctx.lineTo(Math.cos(midAngle) * (p.size * 0.75), Math.sin(midAngle) * (p.size * 0.75));
      ctx.lineTo(Math.cos(nextAngle) * (p.size * 0.75), Math.sin(nextAngle) * (p.size * 0.75));
    }
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#553322';
    ctx.fill();
    ctx.restore();
  },
};
