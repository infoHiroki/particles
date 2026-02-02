/**
 * Mail エフェクト
 * メール + 封筒 + 送信
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#eeeeee', '#ffdd44'];
interface MailParticle extends Particle { type: 'envelope' | 'sparkle'; size: number; vy: number; rotation: number; color: string; }
export const mailEffect: Effect = {
  config: { name: 'mail', description: 'メール + 封筒', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MailParticle[] = [];
    particles.push({ id: generateId(), type: 'envelope', x, y, progress: 0, maxProgress: 60, delay: 0, alpha: 0, size: 30, vy: -1, rotation: 0, color: DEFAULT_COLORS[0] });
    const sparkleCount = Math.floor(6 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-20, 20), y: y + random(-15, 15), progress: 0, maxProgress: 40, delay: 10 + i * 5, alpha: 0, size: random(3, 5), vy: random(-0.5, 0.5), rotation: 0, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MailParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'envelope') {
      p.y += p.vy;
      p.rotation = Math.sin(t * Math.PI * 2) * 0.1;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MailParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'envelope') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
      ctx.strokeRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
      ctx.beginPath();
      ctx.moveTo(-p.size / 2, -p.size * 0.35);
      ctx.lineTo(0, p.size * 0.1);
      ctx.lineTo(p.size / 2, -p.size * 0.35);
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
