/**
 * Portal エフェクト
 * 渦巻き + 吸い込み + 次元の裂け目
 * 用途: テレポート、ワープ、異次元
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic, easeInQuad } from '../utils';

const DEFAULT_COLORS = ['#00ffff', '#0088ff', '#0044aa', '#ffffff'];

interface RingParticle extends Particle {
  type: 'ring';
  radius: number;
  targetRadius: number;
  rotation: number;
  rotationSpeed: number;
  thickness: number;
  color: string;
}

interface VortexParticle extends Particle {
  type: 'vortex';
  angle: number;
  radius: number;
  radiusSpeed: number;
  rotationSpeed: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface CoreParticle extends Particle {
  type: 'core';
  radius: number;
  pulsePhase: number;
}

interface SparkParticle extends Particle {
  type: 'spark';
  angle: number;
  distance: number;
  size: number;
  color: string;
  currentX: number;
  currentY: number;
}

type PortalParticle = RingParticle | VortexParticle | CoreParticle | SparkParticle;

export const portalEffect: Effect = {
  config: {
    name: 'portal',
    description: '渦巻き + 吸い込み + 次元の裂け目',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: PortalParticle[] = [];

    // 外周リング
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(),
        type: 'ring',
        x,
        y,
        progress: 0,
        maxProgress: 80,
        delay: i * 5,
        alpha: 0,
        radius: 20,
        targetRadius: 60 + i * 20,
        rotation: random(0, Math.PI * 2),
        rotationSpeed: (i % 2 === 0 ? 1 : -1) * random(0.03, 0.06),
        thickness: 3 - i * 0.5,
        color: colors[i % colors.length],
      });
    }

    // 中心コア
    particles.push({
      id: generateId(),
      type: 'core',
      x,
      y,
      progress: 0,
      maxProgress: 80,
      alpha: 0,
      radius: 15,
      pulsePhase: 0,
    });

    // 渦巻きパーティクル
    const vortexCount = Math.floor(30 * intensity);
    for (let i = 0; i < vortexCount; i++) {
      const startAngle = (i / vortexCount) * Math.PI * 2;
      particles.push({
        id: generateId(),
        type: 'vortex',
        x,
        y,
        progress: 0,
        maxProgress: 70 + random(0, 20),
        delay: random(0, 15),
        alpha: 1,
        angle: startAngle,
        radius: random(80, 120),
        radiusSpeed: -random(1.5, 2.5),
        rotationSpeed: random(0.1, 0.2),
        size: random(2, 4),
        color: randomPick(colors),
        currentX: x + Math.cos(startAngle) * 100,
        currentY: y + Math.sin(startAngle) * 100,
      });
    }

    // スパーク
    const sparkCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      particles.push({
        id: generateId(),
        type: 'spark',
        x,
        y,
        progress: 0,
        maxProgress: 30 + random(0, 20),
        delay: random(10, 40),
        alpha: 0,
        angle,
        distance: random(40, 80),
        size: random(1, 3),
        color: '#ffffff',
        currentX: x,
        currentY: y,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PortalParticle;
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
        p.rotation += p.rotationSpeed;
        p.radius = p.radius + (p.targetRadius - p.radius) * 0.1;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
        break;

      case 'core':
        p.pulsePhase += 0.15;
        p.radius = 15 + Math.sin(p.pulsePhase) * 5;
        p.alpha = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
        break;

      case 'vortex':
        p.angle += p.rotationSpeed;
        p.radius += p.radiusSpeed;
        if (p.radius < 5) p.radius = 5;
        p.currentX = p.x + Math.cos(p.angle) * p.radius;
        p.currentY = p.y + Math.sin(p.angle) * p.radius;
        p.alpha = p.radius > 20 ? 1 - easeInQuad(t) : (p.radius / 20) * (1 - easeInQuad(t));
        p.size *= 0.995;
        break;

      case 'spark':
        const eased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * eased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * eased;
        p.alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PortalParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'ring':
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.thickness;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;

        // 楕円形のリング
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius, p.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'core':
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, '#000033');
        gradient.addColorStop(0.5, '#0044aa');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // 中心の光点
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'vortex':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'spark':
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
