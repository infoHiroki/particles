/**
 * Aurora エフェクト
 * オーロラの光 + 波動 + グラデーション
 * 用途: 北極、神秘、幻想的
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

const DEFAULT_COLORS = ['#00ff88', '#00ffcc', '#0088ff', '#8800ff', '#ff00ff'];

interface WaveParticle extends Particle {
  type: 'wave';
  amplitude: number;
  frequency: number;
  phase: number;
  phaseSpeed: number;
  width: number;
  height: number;
  color1: string;
  color2: string;
  yOffset: number;
}

interface ShimmerParticle extends Particle {
  type: 'shimmer';
  size: number;
  currentX: number;
  currentY: number;
  driftX: number;
  driftY: number;
  color: string;
  pulsePhase: number;
}

interface RayParticle extends Particle {
  type: 'ray';
  width: number;
  height: number;
  swayPhase: number;
  swayAmount: number;
  color: string;
}

type AuroraParticle = WaveParticle | ShimmerParticle | RayParticle;

export const auroraEffect: Effect = {
  config: {
    name: 'aurora',
    description: 'オーロラの光 + 波動 + グラデーション',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: AuroraParticle[] = [];

    // 波状のオーロラレイヤー
    for (let i = 0; i < 4; i++) {
      const colorIndex = i % colors.length;
      particles.push({
        id: generateId(),
        type: 'wave',
        x,
        y: y - 30 + i * 15,
        progress: 0,
        maxProgress: 120,
        alpha: 0,
        amplitude: 20 + i * 5,
        frequency: 0.02 + i * 0.005,
        phase: i * Math.PI / 4,
        phaseSpeed: 0.03 + random(-0.01, 0.01),
        width: 300,
        height: 40 + random(-10, 10),
        color1: colors[colorIndex],
        color2: colors[(colorIndex + 1) % colors.length],
        yOffset: i * 15,
      });
    }

    // 光の筋（レイ）
    const rayCount = Math.floor(6 * intensity);
    for (let i = 0; i < rayCount; i++) {
      particles.push({
        id: generateId(),
        type: 'ray',
        x: x - 100 + (i / rayCount) * 200,
        y: y - 50,
        progress: 0,
        maxProgress: 100,
        delay: random(0, 20),
        alpha: 0,
        width: random(3, 8),
        height: random(60, 120),
        swayPhase: random(0, Math.PI * 2),
        swayAmount: random(10, 25),
        color: randomPick(colors),
      });
    }

    // きらめきパーティクル
    const shimmerCount = Math.floor(25 * intensity);
    for (let i = 0; i < shimmerCount; i++) {
      particles.push({
        id: generateId(),
        type: 'shimmer',
        x: x + random(-120, 120),
        y: y + random(-60, 40),
        progress: 0,
        maxProgress: 80 + random(0, 40),
        delay: random(0, 30),
        alpha: 0,
        size: random(1, 3),
        currentX: x + random(-120, 120),
        currentY: y + random(-60, 40),
        driftX: random(-0.3, 0.3),
        driftY: random(-0.5, -0.1),
        color: randomPick(colors),
        pulsePhase: random(0, Math.PI * 2),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as AuroraParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'wave':
        p.phase += p.phaseSpeed;
        p.alpha = t < 0.15 ? t / 0.15 * 0.5 : t > 0.8 ? (1 - t) / 0.2 * 0.5 : 0.5;
        break;

      case 'ray':
        p.swayPhase += 0.05;
        p.alpha = t < 0.2 ? t / 0.2 * 0.4 : t > 0.7 ? (1 - t) / 0.3 * 0.4 : 0.4;
        break;

      case 'shimmer':
        p.currentX += p.driftX;
        p.currentY += p.driftY;
        p.pulsePhase += 0.15;
        const pulse = (Math.sin(p.pulsePhase) + 1) / 2;
        p.alpha = pulse * (t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as AuroraParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'wave':
        // 波形のグラデーション
        const waveGradient = ctx.createLinearGradient(
          p.x - p.width / 2, p.y,
          p.x + p.width / 2, p.y
        );
        waveGradient.addColorStop(0, 'transparent');
        waveGradient.addColorStop(0.2, p.color1 + '60');
        waveGradient.addColorStop(0.5, p.color2 + '80');
        waveGradient.addColorStop(0.8, p.color1 + '60');
        waveGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = waveGradient;
        ctx.beginPath();
        ctx.moveTo(p.x - p.width / 2, p.y + p.height);

        // 波形を描画
        for (let i = 0; i <= p.width; i += 5) {
          const wx = p.x - p.width / 2 + i;
          const wy = p.y + Math.sin(i * p.frequency + p.phase) * p.amplitude;
          ctx.lineTo(wx, wy);
        }

        ctx.lineTo(p.x + p.width / 2, p.y + p.height);
        ctx.closePath();
        ctx.fill();
        break;

      case 'ray':
        const swayX = Math.sin(p.swayPhase) * p.swayAmount;
        const rayGradient = ctx.createLinearGradient(
          p.x + swayX, p.y,
          p.x + swayX, p.y + p.height
        );
        rayGradient.addColorStop(0, p.color + '00');
        rayGradient.addColorStop(0.3, p.color + '60');
        rayGradient.addColorStop(0.7, p.color + '40');
        rayGradient.addColorStop(1, p.color + '00');

        ctx.fillStyle = rayGradient;
        ctx.beginPath();
        ctx.moveTo(p.x + swayX - p.width / 2, p.y);
        ctx.lineTo(p.x + swayX + p.width / 2, p.y);
        ctx.lineTo(p.x + swayX + p.width / 4, p.y + p.height);
        ctx.lineTo(p.x + swayX - p.width / 4, p.y + p.height);
        ctx.closePath();
        ctx.fill();
        break;

      case 'shimmer':
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
