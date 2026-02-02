/**
 * Critical エフェクト
 * 強烈な閃光 + 衝撃波
 * 用途: クリティカルヒット、必殺技
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic, easeOutQuad } from '../utils';
import { drawCircle, drawRing, drawGradientCircle } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#ffffff', '#ffeb3b', '#ff5722'];

interface FlashParticle extends Particle {
  type: 'flash';
  radius: number;
}

interface ShockwaveParticle extends Particle {
  type: 'shockwave';
  radius: number;
}

interface SlashParticle extends Particle {
  type: 'slash';
  angle: number;
  length: number;
  drawProgress: number;
}

interface DebrisParticle extends Particle {
  type: 'debris';
  angle: number;
  distance: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

type CriticalParticle = FlashParticle | ShockwaveParticle | SlashParticle | DebrisParticle;

export const criticalEffect: Effect = {
  config: {
    name: 'critical',
    description: '強烈な閃光 + 衝撃波',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: CriticalParticle[] = [];

    // 閃光
    particles.push({
      id: generateId(),
      type: 'flash',
      x,
      y,
      progress: 0,
      maxProgress: 20,
      alpha: 1,
      radius: 0,
    });

    // 衝撃波
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(),
        type: 'shockwave',
        x,
        y,
        progress: 0,
        maxProgress: 30,
        delay: i * 5,
        alpha: 1,
        radius: 10,
      });
    }

    // スラッシュライン
    const slashCount = Math.floor(3 * intensity);
    for (let i = 0; i < slashCount; i++) {
      const angle = random(-Math.PI / 4, Math.PI / 4) - Math.PI / 2;
      particles.push({
        id: generateId(),
        type: 'slash',
        x,
        y,
        progress: 0,
        maxProgress: 15,
        delay: i * 2,
        alpha: 1,
        angle,
        length: random(60, 100),
        drawProgress: 0,
      });
    }

    // 破片
    const debrisCount = Math.floor(20 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'debris',
        x,
        y,
        progress: 0,
        maxProgress: 40,
        delay: 5,
        alpha: 1,
        angle,
        distance: random(40, 100),
        size: random(2, 5),
        color: randomPick(colors),
        currentX: x,
        currentY: y,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CriticalParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'flash':
        p.radius = easeOutCubic(t) * 100;
        p.alpha = 1 - t;
        break;

      case 'shockwave':
        p.radius = 10 + easeOutCubic(t) * 80;
        p.alpha = 1 - easeOutCubic(t);
        break;

      case 'slash':
        p.drawProgress = easeOutQuad(t);
        p.alpha = 1 - t;
        break;

      case 'debris':
        const eased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * eased;
        p.alpha = 1 - easeOutCubic(t);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CriticalParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'flash':
        const flashGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        flashGradient.addColorStop(0, '#ffffff');
        flashGradient.addColorStop(0.5, '#ffeb3b');
        flashGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = flashGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'shockwave':
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'slash':
        const startX = p.x - Math.cos(p.angle) * p.length / 2;
        const startY = p.y - Math.sin(p.angle) * p.length / 2;
        const endX = startX + Math.cos(p.angle) * p.length * p.drawProgress;
        const endY = startY + Math.sin(p.angle) * p.length * p.drawProgress;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;

      case 'debris':
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        drawCircle(ctx, p.currentX, p.currentY, p.size, p.color, p.alpha);
        break;
    }

    ctx.restore();
  },
};
