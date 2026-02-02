/**
 * Rain エフェクト
 * 雨粒 + 水しぶき
 * 用途: 雨、悲しみ、メランコリー
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#a4c8e8', '#7eb8da', '#5ba3cf'];

interface DropParticle extends Particle {
  type: 'drop';
  length: number;
  speed: number;
  currentX: number;
  currentY: number;
}

interface SplashParticle extends Particle {
  type: 'splash';
  size: number;
  vx: number;
  vy: number;
  currentX: number;
  currentY: number;
}

type RainParticle = DropParticle | SplashParticle;

export const rainEffect: Effect = {
  config: {
    name: 'rain',
    description: '雨粒 + 水しぶき',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RainParticle[] = [];

    // 雨粒
    const dropCount = Math.floor(40 * intensity);
    for (let i = 0; i < dropCount; i++) {
      particles.push({
        id: generateId(),
        type: 'drop',
        x: x + random(-150, 150),
        y: y - 100 + random(-50, 50),
        progress: 0,
        maxProgress: 60 + random(0, 40),
        delay: random(0, 30),
        alpha: random(0.3, 0.7),
        length: random(10, 25),
        speed: random(8, 15),
        currentX: x + random(-150, 150),
        currentY: y - 100 + random(-50, 50),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RainParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    if (p.type === 'drop') {
      p.currentY += p.speed;
      p.currentX += random(-0.5, 0.5);
    } else if (p.type === 'splash') {
      p.vy += 0.3;
      p.currentX += p.vx;
      p.currentY += p.vy;
      p.alpha = 1 - t;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RainParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'drop') {
      const gradient = ctx.createLinearGradient(
        p.currentX, p.currentY - p.length,
        p.currentX, p.currentY
      );
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, '#a4c8e8');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.currentX, p.currentY - p.length);
      ctx.lineTo(p.currentX, p.currentY);
      ctx.stroke();
    } else if (p.type === 'splash') {
      ctx.fillStyle = '#a4c8e8';
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
};
