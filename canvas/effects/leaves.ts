/**
 * Leaves エフェクト
 * 落ち葉 + 風 + 回転
 * 用途: 秋、自然、風情
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

const DEFAULT_COLORS = ['#d4a017', '#c68e17', '#b5651d', '#8b4513', '#a0522d', '#cd853f'];

interface LeafParticle extends Particle {
  type: 'leaf';
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  color: string;
  leafType: number;
  currentX: number;
  currentY: number;
  baseAlpha: number;
}

type LeavesParticle = LeafParticle;

export const leavesEffect: Effect = {
  config: {
    name: 'leaves',
    description: '落ち葉 + 風 + 回転',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: LeavesParticle[] = [];

    const count = Math.floor(20 * intensity);
    for (let i = 0; i < count; i++) {
      const baseAlpha = random(0.7, 1);
      particles.push({
        id: generateId(),
        type: 'leaf',
        x: x + random(-100, 100),
        y: y - 50 + random(-30, 30),
        progress: 0,
        maxProgress: 150 + random(0, 80),
        alpha: baseAlpha,
        size: random(8, 16),
        vx: random(0.3, 1.5),
        vy: random(0.8, 2),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.08, 0.08),
        wobbleSpeed: random(0.03, 0.07),
        wobbleAmount: random(30, 60),
        color: randomPick(colors),
        leafType: Math.floor(random(0, 3)),
        currentX: x + random(-100, 100),
        currentY: y - 50 + random(-30, 30),
        baseAlpha,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as LeavesParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;

    if (t >= 1) return null;

    // 風の影響でゆらゆら
    p.currentX += p.vx + Math.sin(p.progress * p.wobbleSpeed) * 1.5;
    p.currentY += p.vy + Math.cos(p.progress * p.wobbleSpeed * 0.5) * 0.3;
    p.rotation += p.rotationSpeed;

    // 風の強さを変動
    p.vx += Math.sin(p.progress * 0.02) * 0.03;

    p.alpha = t > 0.8 ? p.baseAlpha * (1 - (t - 0.8) / 0.2) : p.baseAlpha;

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as LeavesParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.currentX, p.currentY);
    ctx.rotate(p.rotation);

    ctx.fillStyle = p.color;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;

    // 葉の形状をタイプによって変える
    switch (p.leafType) {
      case 0:
        // 楕円形の葉
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        // 葉脈
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(0, p.size);
        ctx.stroke();
        break;

      case 1:
        // カエデ風（簡略化）
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const r = p.size * (0.6 + Math.sin(i * 2) * 0.4);
          const px = r * Math.cos(angle);
          const py = r * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            const midAngle = ((i - 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
            const midR = p.size * 0.3;
            ctx.quadraticCurveTo(
              midR * Math.cos(midAngle),
              midR * Math.sin(midAngle),
              px,
              py
            );
          }
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 2:
        // 丸い葉
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        // 茎
        ctx.beginPath();
        ctx.moveTo(0, p.size * 0.5);
        ctx.lineTo(0, p.size);
        ctx.stroke();
        break;
    }

    ctx.restore();
  },
};
