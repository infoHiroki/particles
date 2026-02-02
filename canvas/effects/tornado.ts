/**
 * Tornado エフェクト
 * 竜巻 + 回転 + 吸い上げ
 * 用途: 風、嵐、破壊
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

const DEFAULT_COLORS = ['#888888', '#666666', '#999999', '#aaaaaa'];

interface DebrisParticle extends Particle {
  type: 'debris';
  size: number;
  angle: number;
  radius: number;
  height: number;
  rotationSpeed: number;
  riseSpeed: number;
  color: string;
  currentX: number;
  currentY: number;
}

interface FunnelParticle extends Particle {
  type: 'funnel';
  baseRadius: number;
  topRadius: number;
  height: number;
  rotation: number;
  color: string;
}

type TornadoParticle = DebrisParticle | FunnelParticle;

export const tornadoEffect: Effect = {
  config: {
    name: 'tornado',
    description: '竜巻 + 回転 + 吸い上げ',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: TornadoParticle[] = [];

    particles.push({
      id: generateId(),
      type: 'funnel',
      x, y,
      progress: 0,
      maxProgress: 100,
      alpha: 0,
      baseRadius: 60,
      topRadius: 20,
      height: 150,
      rotation: 0,
      color: colors[0],
    });

    const debrisCount = Math.floor(50 * intensity);
    for (let i = 0; i < debrisCount; i++) {
      const startAngle = random(0, Math.PI * 2);
      const startHeight = random(0, 150);
      const radiusAtHeight = 60 - (startHeight / 150) * 40;
      particles.push({
        id: generateId(),
        type: 'debris',
        x, y,
        progress: 0,
        maxProgress: 80 + random(0, 40),
        delay: random(0, 30),
        alpha: 0,
        size: random(2, 6),
        angle: startAngle,
        radius: radiusAtHeight + random(-10, 10),
        height: startHeight,
        rotationSpeed: random(0.1, 0.2),
        riseSpeed: random(1, 3),
        color: randomPick(colors),
        currentX: x,
        currentY: y,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TornadoParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) return p;

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    if (p.type === 'funnel') {
      p.rotation += 0.05;
      p.alpha = t < 0.15 ? t / 0.15 * 0.4 : t > 0.8 ? (1 - t) / 0.2 * 0.4 : 0.4;
    } else {
      p.angle += p.rotationSpeed;
      p.height += p.riseSpeed;
      if (p.height > 150) p.height = 0;
      const radiusAtHeight = 60 - (p.height / 150) * 40;
      p.radius = radiusAtHeight + Math.sin(p.progress * 0.1) * 5;
      p.currentX = p.x + Math.cos(p.angle) * p.radius;
      p.currentY = p.y - p.height;
      p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 0.8;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TornadoParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'funnel') {
      for (let i = 0; i < 10; i++) {
        const h = (i / 10) * p.height;
        const r = p.baseRadius - (h / p.height) * (p.baseRadius - p.topRadius);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y - h, r, r * 0.3, p.rotation + i * 0.2, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
};
