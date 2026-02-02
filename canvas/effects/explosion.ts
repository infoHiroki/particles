/**
 * Explosion エフェクト
 * 爆発 + 衝撃波 + 破片
 * 用途: 破壊、衝撃、ゲーム
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic, easeOutQuad } from '../utils';

const DEFAULT_COLORS = ['#ff4400', '#ff6600', '#ff8800', '#ffaa00', '#ffcc00'];

interface FlashParticle extends Particle {
  type: 'flash';
  radius: number;
  maxRadius: number;
}

interface ShockwaveParticle extends Particle {
  type: 'shockwave';
  radius: number;
  maxRadius: number;
  thickness: number;
}

interface DebrisParticle extends Particle {
  type: 'debris';
  size: number;
  angle: number;
  distance: number;
  speed: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface SparkParticle extends Particle {
  type: 'spark';
  size: number;
  angle: number;
  distance: number;
  color: string;
  currentX: number;
  currentY: number;
  trail: { x: number; y: number }[];
}

interface SmokeParticle extends Particle {
  type: 'smoke';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
}

type ExplosionParticle = FlashParticle | ShockwaveParticle | DebrisParticle | SparkParticle | SmokeParticle;

export const explosionEffect: Effect = {
  config: {
    name: 'explosion',
    description: '爆発 + 衝撃波 + 破片',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: ExplosionParticle[] = [];

    // 中心フラッシュ
    particles.push({
      id: generateId(),
      type: 'flash',
      x,
      y,
      progress: 0,
      maxProgress: 15,
      alpha: 1,
      radius: 10,
      maxRadius: 60,
    });

    // 衝撃波
    particles.push({
      id: generateId(),
      type: 'shockwave',
      x,
      y,
      progress: 0,
      maxProgress: 30,
      alpha: 1,
      radius: 10,
      maxRadius: 100,
      thickness: 4,
    });

    // 破片
    const debrisCount = Math.floor(25 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'debris',
        x,
        y,
        progress: 0,
        maxProgress: 50 + random(0, 30),
        alpha: 1,
        size: random(3, 8),
        angle,
        distance: random(60, 140),
        speed: random(4, 8),
        gravity: 0.15,
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.3, 0.3),
        color: randomPick(colors),
        currentX: x,
        currentY: y,
      });
    }

    // 火花
    const sparkCount = Math.floor(30 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'spark',
        x,
        y,
        progress: 0,
        maxProgress: 35 + random(0, 20),
        alpha: 1,
        size: random(1, 3),
        angle,
        distance: random(80, 150),
        color: randomPick(colors),
        currentX: x,
        currentY: y,
        trail: [],
      });
    }

    // 煙
    const smokeCount = Math.floor(10 * intensity);
    for (let i = 0; i < smokeCount; i++) {
      particles.push({
        id: generateId(),
        type: 'smoke',
        x,
        y,
        progress: 0,
        maxProgress: 60 + random(0, 30),
        delay: 10 + random(0, 10),
        alpha: 0,
        size: random(20, 40),
        currentX: x + random(-20, 20),
        currentY: y + random(-20, 20),
        vx: random(-0.5, 0.5),
        vy: random(-1.5, -0.5),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ExplosionParticle;
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
        const flashEased = easeOutCubic(t);
        p.radius = p.maxRadius * flashEased;
        p.alpha = 1 - flashEased;
        break;

      case 'shockwave':
        const shockEased = easeOutQuad(t);
        p.radius = 10 + (p.maxRadius - 10) * shockEased;
        p.alpha = 1 - shockEased;
        p.thickness = 4 * (1 - shockEased);
        break;

      case 'debris':
        const debrisEased = easeOutQuad(t);
        const baseX = p.x + Math.cos(p.angle) * p.distance * debrisEased;
        const baseY = p.y + Math.sin(p.angle) * p.distance * debrisEased;
        p.currentX = baseX;
        p.currentY = baseY + (t * t * p.gravity * 500);
        p.rotation += p.rotationSpeed;
        p.alpha = t > 0.6 ? (1 - t) / 0.4 : 1;
        break;

      case 'spark':
        const sparkEased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * sparkEased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * sparkEased;
        p.trail.push({ x: p.currentX, y: p.currentY });
        if (p.trail.length > 5) p.trail.shift();
        p.alpha = 1 - easeOutCubic(t);
        break;

      case 'smoke':
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.size += 0.5;
        p.alpha = t < 0.2 ? t / 0.2 * 0.4 : 0.4 * (1 - (t - 0.2) / 0.8);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ExplosionParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'flash':
        const flashGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        flashGradient.addColorStop(0, '#ffffff');
        flashGradient.addColorStop(0.3, '#ffff00');
        flashGradient.addColorStop(0.7, '#ff6600');
        flashGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = flashGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'shockwave':
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = p.thickness;
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'debris':
        ctx.translate(p.currentX, p.currentY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        break;

      case 'spark':
        // 軌跡
        if (p.trail.length > 1) {
          ctx.globalAlpha = p.alpha * 0.5;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.stroke();
        }

        // 火花本体
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'smoke':
        const smokeGradient = ctx.createRadialGradient(
          p.currentX, p.currentY, 0,
          p.currentX, p.currentY, p.size
        );
        smokeGradient.addColorStop(0, 'rgba(80, 80, 80, 0.5)');
        smokeGradient.addColorStop(0.5, 'rgba(60, 60, 60, 0.3)');
        smokeGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = smokeGradient;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
