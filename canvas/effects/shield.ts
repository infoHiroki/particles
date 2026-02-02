/**
 * Shield エフェクト
 * 球状バリア + 六角形
 * 用途: 防御、シールド、保護
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, easeOutElastic, easeOutCubic } from '../utils';
import { drawRing, drawHexagon, drawGradientCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#4fc3f7', '#29b6f6', '#03a9f4'];

interface BarrierParticle extends Particle {
  type: 'barrier';
  radius: number;
  color: string;
}

interface HexParticle extends Particle {
  type: 'hex';
  size: number;
  rotation: number;
  color: string;
}

interface WaveParticle extends Particle {
  type: 'wave';
  radius: number;
  color: string;
}

type ShieldParticle = BarrierParticle | HexParticle | WaveParticle;

export const shieldEffect: Effect = {
  config: {
    name: 'shield',
    description: '球状バリア + 六角形',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const colors = options.colors ?? DEFAULT_COLORS;
    const color = typeof options.color === 'string' ? options.color : colors[0];
    const particles: ShieldParticle[] = [];

    // 球状バリア
    particles.push({
      id: generateId(),
      type: 'barrier',
      x,
      y,
      progress: 0,
      maxProgress: 80,
      alpha: 0,
      radius: 0,
      color,
    });

    // 六角形パターン
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const distance = 50;
      particles.push({
        id: generateId(),
        type: 'hex',
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        progress: 0,
        maxProgress: 60,
        delay: i * 3,
        alpha: 0,
        size: 20,
        rotation: angle,
        color,
      });
    }

    // 中央の六角形
    particles.push({
      id: generateId(),
      type: 'hex',
      x,
      y,
      progress: 0,
      maxProgress: 70,
      delay: 10,
      alpha: 0,
      size: 25,
      rotation: 0,
      color,
    });

    // エネルギー波
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(),
        type: 'wave',
        x,
        y,
        progress: 0,
        maxProgress: 40,
        delay: 20 + i * 10,
        alpha: 1,
        radius: 60,
        color,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ShieldParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'barrier':
        p.radius = easeOutElastic(Math.min(1, t * 1.5)) * 60;
        p.alpha = t < 0.3 ? (t / 0.3) * 0.4 : t > 0.7 ? ((1 - (t - 0.7) / 0.3) * 0.4) : 0.4;
        break;

      case 'hex':
        p.alpha = t < 0.3 ? (t / 0.3) * 0.8 : t > 0.7 ? ((1 - (t - 0.7) / 0.3) * 0.8) : 0.8;
        break;

      case 'wave':
        p.radius = 60 + easeOutCubic(t) * 40;
        p.alpha = 0.5 * (1 - t);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ShieldParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'barrier':
        // グラデーション球体
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          p.radius * 0.8,
          p.x,
          p.y,
          p.radius
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.8, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // 外枠
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'hex':
        ctx.translate(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const hx = p.size * Math.cos(angle);
          const hy = p.size * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(hx, hy);
          } else {
            ctx.lineTo(hx, hy);
          }
        }
        ctx.closePath();
        ctx.stroke();

        // 内側に薄いフィル
        ctx.fillStyle = `${p.color}33`;
        ctx.fill();
        break;

      case 'wave':
        drawRing(ctx, p.x, p.y, p.radius, p.color, 2, p.alpha);
        break;
    }

    ctx.restore();
  },
};
