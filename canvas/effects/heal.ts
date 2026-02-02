/**
 * Heal エフェクト
 * 回復 + 上昇光 + 十字
 * 用途: HP回復、治癒、浄化
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic, easeOutQuad } from '../utils';

const DEFAULT_COLORS = ['#00ff88', '#44ffaa', '#88ffcc', '#aaffee'];

interface CrossParticle extends Particle {
  type: 'cross';
  size: number;
  rotation: number;
  scale: number;
  color: string;
}

interface RiseParticle extends Particle {
  type: 'rise';
  size: number;
  currentX: number;
  currentY: number;
  startY: number;
  riseDistance: number;
  wobblePhase: number;
  wobbleAmount: number;
  color: string;
}

interface GlowParticle extends Particle {
  type: 'glow';
  radius: number;
  maxRadius: number;
  color: string;
}

interface SparkleParticle extends Particle {
  type: 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  angle: number;
  distance: number;
  color: string;
}

interface AuraParticle extends Particle {
  type: 'aura';
  radius: number;
  pulsePhase: number;
  color: string;
}

type HealParticle = CrossParticle | RiseParticle | GlowParticle | SparkleParticle | AuraParticle;

export const healEffect: Effect = {
  config: {
    name: 'heal',
    description: '回復 + 上昇光 + 十字',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: HealParticle[] = [];

    // 中心の十字
    particles.push({
      id: generateId(),
      type: 'cross',
      x,
      y,
      progress: 0,
      maxProgress: 50,
      alpha: 0,
      size: 25,
      rotation: 0,
      scale: 0,
      color: colors[0],
    });

    // オーラ
    particles.push({
      id: generateId(),
      type: 'aura',
      x,
      y,
      progress: 0,
      maxProgress: 70,
      alpha: 0,
      radius: 50,
      pulsePhase: 0,
      color: colors[1],
    });

    // 中心グロー
    particles.push({
      id: generateId(),
      type: 'glow',
      x,
      y,
      progress: 0,
      maxProgress: 40,
      alpha: 0,
      radius: 10,
      maxRadius: 60,
      color: colors[0],
    });

    // 上昇パーティクル
    const riseCount = Math.floor(20 * intensity);
    for (let i = 0; i < riseCount; i++) {
      const startX = x + random(-40, 40);
      particles.push({
        id: generateId(),
        type: 'rise',
        x: startX,
        y: y + random(20, 50),
        progress: 0,
        maxProgress: 60 + random(0, 30),
        delay: random(0, 20),
        alpha: 0,
        size: random(3, 6),
        currentX: startX,
        currentY: y + random(20, 50),
        startY: y + random(20, 50),
        riseDistance: random(80, 140),
        wobblePhase: random(0, Math.PI * 2),
        wobbleAmount: random(10, 25),
        color: randomPick(colors),
      });
    }

    // キラキラ
    const sparkleCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2;
      particles.push({
        id: generateId(),
        type: 'sparkle',
        x,
        y,
        progress: 0,
        maxProgress: 35 + random(0, 15),
        delay: 10 + random(0, 20),
        alpha: 0,
        size: random(2, 4),
        currentX: x,
        currentY: y,
        angle,
        distance: random(40, 70),
        color: randomPick(colors),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as HealParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'cross':
        p.scale = t < 0.3 ? easeOutCubic(t / 0.3) : 1;
        p.rotation = t < 0.3 ? easeOutQuad(t / 0.3) * Math.PI / 4 : Math.PI / 4;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
        break;

      case 'aura':
        p.pulsePhase += 0.1;
        const pulse = (Math.sin(p.pulsePhase) + 1) / 2;
        p.radius = 50 + pulse * 15;
        p.alpha = t < 0.15 ? t / 0.15 * 0.3 : t > 0.8 ? (1 - t) / 0.2 * 0.3 : 0.3;
        break;

      case 'glow':
        const glowEased = easeOutCubic(t);
        p.radius = 10 + (p.maxRadius - 10) * glowEased;
        p.alpha = 1 - glowEased;
        break;

      case 'rise':
        const riseEased = easeOutQuad(t);
        p.wobblePhase += 0.1;
        p.currentY = p.startY - p.riseDistance * riseEased;
        p.currentX = p.x + Math.sin(p.wobblePhase) * p.wobbleAmount;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 0.9;
        p.size *= 0.995;
        break;

      case 'sparkle':
        const sparkleEased = easeOutCubic(t);
        p.currentX = p.x + Math.cos(p.angle) * p.distance * sparkleEased;
        p.currentY = p.y + Math.sin(p.angle) * p.distance * sparkleEased - sparkleEased * 30;
        p.alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as HealParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'cross':
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scale, p.scale);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;

        // 縦棒
        ctx.fillRect(-p.size * 0.15, -p.size, p.size * 0.3, p.size * 2);
        // 横棒
        ctx.fillRect(-p.size, -p.size * 0.15, p.size * 2, p.size * 0.3);
        break;

      case 'aura':
        const auraGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        auraGradient.addColorStop(0, 'transparent');
        auraGradient.addColorStop(0.6, p.color + '20');
        auraGradient.addColorStop(0.8, p.color + '40');
        auraGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'glow':
        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        glowGradient.addColorStop(0, p.color);
        glowGradient.addColorStop(0.4, p.color + '80');
        glowGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'rise':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;

        // 雫型
        ctx.beginPath();
        ctx.moveTo(p.currentX, p.currentY - p.size);
        ctx.bezierCurveTo(
          p.currentX + p.size, p.currentY - p.size * 0.5,
          p.currentX + p.size, p.currentY + p.size * 0.5,
          p.currentX, p.currentY + p.size
        );
        ctx.bezierCurveTo(
          p.currentX - p.size, p.currentY + p.size * 0.5,
          p.currentX - p.size, p.currentY - p.size * 0.5,
          p.currentX, p.currentY - p.size
        );
        ctx.fill();
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
    }

    ctx.restore();
  },
};
