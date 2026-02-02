/**
 * Freeze エフェクト
 * 凍結 + 氷結晶 + 霜
 * 用途: 氷魔法、凍結状態、冬
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#88ddff', '#aaeeff', '#ccffff', '#ffffff'];

interface CrystalParticle extends Particle {
  type: 'crystal';
  size: number;
  rotation: number;
  currentX: number;
  currentY: number;
  angle: number;
  distance: number;
  spikes: number;
  color: string;
}

interface FrostParticle extends Particle {
  type: 'frost';
  radius: number;
  maxRadius: number;
  branches: number;
  rotation: number;
  color: string;
}

interface ShardParticle extends Particle {
  type: 'shard';
  size: number;
  currentX: number;
  currentY: number;
  angle: number;
  distance: number;
  rotation: number;
  color: string;
}

interface MistParticle extends Particle {
  type: 'mist';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

type FreezeParticle = CrystalParticle | FrostParticle | ShardParticle | MistParticle;

function drawSnowflake(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, spikes: number): void {
  ctx.beginPath();
  for (let i = 0; i < spikes; i++) {
    const angle = (i / spikes) * Math.PI * 2;
    // メインの枝
    ctx.moveTo(x, y);
    const endX = x + Math.cos(angle) * size;
    const endY = y + Math.sin(angle) * size;
    ctx.lineTo(endX, endY);

    // 小さな枝
    const branchLen = size * 0.4;
    const midX = x + Math.cos(angle) * size * 0.6;
    const midY = y + Math.sin(angle) * size * 0.6;
    for (let j = -1; j <= 1; j += 2) {
      const branchAngle = angle + (Math.PI / 4) * j;
      ctx.moveTo(midX, midY);
      ctx.lineTo(
        midX + Math.cos(branchAngle) * branchLen,
        midY + Math.sin(branchAngle) * branchLen
      );
    }
  }
}

export const freezeEffect: Effect = {
  config: {
    name: 'freeze',
    description: '凍結 + 氷結晶 + 霜',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: FreezeParticle[] = [];

    // 中心の霜パターン
    particles.push({
      id: generateId(),
      type: 'frost',
      x,
      y,
      progress: 0,
      maxProgress: 60,
      alpha: 0,
      radius: 10,
      maxRadius: 70,
      branches: 6,
      rotation: 0,
      color: colors[0],
    });

    // 氷の結晶
    const crystalCount = Math.floor(12 * intensity);
    for (let i = 0; i < crystalCount; i++) {
      const angle = (i / crystalCount) * Math.PI * 2 + random(-0.2, 0.2);
      particles.push({
        id: generateId(),
        type: 'crystal',
        x,
        y,
        progress: 0,
        maxProgress: 50 + random(0, 20),
        delay: random(0, 15),
        alpha: 0,
        size: random(8, 16),
        rotation: random(0, Math.PI * 2),
        currentX: x,
        currentY: y,
        angle,
        distance: random(50, 100),
        spikes: Math.floor(random(5, 7)),
        color: randomPick(colors),
      });
    }

    // 氷の破片
    const shardCount = Math.floor(20 * intensity);
    for (let i = 0; i < shardCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'shard',
        x,
        y,
        progress: 0,
        maxProgress: 40 + random(0, 20),
        delay: random(5, 20),
        alpha: 0,
        size: random(3, 8),
        currentX: x,
        currentY: y,
        angle,
        distance: random(60, 120),
        rotation: random(0, Math.PI * 2),
        color: randomPick(colors),
      });
    }

    // 冷気のミスト
    const mistCount = Math.floor(15 * intensity);
    for (let i = 0; i < mistCount; i++) {
      particles.push({
        id: generateId(),
        type: 'mist',
        x: x + random(-40, 40),
        y: y + random(-40, 40),
        progress: 0,
        maxProgress: 60 + random(0, 30),
        delay: random(0, 20),
        alpha: 0,
        size: random(20, 40),
        currentX: x + random(-40, 40),
        currentY: y + random(-40, 40),
        vx: random(-0.5, 0.5),
        vy: random(-0.3, 0.3),
        color: colors[2],
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FreezeParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'frost':
        const frostEased = easeOutCubic(t);
        p.radius = 10 + (p.maxRadius - 10) * frostEased;
        p.rotation += 0.01;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 0.8;
        break;

      case 'crystal':
        const crystalEased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * crystalEased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * crystalEased;
        p.rotation += 0.02;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
        break;

      case 'shard':
        const shardEased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * shardEased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * shardEased + t * t * 30;
        p.rotation += 0.1;
        p.alpha = 1 - easeOutCubic(t);
        break;

      case 'mist':
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.size += 0.3;
        p.alpha = t < 0.2 ? t / 0.2 * 0.3 : 0.3 * (1 - (t - 0.2) / 0.8);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FreezeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'frost':
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        drawSnowflake(ctx, 0, 0, p.radius, p.branches);
        ctx.stroke();
        break;

      case 'crystal':
        ctx.translate(p.currentX, p.currentY);
        ctx.rotate(p.rotation);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        drawSnowflake(ctx, 0, 0, p.size, p.spikes);
        ctx.stroke();
        break;

      case 'shard':
        ctx.translate(p.currentX, p.currentY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;

        // 三角形の破片
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.5, p.size * 0.5);
        ctx.lineTo(-p.size * 0.5, p.size * 0.5);
        ctx.closePath();
        ctx.fill();
        break;

      case 'mist':
        const mistGradient = ctx.createRadialGradient(
          p.currentX, p.currentY, 0,
          p.currentX, p.currentY, p.size
        );
        mistGradient.addColorStop(0, p.color + '40');
        mistGradient.addColorStop(0.5, p.color + '20');
        mistGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = mistGradient;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
