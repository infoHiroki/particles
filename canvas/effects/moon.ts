/**
 * Moon エフェクト
 * 月 + 神秘 + 夜
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffcc', '#ffff99', '#ddddaa'];
interface MoonParticle extends Particle { type: 'moon' | 'glow' | 'star'; size: number; twinklePhase: number; color: string; }
export const moonEffect: Effect = {
  config: { name: 'moon', description: '月 + 神秘', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MoonParticle[] = [];
    particles.push({ id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 65, alpha: 0, size: 50, twinklePhase: 0, color: DEFAULT_COLORS[0] });
    particles.push({ id: generateId(), type: 'moon', x, y, progress: 0, maxProgress: 70, delay: 3, alpha: 0, size: 28, twinklePhase: 0, color: DEFAULT_COLORS[0] });
    const starCount = Math.floor(8 * intensity);
    for (let i = 0; i < starCount; i++) {
      particles.push({ id: generateId(), type: 'star', x: x + random(-50, 50), y: y + random(-50, 50), progress: 0, maxProgress: 55, delay: random(5, 30), alpha: 0, size: random(1, 3), twinklePhase: random(0, Math.PI * 2), color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MoonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.twinklePhase += 0.15;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : (p.type === 'star' ? Math.abs(Math.sin(p.twinklePhase)) : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MoonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'moon') {
      // 三日月を直接pathで描画（destination-out不使用）
      const outerR = p.size;
      const innerR = p.size * 0.7;
      const offsetX = p.size * 0.4;
      const offsetY = -p.size * 0.2;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      // 外側の円（時計回り）
      ctx.arc(p.x, p.y, outerR, 0, Math.PI * 2);
      // 内側の円（反時計回り）で切り抜き
      ctx.arc(p.x + offsetX, p.y + offsetY, innerR, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
    } else if (p.type === 'glow') {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + '44');
      g.addColorStop(0.5, p.color + '22');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
