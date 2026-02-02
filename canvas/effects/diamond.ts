/**
 * Diamond エフェクト
 * ダイアモンド + 輝き + 高級
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#aaddff', '#88ccff', '#66bbff'];
interface DiamondParticle extends Particle { type: 'diamond' | 'sparkle' | 'ray'; size: number; angle: number; color: string; }
export const diamondEffect: Effect = {
  config: { name: 'diamond', description: 'ダイアモンド + 輝き', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DiamondParticle[] = [];
    particles.push({ id: generateId(), type: 'diamond', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 28, angle: 0, color: DEFAULT_COLORS[0] });
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; particles.push({ id: generateId(), type: 'ray', x, y, progress: 0, maxProgress: 45, delay: i * 3, alpha: 0, size: random(25, 40), angle: a, color: DEFAULT_COLORS[i % 3] }); }
    const sparkleCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkleCount; i++) particles.push({ id: generateId(), type: 'sparkle', x: x + random(-40, 40), y: y + random(-40, 40), progress: 0, maxProgress: 35, delay: random(10, 40), alpha: 0, size: random(2, 4), angle: 0, color: '#ffffff' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DiamondParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'diamond') { p.angle += 0.02; p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1; }
    else if (p.type === 'ray') { p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7 * 0.7; }
    else { p.alpha = Math.abs(Math.sin(p.progress * 0.4)) * (1 - t); }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DiamondParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'diamond') {
      ctx.translate(p.x, p.y); ctx.rotate(p.angle);
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(0, -p.size); ctx.lineTo(p.size * 0.7, 0); ctx.lineTo(0, p.size * 0.8); ctx.lineTo(-p.size * 0.7, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffffff44';
      ctx.beginPath(); ctx.moveTo(-p.size * 0.3, -p.size * 0.3); ctx.lineTo(p.size * 0.1, -p.size * 0.5); ctx.lineTo(p.size * 0.2, -p.size * 0.2); ctx.lineTo(-p.size * 0.1, 0); ctx.closePath(); ctx.fill();
    } else if (p.type === 'ray') {
      const g = ctx.createLinearGradient(p.x, p.y, p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size);
      g.addColorStop(0, p.color); g.addColorStop(1, 'transparent');
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + Math.cos(p.angle) * p.size, p.y + Math.sin(p.angle) * p.size); ctx.stroke();
    } else { ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  },
};
