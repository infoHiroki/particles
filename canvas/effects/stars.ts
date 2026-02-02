/**
 * Stars エフェクト
 * 星 + 流れ星 + キラキラ
 * 用途: 夜空、ファンタジー
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';
import { drawStar } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#ffffff', '#ffffd4', '#ffd700', '#87ceeb'];

interface StarParticle extends Particle {
  type: 'star';
  size: number;
  targetX: number;
  targetY: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingParticle extends Particle {
  type: 'shooting';
  angle: number;
  length: number;
  speed: number;
  currentX: number;
  currentY: number;
  color: string;
}

interface SparkleParticle extends Particle {
  type: 'sparkle';
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

type StarsParticle = StarParticle | ShootingParticle | SparkleParticle;

export const starsEffect: Effect = {
  config: {
    name: 'stars',
    description: '星 + 流れ星 + キラキラ',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: StarsParticle[] = [];

    // 星
    const starCount = Math.floor(20 * intensity);
    for (let i = 0; i < starCount; i++) {
      const angle = random(0, Math.PI * 2);
      const distance = random(20, 100);
      particles.push({
        id: generateId(),
        type: 'star',
        x,
        y,
        progress: 0,
        maxProgress: 60 + random(0, 30),
        delay: random(0, 20),
        alpha: 0,
        size: random(3, 8),
        targetX: x + Math.cos(angle) * distance,
        targetY: y + Math.sin(angle) * distance,
        color: randomPick(colors),
        twinkleSpeed: random(0.1, 0.2),
        twinklePhase: random(0, Math.PI * 2),
      });
    }

    // 流れ星
    const shootingCount = Math.floor(3 * intensity);
    for (let i = 0; i < shootingCount; i++) {
      const angle = random(Math.PI * 0.6, Math.PI * 0.9);
      particles.push({
        id: generateId(),
        type: 'shooting',
        x,
        y,
        progress: 0,
        maxProgress: 30,
        delay: random(0, 30),
        alpha: 1,
        angle,
        length: random(30, 60),
        speed: random(8, 15),
        currentX: x,
        currentY: y,
        color: '#ffffff',
      });
    }

    // キラキラ
    const sparkleCount = Math.floor(10 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = random(0, Math.PI * 2);
      const distance = random(30, 80);
      particles.push({
        id: generateId(),
        type: 'sparkle',
        x,
        y,
        progress: 0,
        maxProgress: 40 + random(0, 20),
        delay: random(0, 25),
        alpha: 0,
        targetX: x + Math.cos(angle) * distance,
        targetY: y + Math.sin(angle) * distance,
        size: random(2, 5),
        color: randomPick(colors),
        rotation: 0,
        rotationSpeed: random(0.05, 0.15),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as StarsParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'star':
        p.alpha = Math.sin(effectiveProgress * p.twinkleSpeed + p.twinklePhase) * 0.5 + 0.5;
        if (t > 0.7) {
          p.alpha *= 1 - (t - 0.7) / 0.3;
        }
        break;

      case 'shooting':
        p.currentX += Math.cos(p.angle) * p.speed;
        p.currentY += Math.sin(p.angle) * p.speed;
        p.alpha = 1 - t;
        break;

      case 'sparkle':
        p.rotation += p.rotationSpeed;
        p.alpha = t < 0.3 ? t / 0.3 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as StarsParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'star':
        drawStar(ctx, p.targetX, p.targetY, p.size, 5, p.color, true, 0.4, p.alpha);
        break;

      case 'shooting':
        const tailX = p.currentX - Math.cos(p.angle) * p.length;
        const tailY = p.currentY - Math.sin(p.angle) * p.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, p.currentX, p.currentY);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, p.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(p.currentX, p.currentY);
        ctx.stroke();

        // 先端の光点
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'sparkle':
        ctx.translate(p.targetX, p.targetY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        // 4点の輝き
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const r = i % 2 === 0 ? p.size : p.size * 0.3;
          const px = r * Math.cos(angle);
          const py = r * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
