/**
 * Notification エフェクト
 * ベル + 波紋 + バウンス
 * 用途: 通知、アラート
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, easeOutCubic, easeOutElastic } from '../utils';
import { drawRing } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#ffb300', '#ffc107', '#ffca28'];

interface BellParticle extends Particle {
  type: 'bell';
  rotation: number;
  scale: number;
  color: string;
}

interface RippleParticle extends Particle {
  type: 'ripple';
  radius: number;
  color: string;
}

type NotificationParticle = BellParticle | RippleParticle;

export const notificationEffect: Effect = {
  config: {
    name: 'notification',
    description: 'ベル + 波紋 + バウンス',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const colors = options.colors ?? DEFAULT_COLORS;
    const color = colors[0];
    const particles: NotificationParticle[] = [];

    // ベル
    particles.push({
      id: generateId(),
      type: 'bell',
      x,
      y,
      progress: 0,
      maxProgress: 60,
      alpha: 1,
      rotation: 0,
      scale: 0,
      color,
    });

    // 波紋
    for (let i = 0; i < 4; i++) {
      particles.push({
        id: generateId(),
        type: 'ripple',
        x,
        y,
        progress: 0,
        maxProgress: 40,
        delay: i * 8,
        alpha: 1,
        radius: 15,
        color,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as NotificationParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'bell':
        p.scale = easeOutElastic(Math.min(1, t * 2));
        p.rotation = t < 0.5 ? Math.sin(t * 20) * 0.3 * (1 - t * 2) : 0;
        p.alpha = t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;
        break;

      case 'ripple':
        p.radius = 15 + easeOutCubic(t) * 50;
        p.alpha = 1 - easeOutCubic(t);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as NotificationParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'bell':
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scale, p.scale);
        ctx.fillStyle = p.color;

        // ベル本体
        ctx.beginPath();
        ctx.arc(0, -5, 12, Math.PI, 0, false);
        ctx.lineTo(12, 8);
        ctx.lineTo(-12, 8);
        ctx.closePath();
        ctx.fill();

        // 鳴り口
        ctx.beginPath();
        ctx.arc(0, 12, 4, 0, Math.PI * 2);
        ctx.fill();

        // ハンドル
        ctx.beginPath();
        ctx.arc(0, -15, 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'ripple':
        drawRing(ctx, p.x, p.y, p.radius, p.color, 2, p.alpha);
        break;
    }

    ctx.restore();
  },
};
