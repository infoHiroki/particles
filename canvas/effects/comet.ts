/**
 * Comet エフェクト
 * 彗星 + 尾 + 軌跡
 * 用途: 宇宙、流れ星、願い事
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#aaddff', '#88ccff', '#66aaff'];

interface CometParticle extends Particle {
  type: 'comet';
  size: number;
  angle: number;
  speed: number;
  currentX: number;
  currentY: number;
  trail: { x: number; y: number; alpha: number }[];
  color: string;
}

interface DustParticle extends Particle {
  type: 'dust';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

interface SparkleParticle extends Particle {
  type: 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  pulsePhase: number;
  color: string;
}

type CometEffectParticle = CometParticle | DustParticle | SparkleParticle;

export const cometEffect: Effect = {
  config: {
    name: 'comet',
    description: '彗星 + 尾 + 軌跡',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: CometEffectParticle[] = [];

    // メインコメット
    const angle = (options.angle as number) ?? Math.PI / 4;
    particles.push({
      id: generateId(),
      type: 'comet',
      x: x - Math.cos(angle) * 150,
      y: y - Math.sin(angle) * 150,
      progress: 0,
      maxProgress: 60,
      alpha: 1,
      size: 8,
      angle,
      speed: 8,
      currentX: x - Math.cos(angle) * 150,
      currentY: y - Math.sin(angle) * 150,
      trail: [],
      color: colors[0],
    });

    // サブコメット
    for (let i = 0; i < 2; i++) {
      const subAngle = angle + random(-0.2, 0.2);
      const offset = random(20, 50);
      particles.push({
        id: generateId(),
        type: 'comet',
        x: x - Math.cos(angle) * (150 + offset),
        y: y - Math.sin(angle) * (150 + offset) + random(-30, 30),
        progress: 0,
        maxProgress: 55 + random(0, 10),
        delay: random(5, 15),
        alpha: 0.7,
        size: random(3, 5),
        angle: subAngle,
        speed: random(6, 7),
        currentX: x - Math.cos(angle) * (150 + offset),
        currentY: y - Math.sin(angle) * (150 + offset) + random(-30, 30),
        trail: [],
        color: randomPick(colors),
      });
    }

    // 塵パーティクル
    const dustCount = Math.floor(30 * intensity);
    for (let i = 0; i < dustCount; i++) {
      const startX = x + random(-80, 80);
      const startY = y + random(-80, 80);
      particles.push({
        id: generateId(),
        type: 'dust',
        x: startX,
        y: startY,
        progress: 0,
        maxProgress: 40 + random(0, 30),
        delay: random(10, 40),
        alpha: 0,
        size: random(1, 3),
        currentX: startX,
        currentY: startY,
        vx: random(-1, 1),
        vy: random(-1, 1),
        color: randomPick(colors.slice(1)),
      });
    }

    // キラキラ
    const sparkleCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      particles.push({
        id: generateId(),
        type: 'sparkle',
        x: x + random(-100, 100),
        y: y + random(-100, 100),
        progress: 0,
        maxProgress: 30 + random(0, 20),
        delay: random(15, 45),
        alpha: 0,
        size: random(2, 4),
        currentX: x + random(-100, 100),
        currentY: y + random(-100, 100),
        pulsePhase: random(0, Math.PI * 2),
        color: '#ffffff',
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CometEffectParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'comet':
        // 移動
        p.currentX += Math.cos(p.angle) * p.speed;
        p.currentY += Math.sin(p.angle) * p.speed;

        // 軌跡を記録
        p.trail.unshift({ x: p.currentX, y: p.currentY, alpha: 1 });
        if (p.trail.length > 20) p.trail.pop();

        // 軌跡のフェード
        p.trail.forEach((point, i) => {
          point.alpha = 1 - (i / p.trail.length);
        });

        p.alpha = t > 0.7 ? (1 - t) / 0.3 : 1;
        break;

      case 'dust':
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha = t < 0.2 ? t / 0.2 * 0.6 : 0.6 * (1 - (t - 0.2) / 0.8);
        break;

      case 'sparkle':
        p.pulsePhase += 0.2;
        p.alpha = ((Math.sin(p.pulsePhase) + 1) / 2) * (t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CometEffectParticle;
    ctx.save();

    switch (p.type) {
      case 'comet':
        // 軌跡を描画
        if (p.trail.length > 1) {
          for (let i = 1; i < p.trail.length; i++) {
            const prev = p.trail[i - 1];
            const curr = p.trail[i];
            ctx.globalAlpha = p.alpha * curr.alpha * 0.5;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * (1 - i / p.trail.length) * 0.8;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            ctx.stroke();
          }
        }

        // 彗星本体
        ctx.globalAlpha = p.alpha;
        const gradient = ctx.createRadialGradient(
          p.currentX, p.currentY, 0,
          p.currentX, p.currentY, p.size * 2
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, p.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // 核
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'dust':
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'sparkle':
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        // 十字型
        ctx.fillRect(p.currentX - p.size, p.currentY - 0.5, p.size * 2, 1);
        ctx.fillRect(p.currentX - 0.5, p.currentY - p.size, 1, p.size * 2);
        break;
    }

    ctx.restore();
  },
};
