/**
 * Card エフェクト
 * カード + めくり + トランプ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffffff', '#ff0000', '#000000'];
interface CardParticle extends Particle { type: 'card' | 'sparkle'; size: number; rotation: number; flip: number; suit: string; color: string; }
export const cardEffect: Effect = {
  config: { name: 'card', description: 'カード + めくり', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CardParticle[] = [];
    const suits = ['♠', '♥', '♦', '♣'];
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      const suit = suits[i % 4];
      const isRed = suit === '♥' || suit === '♦';
      particles.push({ id: generateId(), type: 'card', x: x + (i - 1) * 25, y, progress: 0, maxProgress: 60, delay: i * 10, alpha: 0, size: 40, rotation: random(-0.2, 0.2), flip: 0, suit, color: isRed ? DEFAULT_COLORS[1] : DEFAULT_COLORS[2] });
    }
    const sparkleCount = Math.floor(8 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({ id: generateId(), type: 'sparkle', x: x + random(-40, 40), y: y + random(-30, 30), progress: 0, maxProgress: 40, delay: 20 + i * 3, alpha: 0, size: random(2, 4), rotation: 0, flip: 0, suit: '', color: '#ffdd00' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CardParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'card') {
      p.flip = Math.sin(t * Math.PI);
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CardParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'card') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.flip, 1);
      ctx.fillStyle = DEFAULT_COLORS[0];
      ctx.strokeStyle = '#888888';
      ctx.lineWidth = 1;
      ctx.fillRect(-p.size / 3, -p.size / 2, p.size * 0.66, p.size);
      ctx.strokeRect(-p.size / 3, -p.size / 2, p.size * 0.66, p.size);
      ctx.fillStyle = p.color;
      ctx.font = `bold 20px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.suit, 0, 0);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
