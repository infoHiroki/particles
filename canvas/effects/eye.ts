/**
 * Eye エフェクト
 * 目 + 瞳 + 視線
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#88ccff', '#44aaff', '#0088ff'];
interface EyeParticle extends Particle { type: 'white' | 'iris' | 'pupil' | 'sparkle'; size: number; lookX: number; lookY: number; color: string; }
export const eyeEffect: Effect = {
  config: { name: 'eye', description: '目 + 視線', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: EyeParticle[] = [];
    particles.push({ id: generateId(), type: 'white', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 30, lookX: 0, lookY: 0, color: '#ffffff' });
    particles.push({ id: generateId(), type: 'iris', x, y, progress: 0, maxProgress: 55, delay: 3, alpha: 0, size: 18, lookX: 0, lookY: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'pupil', x, y, progress: 0, maxProgress: 55, delay: 5, alpha: 0, size: 8, lookX: 0, lookY: 0, color: '#000000' });
    const sparkleCount = Math.floor(4 * intensity);
    for (let i = 0; i < sparkleCount; i++) particles.push({ id: generateId(), type: 'sparkle', x: x - 8 + random(-3, 3), y: y - 8 + random(-3, 3), progress: 0, maxProgress: 40, delay: random(10, 30), alpha: 0, size: random(2, 4), lookX: 0, lookY: 0, color: '#ffffff' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as EyeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.lookX = Math.sin(p.progress * 0.1) * 5;
    p.lookY = Math.cos(p.progress * 0.08) * 3;
    if (p.type === 'sparkle') p.alpha = Math.abs(Math.sin(p.progress * 0.3)) * (1 - t);
    else p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as EyeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'white') { ctx.fillStyle = p.color; ctx.shadowColor = '#aaaaaa'; ctx.shadowBlur = 5; ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size, p.size * 0.7, 0, 0, Math.PI * 2); ctx.fill(); }
    else if (p.type === 'iris') { const g = ctx.createRadialGradient(p.x + p.lookX, p.y + p.lookY, 0, p.x + p.lookX, p.y + p.lookY, p.size); g.addColorStop(0, DEFAULT_COLORS[2]); g.addColorStop(0.7, DEFAULT_COLORS[0]); g.addColorStop(1, DEFAULT_COLORS[1]); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x + p.lookX, p.y + p.lookY, p.size, 0, Math.PI * 2); ctx.fill(); }
    else if (p.type === 'pupil') { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x + p.lookX, p.y + p.lookY, p.size, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 5; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  },
};
