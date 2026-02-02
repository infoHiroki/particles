/**
 * Electric エフェクト
 * 稲妻 + スパーク + グロー
 * 用途: 電気、エネルギー
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic, easeOutQuad } from '../utils';
import { drawCircle, drawGradientCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#00bfff', '#00e5ff', '#18ffff'];

interface LightningSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface LightningParticle extends Particle {
  type: 'lightning';
  angle: number;
  length: number;
  segments: LightningSegment[];
  color: string;
}

interface SparkParticle extends Particle {
  type: 'spark';
  angle: number;
  distance: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface GlowParticle extends Particle {
  type: 'glow';
  radius: number;
  color: string;
}

type ElectricParticle = LightningParticle | SparkParticle | GlowParticle;

export const electricEffect: Effect = {
  config: {
    name: 'electric',
    description: '稲妻 + スパーク + グロー',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: ElectricParticle[] = [];

    // 稲妻
    const lightningCount = Math.floor(5 * intensity);
    for (let i = 0; i < lightningCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'lightning',
        x,
        y,
        progress: 0,
        maxProgress: 15 + random(0, 10),
        delay: random(0, 10),
        alpha: 1,
        angle,
        length: random(40, 80),
        segments: [],
        color: colors[0],
      });
    }

    // スパーク
    const sparkCount = Math.floor(20 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'spark',
        x,
        y,
        progress: 0,
        maxProgress: 20 + random(0, 15),
        delay: random(0, 8),
        alpha: 1,
        angle,
        distance: random(20, 60),
        size: random(1, 3),
        color: '#ffffff',
        currentX: x,
        currentY: y,
      });
    }

    // グロー
    particles.push({
      id: generateId(),
      type: 'glow',
      x,
      y,
      progress: 0,
      maxProgress: 30,
      alpha: 1,
      radius: 10,
      color: colors[0],
    });

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ElectricParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'lightning':
        // 稲妻のセグメントを生成（毎フレームランダムに）
        p.segments = [];
        let cx = p.x,
          cy = p.y;
        const steps = 8;
        for (let i = 0; i < steps; i++) {
          const nextX = cx + Math.cos(p.angle) * (p.length / steps) + random(-10, 10);
          const nextY = cy + Math.sin(p.angle) * (p.length / steps) + random(-10, 10);
          p.segments.push({ x1: cx, y1: cy, x2: nextX, y2: nextY });
          cx = nextX;
          cy = nextY;
        }
        p.alpha = 1 - t;
        break;

      case 'spark':
        const eased = easeOutQuad(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * eased;
        p.alpha = 1 - t;
        break;

      case 'glow':
        p.radius = 10 + easeOutCubic(t) * 50;
        p.alpha = 0.5 * (1 - t);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ElectricParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'lightning':
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        for (const seg of p.segments) {
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }
        break;

      case 'spark':
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#00bfff';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'glow':
        drawGradientCircle(ctx, p.x, p.y, p.radius, p.color, 'transparent', p.alpha);
        break;
    }

    ctx.restore();
  },
};
