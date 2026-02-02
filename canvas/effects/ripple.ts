/**
 * Ripple エフェクト
 * 波紋 + 同心円 + 減衰
 * 用途: 水面、タップ、衝撃
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#00aaff', '#0088cc', '#0066aa', '#ffffff'];

interface RingParticle extends Particle {
  type: 'ring';
  radius: number;
  maxRadius: number;
  thickness: number;
  color: string;
}

interface DropletParticle extends Particle {
  type: 'droplet';
  size: number;
  currentX: number;
  currentY: number;
  angle: number;
  distance: number;
  arcHeight: number;
  color: string;
}

interface SplashParticle extends Particle {
  type: 'splash';
  size: number;
  currentY: number;
  startY: number;
  vy: number;
  color: string;
}

interface GlintParticle extends Particle {
  type: 'glint';
  size: number;
  currentX: number;
  currentY: number;
  angle: number;
  distance: number;
}

type RippleParticle = RingParticle | DropletParticle | SplashParticle | GlintParticle;

export const rippleEffect: Effect = {
  config: {
    name: 'ripple',
    description: '波紋 + 同心円 + 減衰',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: RippleParticle[] = [];

    // 同心円の波紋
    for (let i = 0; i < 5; i++) {
      particles.push({
        id: generateId(),
        type: 'ring',
        x,
        y,
        progress: 0,
        maxProgress: 50 + i * 8,
        delay: i * 6,
        alpha: 0,
        radius: 5,
        maxRadius: 80 + i * 25,
        thickness: 3 - i * 0.4,
        color: colors[i % 3],
      });
    }

    // 飛沫
    const dropletCount = Math.floor(10 * intensity);
    for (let i = 0; i < dropletCount; i++) {
      const angle = (i / dropletCount) * Math.PI * 2 + random(-0.2, 0.2);
      particles.push({
        id: generateId(),
        type: 'droplet',
        x,
        y,
        progress: 0,
        maxProgress: 35 + random(0, 15),
        delay: random(0, 5),
        alpha: 0,
        size: random(2, 5),
        currentX: x,
        currentY: y,
        angle,
        distance: random(30, 60),
        arcHeight: random(20, 40),
        color: randomPick(colors),
      });
    }

    // 中心のスプラッシュ
    const splashCount = Math.floor(6 * intensity);
    for (let i = 0; i < splashCount; i++) {
      particles.push({
        id: generateId(),
        type: 'splash',
        x: x + random(-15, 15),
        y,
        progress: 0,
        maxProgress: 30 + random(0, 15),
        alpha: 0,
        size: random(2, 4),
        currentY: y,
        startY: y,
        vy: random(-4, -2),
        color: colors[3],
      });
    }

    // 光の反射
    const glintCount = Math.floor(8 * intensity);
    for (let i = 0; i < glintCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'glint',
        x,
        y,
        progress: 0,
        maxProgress: 25 + random(0, 15),
        delay: random(5, 20),
        alpha: 0,
        size: random(1, 3),
        currentX: x,
        currentY: y,
        angle,
        distance: random(20, 50),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RippleParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'ring':
        const ringEased = easeOutCubic(t);
        p.radius = 5 + (p.maxRadius - 5) * ringEased;
        p.alpha = t < 0.1 ? t / 0.1 : 1 - ringEased;
        p.thickness = Math.max(0.5, p.thickness * (1 - t * 0.3));
        break;

      case 'droplet':
        const dropletT = easeOutCubic(t);
        const arcT = Math.sin(t * Math.PI);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * dropletT;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * dropletT * 0.3 - p.arcHeight * arcT;
        p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
        break;

      case 'splash':
        p.vy += 0.2;
        p.currentY += p.vy;
        p.alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        p.size *= 0.98;
        break;

      case 'glint':
        const glintEased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * glintEased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * glintEased * 0.3;
        p.alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RippleParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'ring':
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.thickness;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;

        // 楕円形の波紋（上から見た水面）
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.radius, p.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'droplet':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;

        // 雫型
        ctx.beginPath();
        ctx.moveTo(p.currentX, p.currentY - p.size);
        ctx.quadraticCurveTo(
          p.currentX + p.size, p.currentY,
          p.currentX, p.currentY + p.size * 0.5
        );
        ctx.quadraticCurveTo(
          p.currentX - p.size, p.currentY,
          p.currentX, p.currentY - p.size
        );
        ctx.fill();
        break;

      case 'splash':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'glint':
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;

        // 星型の光
        const spikes = 4;
        const outerRadius = p.size;
        const innerRadius = p.size * 0.3;
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
    }

    ctx.restore();
  },
};
