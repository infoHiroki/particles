/**
 * Heartbeat エフェクト
 * ハート + 鼓動 + 波動
 * 用途: 愛、感情、バイタルサイン
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff4466', '#ff6688', '#ff88aa', '#ffaacc'];

interface HeartParticle extends Particle {
  type: 'heart';
  scale: number;
  targetScale: number;
  color: string;
  beatPhase: number;
}

interface PulseParticle extends Particle {
  type: 'pulse';
  radius: number;
  maxRadius: number;
  color: string;
}

interface SparkleParticle extends Particle {
  type: 'sparkle';
  size: number;
  angle: number;
  distance: number;
  currentX: number;
  currentY: number;
  color: string;
}

interface FloatParticle extends Particle {
  type: 'float';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

type HeartbeatParticle = HeartParticle | PulseParticle | SparkleParticle | FloatParticle;

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(
    x, y,
    x - size, y,
    x - size, y + size * 0.3
  );
  ctx.bezierCurveTo(
    x - size, y + size * 0.6,
    x, y + size,
    x, y + size
  );
  ctx.bezierCurveTo(
    x, y + size,
    x + size, y + size * 0.6,
    x + size, y + size * 0.3
  );
  ctx.bezierCurveTo(
    x + size, y,
    x, y,
    x, y + size * 0.3
  );
  ctx.closePath();
}

export const heartbeatEffect: Effect = {
  config: {
    name: 'heartbeat',
    description: 'ハート + 鼓動 + 波動',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: HeartbeatParticle[] = [];

    // メインハート
    particles.push({
      id: generateId(),
      type: 'heart',
      x,
      y: y - 20,
      progress: 0,
      maxProgress: 80,
      alpha: 0,
      scale: 0.5,
      targetScale: 1,
      color: colors[0],
      beatPhase: 0,
    });

    // 波動（複数）
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(),
        type: 'pulse',
        x,
        y,
        progress: 0,
        maxProgress: 50,
        delay: i * 15,
        alpha: 0,
        radius: 20,
        maxRadius: 80 + i * 20,
        color: colors[1],
      });
    }

    // キラキラ
    const sparkleCount = Math.floor(12 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2;
      particles.push({
        id: generateId(),
        type: 'sparkle',
        x,
        y,
        progress: 0,
        maxProgress: 40 + random(0, 20),
        delay: 10 + random(0, 15),
        alpha: 0,
        size: random(2, 4),
        angle,
        distance: random(50, 90),
        currentX: x,
        currentY: y,
        color: randomPick(colors),
      });
    }

    // 浮遊ハート
    const floatCount = Math.floor(8 * intensity);
    for (let i = 0; i < floatCount; i++) {
      particles.push({
        id: generateId(),
        type: 'float',
        x: x + random(-60, 60),
        y: y + random(-30, 30),
        progress: 0,
        maxProgress: 70 + random(0, 30),
        delay: random(5, 25),
        alpha: 0,
        size: random(8, 16),
        currentX: x + random(-60, 60),
        currentY: y + random(-30, 30),
        vx: random(-0.5, 0.5),
        vy: random(-1.5, -0.5),
        rotation: random(0, Math.PI / 4),
        rotationSpeed: random(-0.05, 0.05),
        color: randomPick(colors),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HeartbeatParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'heart':
        p.beatPhase += 0.3;
        // 鼓動アニメーション
        const beat = Math.sin(p.beatPhase);
        const beatScale = beat > 0.8 ? 1 + (beat - 0.8) * 0.5 : 1;

        p.scale = p.targetScale * beatScale * (t < 0.2 ? easeOutCubic(t / 0.2) : 1);
        p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
        break;

      case 'pulse':
        const eased = easeOutCubic(t);
        p.radius = 20 + (p.maxRadius - 20) * eased;
        p.alpha = 1 - eased;
        break;

      case 'sparkle':
        const sparkleEased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * sparkleEased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * sparkleEased;
        p.alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        break;

      case 'float':
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 0.8;
        p.size *= 0.995;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HeartbeatParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'heart':
        ctx.translate(p.x, p.y);
        ctx.scale(p.scale, p.scale);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        drawHeart(ctx, 0, -20, 30);
        ctx.fill();
        break;

      case 'pulse':
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;

        // ハート型の波動
        ctx.translate(p.x, p.y);
        const pulseScale = p.radius / 50;
        ctx.scale(pulseScale, pulseScale);
        drawHeart(ctx, 0, -20, 30);
        ctx.stroke();
        break;

      case 'sparkle':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        // 星型
        const spikes = 4;
        const outerRadius = p.size;
        const innerRadius = p.size * 0.4;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
          const sx = p.currentX + Math.cos(angle) * radius;
          const sy = p.currentY + Math.sin(angle) * radius;
          if (i === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'float':
        ctx.translate(p.currentX, p.currentY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        drawHeart(ctx, 0, -p.size / 3, p.size / 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
