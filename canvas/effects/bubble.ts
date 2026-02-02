/**
 * Bubble エフェクト
 * 泡 + 上昇 + 弾ける
 * 用途: 水中、軽やか
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

// カラーパレット
const DEFAULT_COLORS = ['#e3f2fd', '#bbdefb', '#90caf9'];

interface BubbleParticle extends Particle {
  type: 'bubble';
  size: number;
  vx: number;
  vy: number;
  wobbleSpeed: number;
  currentX: number;
  currentY: number;
  baseAlpha: number;
}

interface PopParticle extends Particle {
  type: 'pop';
  size: number;
  currentX: number;
  currentY: number;
}

type BubbleEffectParticle = BubbleParticle | PopParticle;

export const bubbleEffect: Effect = {
  config: {
    name: 'bubble',
    description: '泡 + 上昇 + 弾ける',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: BubbleEffectParticle[] = [];

    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const baseAlpha = random(0.3, 0.7);
      particles.push({
        id: generateId(),
        type: 'bubble',
        x: x + random(-50, 50),
        y: y + random(0, 50),
        progress: 0,
        maxProgress: 80 + random(0, 40),
        delay: random(0, 30),
        alpha: baseAlpha,
        size: random(5, 20),
        vx: random(-0.3, 0.3),
        vy: -random(1, 3),
        wobbleSpeed: random(0.05, 0.1),
        currentX: x + random(-50, 50),
        currentY: y + random(0, 50),
        baseAlpha,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as BubbleEffectParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'bubble':
        p.currentX += p.vx + Math.sin(effectiveProgress * p.wobbleSpeed) * 0.5;
        p.currentY += p.vy;

        // ランダムにポップ
        if (random(0, 1) < 0.005) {
          return null;
        }

        p.alpha = p.baseAlpha * (t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1);
        break;

      case 'pop':
        p.size *= 1.1;
        p.alpha = 1 - t;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as BubbleEffectParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'bubble':
        // 泡の外枠
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.stroke();

        // 内側の薄い塗り
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();

        // ハイライト（左上）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(
          p.currentX - p.size * 0.3,
          p.currentY - p.size * 0.3,
          p.size * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // サブハイライト（右下小さめ）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(
          p.currentX + p.size * 0.2,
          p.currentY + p.size * 0.2,
          p.size * 0.1,
          0,
          Math.PI * 2
        );
        ctx.fill();
        break;

      case 'pop':
        // ポップエフェクト（破裂）
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }

    ctx.restore();
  },
};
