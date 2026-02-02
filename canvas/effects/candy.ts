/**
 * Candy エフェクト
 * キャンディ + カラフル + 甘い
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6699', '#66ccff', '#ffcc00', '#99ff66'];
interface CandyParticle extends Particle { type: 'candy' | 'wrapper' | 'sparkle'; size: number; vx: number; vy: number; rotation: number; spin: number; color: string; }
export const candyEffect: Effect = {
  config: { name: 'candy', description: 'キャンディ + カラフル', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CandyParticle[] = [];
    const candyCount = Math.floor(4 * intensity);
    for (let i = 0; i < candyCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 2);
      particles.push({ id: generateId(), type: 'candy', x, y, progress: 0, maxProgress: 55, delay: i * 4, alpha: 0, size: random(10, 14), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rotation: random(0, Math.PI * 2), spin: random(-0.1, 0.1), color: DEFAULT_COLORS[i % 4] });
    }
    for (let i = 0; i < 5; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-25, 25), y: y + random(-25, 25), progress: 0, maxProgress: 40, delay: random(5, 25), alpha: 0, size: random(2, 4), vx: 0, vy: 0, rotation: 0, spin: 0, color: '#ffffff' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CandyParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'candy') {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.rotation += p.spin;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CandyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.type === 'candy') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.lineTo(-p.size * 1.5, -p.size * 0.4);
      ctx.lineTo(-p.size * 1.5, p.size * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.size, 0);
      ctx.lineTo(p.size * 1.5, -p.size * 0.4);
      ctx.lineTo(p.size * 1.5, p.size * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.5, -0.5, 0.5);
      ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
