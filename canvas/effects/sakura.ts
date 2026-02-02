/**
 * Sakura エフェクト
 * 桜の花びら + 風
 * 用途: 春、日本風、美しい
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

// カラーパレット
const DEFAULT_COLORS = ['#ffb7c5', '#ffc0cb', '#ff69b4', '#ffb6c1', '#ffa0b4'];

interface PetalParticle extends Particle {
  type: 'petal';
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  color: string;
  currentX: number;
  currentY: number;
  baseAlpha: number;
}

type SakuraParticle = PetalParticle;

export const sakuraEffect: Effect = {
  config: {
    name: 'sakura',
    description: '桜の花びら + 風',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: SakuraParticle[] = [];

    const count = Math.floor(25 * intensity);
    for (let i = 0; i < count; i++) {
      const baseAlpha = random(0.6, 1);
      particles.push({
        id: generateId(),
        type: 'petal',
        x: x + random(-100, 100),
        y: y - 50 + random(-30, 30),
        progress: 0,
        maxProgress: 120 + random(0, 60),
        alpha: baseAlpha,
        size: random(6, 12),
        vx: random(0.5, 2),
        vy: random(0.5, 2),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.05, 0.05),
        wobbleSpeed: random(0.03, 0.08),
        wobbleAmount: random(20, 40),
        color: randomPick(colors),
        currentX: x + random(-100, 100),
        currentY: y - 50 + random(-30, 30),
        baseAlpha,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SakuraParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;

    if (t >= 1) return null;

    p.currentX += p.vx + Math.sin(p.progress * p.wobbleSpeed) * 1;
    p.currentY += p.vy;
    p.rotation += p.rotationSpeed;

    // 風の強さを時間で変化
    p.vx += Math.sin(p.progress * 0.02) * 0.05;

    p.alpha = t > 0.8 ? p.baseAlpha * (1 - (t - 0.8) / 0.2) : p.baseAlpha;

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SakuraParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.currentX, p.currentY);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;

    // 花びら形状（ハート型の半分のような形）
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(
      p.size,
      -p.size,
      p.size,
      p.size * 0.5,
      0,
      p.size
    );
    ctx.bezierCurveTo(
      -p.size,
      p.size * 0.5,
      -p.size,
      -p.size,
      0,
      -p.size
    );
    ctx.fill();

    // 花びらの中心線（軽いアクセント）
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 0.8);
    ctx.lineTo(0, p.size * 0.8);
    ctx.stroke();

    ctx.restore();
  },
};
