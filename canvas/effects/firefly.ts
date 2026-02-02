/**
 * Firefly エフェクト
 * 蛍の光 + 浮遊 + 点滅
 * 用途: 夏の夜、幻想的、自然
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

const DEFAULT_COLORS = ['#ffff00', '#aaff00', '#88ff44', '#ffee66'];

interface FireflyParticle extends Particle {
  type: 'firefly';
  size: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  speed: number;
  glowPhase: number;
  glowSpeed: number;
  color: string;
  trailX: number[];
  trailY: number[];
  changeTargetTimer: number;
}

interface GlowParticle extends Particle {
  type: 'glow';
  size: number;
  currentX: number;
  currentY: number;
  color: string;
  fadeSpeed: number;
}

type FireflyEffectParticle = FireflyParticle | GlowParticle;

export const fireflyEffect: Effect = {
  config: {
    name: 'firefly',
    description: '蛍の光 + 浮遊 + 点滅',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: FireflyEffectParticle[] = [];

    const count = Math.floor(15 * intensity);
    for (let i = 0; i < count; i++) {
      const startX = x + random(-100, 100);
      const startY = y + random(-80, 80);
      particles.push({
        id: generateId(),
        type: 'firefly',
        x: startX,
        y: startY,
        progress: 0,
        maxProgress: 150 + random(0, 50),
        delay: random(0, 20),
        alpha: 0,
        size: random(2, 4),
        currentX: startX,
        currentY: startY,
        targetX: startX + random(-50, 50),
        targetY: startY + random(-50, 50),
        speed: random(0.5, 1.5),
        glowPhase: random(0, Math.PI * 2),
        glowSpeed: random(0.05, 0.12),
        color: randomPick(colors),
        trailX: [],
        trailY: [],
        changeTargetTimer: 0,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FireflyEffectParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    if (p.type === 'firefly') {
      // 目標点に向かってゆっくり移動
      const dx = p.targetX - p.currentX;
      const dy = p.targetY - p.currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2) {
        p.currentX += (dx / dist) * p.speed;
        p.currentY += (dy / dist) * p.speed;
      }

      // 定期的に目標点を変更
      p.changeTargetTimer += deltaTime;
      if (p.changeTargetTimer > 30 || dist < 5) {
        p.targetX = p.x + random(-80, 80);
        p.targetY = p.y + random(-60, 60);
        p.changeTargetTimer = 0;
      }

      // 軌跡を記録
      p.trailX.push(p.currentX);
      p.trailY.push(p.currentY);
      if (p.trailX.length > 8) {
        p.trailX.shift();
        p.trailY.shift();
      }

      // 点滅
      p.glowPhase += p.glowSpeed;
      const glow = (Math.sin(p.glowPhase) + 1) / 2;
      const fadeIn = t < 0.1 ? t / 0.1 : 1;
      const fadeOut = t > 0.85 ? (1 - t) / 0.15 : 1;
      p.alpha = glow * fadeIn * fadeOut;
    } else if (p.type === 'glow') {
      p.alpha -= p.fadeSpeed;
      if (p.alpha <= 0) return null;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FireflyEffectParticle;
    ctx.save();

    if (p.type === 'firefly') {
      // 軌跡を描画
      if (p.trailX.length > 1) {
        ctx.globalAlpha = p.alpha * 0.3;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.trailX[0], p.trailY[0]);
        for (let i = 1; i < p.trailX.length; i++) {
          ctx.lineTo(p.trailX[i], p.trailY[i]);
        }
        ctx.stroke();
      }

      // 外側のグロー
      ctx.globalAlpha = p.alpha * 0.4;
      const gradient = ctx.createRadialGradient(
        p.currentX, p.currentY, 0,
        p.currentX, p.currentY, p.size * 6
      );
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(0.3, p.color + '80');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size * 6, 0, Math.PI * 2);
      ctx.fill();

      // 蛍本体
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'glow') {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
};
