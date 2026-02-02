/**
 * Snow エフェクト
 * 雪の結晶 + 風による揺れ
 * 用途: 冬、クリスマス
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
import { drawCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#ffffff', '#e3f2fd', '#bbdefb'];

interface FlakeParticle extends Particle {
  type: 'flake';
  size: number;
  vx: number;
  vy: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  rotation: number;
  rotationSpeed: number;
  isDetailed: boolean;
  currentX: number;
  currentY: number;
}

type SnowParticle = FlakeParticle;

export const snowEffect: Effect = {
  config: {
    name: 'snow',
    description: '雪の結晶 + 風による揺れ',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SnowParticle[] = [];

    const count = Math.floor(30 * intensity);
    for (let i = 0; i < count; i++) {
      const isDetailed = random(0, 1) > 0.7;
      particles.push({
        id: generateId(),
        type: 'flake',
        x: x + random(-100, 100),
        y: y - 50,
        progress: 0,
        maxProgress: 120 + random(0, 60),
        alpha: random(0.5, 1),
        size: isDetailed ? random(6, 12) : random(3, 8),
        vx: random(-0.5, 0.5),
        vy: random(1, 3),
        wobbleSpeed: random(0.02, 0.05),
        wobbleAmount: random(20, 40),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.02, 0.02),
        isDetailed,
        currentX: x + random(-100, 100),
        currentY: y - 50,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SnowParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;

    if (t >= 1) return null;

    p.currentX += p.vx + Math.sin(p.progress * p.wobbleSpeed) * 0.5;
    p.currentY += p.vy;
    p.rotation += p.rotationSpeed;

    if (t > 0.8) {
      p.alpha = p.alpha * (1 - (t - 0.8) / 0.2);
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SnowParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.currentX, p.currentY);
    ctx.rotate(p.rotation);

    if (p.isDetailed) {
      // 雪の結晶（六芒星風）
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      // 6本の腕
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);

        // メインの腕
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -p.size);
        ctx.stroke();

        // 枝
        const branchLength = p.size * 0.4;
        const branchY = p.size * 0.5;

        ctx.beginPath();
        ctx.moveTo(0, -branchY);
        ctx.lineTo(-branchLength * 0.5, -branchY - branchLength * 0.5);
        ctx.moveTo(0, -branchY);
        ctx.lineTo(branchLength * 0.5, -branchY - branchLength * 0.5);
        ctx.stroke();

        ctx.restore();
      }
    } else {
      // シンプルな雪片
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
};
