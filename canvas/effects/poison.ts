/**
 * Poison エフェクト
 * 毒 + 泡 + 瘴気
 * 用途: 毒ダメージ、汚染、デバフ
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#8800ff', '#aa00ff', '#cc44ff', '#44ff44'];

interface BubbleParticle extends Particle {
  type: 'bubble';
  size: number;
  targetSize: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  wobblePhase: number;
  color: string;
}

interface MiasmaParticle extends Particle {
  type: 'miasma';
  size: number;
  currentX: number;
  currentY: number;
  angle: number;
  distance: number;
  rotationSpeed: number;
  color: string;
}

interface SkullParticle extends Particle {
  type: 'skull';
  size: number;
  floatPhase: number;
  color: string;
}

interface DripParticle extends Particle {
  type: 'drip';
  size: number;
  currentX: number;
  currentY: number;
  vy: number;
  color: string;
}

type PoisonParticle = BubbleParticle | MiasmaParticle | SkullParticle | DripParticle;

export const poisonEffect: Effect = {
  config: {
    name: 'poison',
    description: '毒 + 泡 + 瘴気',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: PoisonParticle[] = [];

    // 毒の泡
    const bubbleCount = Math.floor(18 * intensity);
    for (let i = 0; i < bubbleCount; i++) {
      particles.push({
        id: generateId(),
        type: 'bubble',
        x: x + random(-50, 50),
        y: y + random(-20, 40),
        progress: 0,
        maxProgress: 60 + random(0, 40),
        delay: random(0, 25),
        alpha: 0,
        size: 0,
        targetSize: random(5, 15),
        currentX: x + random(-50, 50),
        currentY: y + random(-20, 40),
        vx: random(-0.5, 0.5),
        vy: random(-1.5, -0.5),
        wobblePhase: random(0, Math.PI * 2),
        color: randomPick(colors.slice(0, 3)),
      });
    }

    // 瘴気
    const miasmaCount = Math.floor(12 * intensity);
    for (let i = 0; i < miasmaCount; i++) {
      const angle = (i / miasmaCount) * Math.PI * 2;
      particles.push({
        id: generateId(),
        type: 'miasma',
        x,
        y,
        progress: 0,
        maxProgress: 70 + random(0, 30),
        delay: random(0, 15),
        alpha: 0,
        size: random(25, 45),
        currentX: x + Math.cos(angle) * 20,
        currentY: y + Math.sin(angle) * 20,
        angle,
        distance: random(40, 80),
        rotationSpeed: random(0.02, 0.04) * (i % 2 === 0 ? 1 : -1),
        color: randomPick(colors.slice(0, 3)),
      });
    }

    // ドクロマーク（中心）
    particles.push({
      id: generateId(),
      type: 'skull',
      x,
      y,
      progress: 0,
      maxProgress: 50,
      alpha: 0,
      size: 20,
      floatPhase: 0,
      color: colors[0],
    });

    // 滴り落ちる毒
    const dripCount = Math.floor(8 * intensity);
    for (let i = 0; i < dripCount; i++) {
      particles.push({
        id: generateId(),
        type: 'drip',
        x: x + random(-40, 40),
        y: y - 20,
        progress: 0,
        maxProgress: 40 + random(0, 20),
        delay: random(10, 35),
        alpha: 0,
        size: random(3, 6),
        currentX: x + random(-40, 40),
        currentY: y - 20,
        vy: random(2, 4),
        color: colors[3],
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PoisonParticle;
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
        p.wobblePhase += 0.1;
        p.currentX += p.vx + Math.sin(p.wobblePhase) * 0.5;
        p.currentY += p.vy;
        p.size = p.targetSize * (t < 0.2 ? t / 0.2 : 1);
        p.alpha = t < 0.2 ? t / 0.2 * 0.8 : t > 0.8 ? (1 - t) / 0.2 * 0.8 : 0.8;
        break;

      case 'miasma':
        p.angle += p.rotationSpeed;
        const miasmaEased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * miasmaEased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * miasmaEased;
        p.size += 0.3;
        p.alpha = t < 0.2 ? t / 0.2 * 0.4 : 0.4 * (1 - (t - 0.2) / 0.8);
        break;

      case 'skull':
        p.floatPhase += 0.1;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
        break;

      case 'drip':
        p.currentY += p.vy;
        p.vy += 0.1;
        p.alpha = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9;
        p.size *= 0.98;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PoisonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'bubble':
        // 泡
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.stroke();

        // ハイライト
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.currentX - p.size * 0.3, p.currentY - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'miasma':
        const gradient = ctx.createRadialGradient(
          p.currentX, p.currentY, 0,
          p.currentX, p.currentY, p.size
        );
        gradient.addColorStop(0, p.color + '60');
        gradient.addColorStop(0.5, p.color + '30');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'skull':
        const floatY = p.y + Math.sin(p.floatPhase) * 5;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;

        // 簡略化されたドクロ
        // 頭
        ctx.beginPath();
        ctx.arc(p.x, floatY - 5, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 目（くぼみ）
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(p.x - p.size * 0.2, floatY - 8, p.size * 0.15, 0, Math.PI * 2);
        ctx.arc(p.x + p.size * 0.2, floatY - 8, p.size * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // 鼻
        ctx.beginPath();
        ctx.moveTo(p.x, floatY - 2);
        ctx.lineTo(p.x - p.size * 0.08, floatY + 2);
        ctx.lineTo(p.x + p.size * 0.08, floatY + 2);
        ctx.closePath();
        ctx.fill();

        // 顎
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, floatY + 8, p.size * 0.4, 0, Math.PI);
        ctx.fill();
        break;

      case 'drip':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;

        // 雫型
        ctx.beginPath();
        ctx.moveTo(p.currentX, p.currentY - p.size);
        ctx.quadraticCurveTo(
          p.currentX + p.size, p.currentY,
          p.currentX, p.currentY + p.size
        );
        ctx.quadraticCurveTo(
          p.currentX - p.size, p.currentY,
          p.currentX, p.currentY - p.size
        );
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
