/**
 * Lightning エフェクト
 * 稲妻 + 分岐 + フラッシュ
 * 用途: 雷撃、電撃攻撃、嵐
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ffffff', '#aaddff', '#88ccff', '#ffff88'];

interface BoltParticle extends Particle {
  type: 'bolt';
  segments: { x: number; y: number }[];
  thickness: number;
  color: string;
  flickerPhase: number;
}

interface FlashParticle extends Particle {
  type: 'flash';
  radius: number;
}

interface SparkParticle extends Particle {
  type: 'spark';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  color: string;
}

interface GlowParticle extends Particle {
  type: 'glow';
  radius: number;
  maxRadius: number;
  color: string;
}

type LightningParticle = BoltParticle | FlashParticle | SparkParticle | GlowParticle;

function generateBoltSegments(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  displacement: number,
  detail: number
): { x: number; y: number }[] {
  if (detail <= 1) {
    return [{ x: startX, y: startY }, { x: endX, y: endY }];
  }

  const midX = (startX + endX) / 2 + random(-displacement, displacement);
  const midY = (startY + endY) / 2 + random(-displacement, displacement);

  const left = generateBoltSegments(startX, startY, midX, midY, displacement / 2, detail - 1);
  const right = generateBoltSegments(midX, midY, endX, endY, displacement / 2, detail - 1);

  return [...left.slice(0, -1), ...right];
}

export const lightningEffect: Effect = {
  config: {
    name: 'lightning',
    description: '稲妻 + 分岐 + フラッシュ',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: LightningParticle[] = [];

    // 画面フラッシュ
    particles.push({
      id: generateId(),
      type: 'flash',
      x,
      y,
      progress: 0,
      maxProgress: 8,
      alpha: 0.8,
      radius: 300,
    });

    // メインボルト
    const mainSegments = generateBoltSegments(x, y - 100, x, y + 50, 40, 5);
    particles.push({
      id: generateId(),
      type: 'bolt',
      x,
      y,
      progress: 0,
      maxProgress: 25,
      alpha: 1,
      segments: mainSegments,
      thickness: 4,
      color: colors[0],
      flickerPhase: 0,
    });

    // 分岐ボルト
    const branchCount = Math.floor(3 * intensity);
    for (let i = 0; i < branchCount; i++) {
      const branchStart = mainSegments[Math.floor(mainSegments.length * random(0.3, 0.7))];
      const branchEndX = branchStart.x + random(-80, 80);
      const branchEndY = branchStart.y + random(30, 80);
      const branchSegments = generateBoltSegments(
        branchStart.x,
        branchStart.y,
        branchEndX,
        branchEndY,
        25,
        4
      );
      particles.push({
        id: generateId(),
        type: 'bolt',
        x,
        y,
        progress: 0,
        maxProgress: 20 + random(0, 10),
        delay: random(0, 3),
        alpha: 0.7,
        segments: branchSegments,
        thickness: 2,
        color: colors[1],
        flickerPhase: random(0, Math.PI),
      });
    }

    // インパクトグロー
    particles.push({
      id: generateId(),
      type: 'glow',
      x,
      y: y + 50,
      progress: 0,
      maxProgress: 30,
      alpha: 0,
      radius: 20,
      maxRadius: 80,
      color: colors[2],
    });

    // スパーク
    const sparkCount = Math.floor(20 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(3, 8);
      particles.push({
        id: generateId(),
        type: 'spark',
        x,
        y: y + 50,
        progress: 0,
        maxProgress: 20 + random(0, 15),
        delay: random(0, 5),
        alpha: 0,
        size: random(1, 3),
        currentX: x + random(-20, 20),
        currentY: y + 50 + random(-10, 10),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[3],
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LightningParticle;
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
        p.alpha = (1 - t) * 0.5;
        break;

      case 'bolt':
        p.flickerPhase += 0.8;
        const flicker = Math.sin(p.flickerPhase) > 0.3 ? 1 : 0.3;
        p.alpha = (1 - easeOutCubic(t)) * flicker;
        break;

      case 'glow':
        const glowEased = easeOutCubic(t);
        p.radius = 20 + (p.maxRadius - 20) * glowEased;
        p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
        break;

      case 'spark':
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.vy += 0.3;
        p.vx *= 0.95;
        p.alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LightningParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'flash':
        const flashGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        flashGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        flashGradient.addColorStop(0.3, 'rgba(200, 220, 255, 0.4)');
        flashGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = flashGradient;
        ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        break;

      case 'bolt':
        if (p.segments.length < 2) break;

        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#88ccff';
        ctx.shadowBlur = 20;

        ctx.beginPath();
        ctx.moveTo(p.segments[0].x, p.segments[0].y);
        for (let i = 1; i < p.segments.length; i++) {
          ctx.lineTo(p.segments[i].x, p.segments[i].y);
        }
        ctx.stroke();

        // グローレイヤー
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.lineWidth = p.thickness + 4;
        ctx.shadowBlur = 30;
        ctx.stroke();
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

      case 'spark':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
