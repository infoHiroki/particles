/**
 * Galaxy エフェクト
 * 銀河 + 渦巻き + 星々
 * 用途: 宇宙、壮大、神秘
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#aaccff', '#ffaacc', '#aaffcc', '#ffccaa'];

interface StarParticle extends Particle {
  type: 'star';
  size: number;
  angle: number;
  armOffset: number;
  radius: number;
  rotationSpeed: number;
  twinklePhase: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface CoreParticle extends Particle {
  type: 'core';
  radius: number;
  color: string;
}

type GalaxyParticle = StarParticle | CoreParticle;

export const galaxyEffect: Effect = {
  config: {
    name: 'galaxy',
    description: '銀河 + 渦巻き + 星々',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: GalaxyParticle[] = [];

    particles.push({
      id: generateId(),
      type: 'core',
      x, y,
      progress: 0,
      maxProgress: 120,
      alpha: 0,
      radius: 15,
      color: '#ffffcc',
    });

    const arms = 2;
    const starsPerArm = Math.floor(40 * intensity);
    for (let arm = 0; arm < arms; arm++) {
      const armAngle = (arm / arms) * Math.PI * 2;
      for (let i = 0; i < starsPerArm; i++) {
        const distFromCenter = random(20, 100);
        const spiralAngle = armAngle + (distFromCenter / 100) * Math.PI * 1.5;
        const spread = random(-15, 15);
        particles.push({
          id: generateId(),
          type: 'star',
          x, y,
          progress: 0,
          maxProgress: 100 + random(0, 40),
          delay: random(0, 20),
          alpha: 0,
          size: random(1, 3),
          angle: spiralAngle,
          armOffset: spread,
          radius: distFromCenter,
          rotationSpeed: 0.01 + (1 - distFromCenter / 100) * 0.02,
          twinklePhase: random(0, Math.PI * 2),
          color: randomPick(colors),
          currentX: x,
          currentY: y,
        });
      }
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GalaxyParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) return p;

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    if (p.type === 'core') {
      p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    } else {
      p.angle += p.rotationSpeed;
      p.twinklePhase += 0.1;
      const twinkle = (Math.sin(p.twinklePhase) + 1) / 2 * 0.5 + 0.5;
      p.currentX = p.x + Math.cos(p.angle) * p.radius + Math.cos(p.angle + Math.PI / 2) * p.armOffset;
      p.currentY = p.y + Math.sin(p.angle) * p.radius + Math.sin(p.angle + Math.PI / 2) * p.armOffset;
      p.alpha = twinkle * (t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1);
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GalaxyParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'core') {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(0.5, p.color + '80');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
};
