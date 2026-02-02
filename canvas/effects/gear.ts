/**
 * Gear エフェクト
 * 歯車 + 回転 + 機械
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#888888', '#666666', '#aaaaaa'];
interface GearParticle extends Particle { type: 'gear'; size: number; teeth: number; rotation: number; rotSpeed: number; color: string; }
export const gearEffect: Effect = {
  config: { name: 'gear', description: '歯車 + 回転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: GearParticle[] = [];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      const offsetX = (i - 1) * 35;
      particles.push({ id: generateId(), type: 'gear', x: x + offsetX, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 20 - i * 3, teeth: 8 + i * 2, rotation: i * 0.2, rotSpeed: (i % 2 === 0 ? 1 : -1) * 0.05, color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GearParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GearParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    for (let i = 0; i < p.teeth; i++) {
      const angle = (i / p.teeth) * Math.PI * 2;
      const nextAngle = ((i + 0.5) / p.teeth) * Math.PI * 2;
      const outerR = p.size;
      const innerR = p.size * 0.7;
      ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
      ctx.lineTo(Math.cos(nextAngle) * innerR, Math.sin(nextAngle) * innerR);
    }
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#444444';
    ctx.fill();
    ctx.restore();
  },
};
