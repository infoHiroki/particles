/**
 * Teleport エフェクト
 * 転送 + 分解 + 再構成
 * 用途: ワープ、消失、出現
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic, easeInCubic } from '../utils';

const DEFAULT_COLORS = ['#00ffff', '#0088ff', '#ffffff', '#88ffff'];

interface FragmentParticle extends Particle {
  type: 'fragment';
  size: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  targetY: number;
  wobblePhase: number;
  wobbleAmount: number;
  color: string;
  appearing: boolean;
}

interface BeamParticle extends Particle {
  type: 'beam';
  width: number;
  height: number;
  targetHeight: number;
  color: string;
}

interface RingParticle extends Particle {
  type: 'ring';
  radius: number;
  targetRadius: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
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

type TeleportParticle = FragmentParticle | BeamParticle | RingParticle | SparkParticle;

export const teleportEffect: Effect = {
  config: {
    name: 'teleport',
    description: '転送 + 分解 + 再構成',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const appearing = (options.appearing as boolean) ?? true;
    const particles: TeleportParticle[] = [];

    // 中心のビーム
    particles.push({
      id: generateId(),
      type: 'beam',
      x,
      y,
      progress: 0,
      maxProgress: 50,
      alpha: 0,
      width: 30,
      height: 0,
      targetHeight: 150,
      color: colors[0],
    });

    // 回転リング
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(),
        type: 'ring',
        x,
        y: y + (appearing ? 50 : -50) - i * 30,
        progress: 0,
        maxProgress: 45,
        delay: i * 5,
        alpha: 0,
        radius: 10,
        targetRadius: 40 - i * 8,
        rotation: 0,
        rotationSpeed: (i % 2 === 0 ? 1 : -1) * random(0.1, 0.15),
        color: colors[i % colors.length],
      });
    }

    // 分解/再構成フラグメント
    const fragmentCount = Math.floor(35 * intensity);
    for (let i = 0; i < fragmentCount; i++) {
      const startX = x + random(-30, 30);
      const startY = y + random(-50, 50);
      const targetY = appearing ? startY : startY - random(80, 150);

      particles.push({
        id: generateId(),
        type: 'fragment',
        x: startX,
        y: startY,
        progress: 0,
        maxProgress: 50 + random(0, 20),
        delay: random(0, 15),
        alpha: 0,
        size: random(2, 5),
        startX,
        startY: appearing ? startY - random(80, 150) : startY,
        currentX: startX,
        currentY: appearing ? startY - random(80, 150) : startY,
        targetY: appearing ? startY : targetY,
        wobblePhase: random(0, Math.PI * 2),
        wobbleAmount: random(5, 15),
        color: randomPick(colors),
        appearing,
      });
    }

    // スパーク
    const sparkCount = Math.floor(20 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2, 5);
      particles.push({
        id: generateId(),
        type: 'spark',
        x,
        y,
        progress: 0,
        maxProgress: 25 + random(0, 15),
        delay: random(5, 20),
        alpha: 0,
        size: random(1, 3),
        currentX: x,
        currentY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[2],
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as TeleportParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'beam':
        const beamEased = t < 0.3 ? easeOutCubic(t / 0.3) : 1;
        p.height = p.targetHeight * beamEased;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 0.8;
        break;

      case 'ring':
        p.rotation += p.rotationSpeed;
        const ringEased = easeOutCubic(t);
        p.radius = 10 + (p.targetRadius - 10) * ringEased;
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 0.7;
        break;

      case 'fragment':
        p.wobblePhase += 0.15;
        const fragEased = p.appearing ? easeOutCubic(t) : easeInCubic(t);
        p.currentY = p.startY + (p.targetY - p.startY) * fragEased;
        p.currentX = p.x + Math.sin(p.wobblePhase) * p.wobbleAmount;

        if (p.appearing) {
          p.alpha = t < 0.3 ? t / 0.3 : t > 0.8 ? (1 - t) / 0.2 : 1;
        } else {
          p.alpha = t < 0.2 ? 1 : 1 - (t - 0.2) / 0.8;
        }
        p.size *= 0.998;
        break;

      case 'spark':
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as TeleportParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'beam':
        const beamGradient = ctx.createLinearGradient(p.x, p.y - p.height / 2, p.x, p.y + p.height / 2);
        beamGradient.addColorStop(0, 'transparent');
        beamGradient.addColorStop(0.3, p.color + '80');
        beamGradient.addColorStop(0.5, p.color);
        beamGradient.addColorStop(0.7, p.color + '80');
        beamGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = beamGradient;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.fillRect(p.x - p.width / 2, p.y - p.height / 2, p.width, p.height);
        break;

      case 'ring':
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;

        // 破線の円
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        break;

      case 'fragment':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        // 四角いフラグメント
        ctx.fillRect(p.currentX - p.size / 2, p.currentY - p.size / 2, p.size, p.size);
        break;

      case 'spark':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
