/**
 * Crystal エフェクト
 * 水晶 + 輝き + 神秘
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#cc88ff', '#aa66ff', '#8844ff'];
interface CrystalParticle extends Particle { type: 'crystal' | 'glow' | 'sparkle'; size: number; rotation: number; color: string; }
export const crystalEffect: Effect = {
  config: { name: 'crystal', description: '水晶 + 神秘', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CrystalParticle[] = [];
    particles.push({ id: generateId(), type: 'crystal', x, y, progress: 0, maxProgress: 65, alpha: 0, size: 35, rotation: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 60, delay: 5, alpha: 0, size: 45, rotation: 0, color: DEFAULT_COLORS[1] });
    const sparkleCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkleCount; i++) particles.push({ id: generateId(), type: 'sparkle', x: x + random(-45, 45), y: y + random(-50, 50), progress: 0, maxProgress: 40, delay: random(5, 35), alpha: 0, size: random(2, 4), rotation: 0, color: DEFAULT_COLORS[Math.floor(random(0, 3))] });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CrystalParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'crystal') { p.rotation += 0.01; p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1; }
    else if (p.type === 'glow') { p.size = 45 + Math.sin(p.progress * 0.1) * 8; p.alpha = (t < 0.2 ? t / 0.2 : (1 - t) / 0.8) * 0.5; }
    else { p.alpha = Math.abs(Math.sin(p.progress * 0.3)) * (1 - t); }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CrystalParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'crystal') {
      ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
      ctx.fillStyle = p.color + 'cc'; ctx.shadowColor = p.color; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.moveTo(0, -p.size); ctx.lineTo(p.size * 0.4, -p.size * 0.3); ctx.lineTo(p.size * 0.3, p.size * 0.6); ctx.lineTo(-p.size * 0.3, p.size * 0.6); ctx.lineTo(-p.size * 0.4, -p.size * 0.3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffffff33';
      ctx.beginPath(); ctx.moveTo(-p.size * 0.2, -p.size * 0.6); ctx.lineTo(p.size * 0.1, -p.size * 0.3); ctx.lineTo(0, p.size * 0.2); ctx.lineTo(-p.size * 0.25, -p.size * 0.2); ctx.closePath(); ctx.fill();
    } else if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '66'); g.addColorStop(0.5, p.color + '33'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    } else { ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 6; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  },
};
