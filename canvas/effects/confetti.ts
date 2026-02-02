/**
 * Confetti エフェクト
 * 紙吹雪 + リボン
 * 用途: お祝い、達成
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

// カラーパレット
const DEFAULT_COLORS = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7',
  '#3f51b5', '#2196f3', '#00bcd4', '#009688',
  '#4caf50', '#ffeb3b', '#ff9800', '#ff5722'
];

interface PieceParticle extends Particle {
  type: 'piece';
  vx: number;
  vy: number;
  gravity: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  currentX: number;
  currentY: number;
}

interface RibbonParticle extends Particle {
  type: 'ribbon';
  vx: number;
  vy: number;
  gravity: number;
  width: number;
  length: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  wave: number;
  waveSpeed: number;
  currentX: number;
  currentY: number;
}

type ConfettiParticle = PieceParticle | RibbonParticle;

export const confettiEffect: Effect = {
  config: {
    name: 'confetti',
    description: '紙吹雪 + リボン',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: ConfettiParticle[] = [];

    // 紙吹雪
    const pieceCount = Math.floor(40 * intensity);
    for (let i = 0; i < pieceCount; i++) {
      const angle = random(-Math.PI, 0);
      particles.push({
        id: generateId(),
        type: 'piece',
        x,
        y,
        progress: 0,
        maxProgress: 100 + random(0, 50),
        alpha: 1,
        vx: Math.cos(angle) * random(3, 8),
        vy: Math.sin(angle) * random(5, 12),
        gravity: 0.15,
        width: random(6, 12),
        height: random(4, 8),
        color: randomPick(colors),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.15, 0.15),
        currentX: x,
        currentY: y,
      });
    }

    // リボン
    const ribbonCount = Math.floor(10 * intensity);
    for (let i = 0; i < ribbonCount; i++) {
      const angle = random(-Math.PI * 0.8, -Math.PI * 0.2);
      particles.push({
        id: generateId(),
        type: 'ribbon',
        x,
        y,
        progress: 0,
        maxProgress: 120 + random(0, 40),
        alpha: 1,
        vx: Math.cos(angle) * random(2, 5),
        vy: Math.sin(angle) * random(4, 8),
        gravity: 0.08,
        width: random(3, 5),
        length: random(20, 40),
        color: randomPick(colors),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.1, 0.1),
        wave: 0,
        waveSpeed: random(0.1, 0.2),
        currentX: x,
        currentY: y,
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as ConfettiParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'piece':
        p.vy += p.gravity;
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        break;

      case 'ribbon':
        p.vy += p.gravity;
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.rotation += p.rotationSpeed;
        p.wave += p.waveSpeed;
        p.alpha = t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as ConfettiParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'piece':
        ctx.translate(p.currentX, p.currentY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        break;

      case 'ribbon':
        ctx.translate(p.currentX, p.currentY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.beginPath();

        // 波打つリボン
        const segments = 10;
        ctx.moveTo(-p.width / 2, 0);
        for (let i = 0; i <= segments; i++) {
          const ty = (i / segments) * p.length;
          const waveOffset = Math.sin(p.wave + i * 0.5) * 5;
          ctx.lineTo(-p.width / 2 + waveOffset, ty);
        }
        for (let i = segments; i >= 0; i--) {
          const ty = (i / segments) * p.length;
          const waveOffset = Math.sin(p.wave + i * 0.5) * 5;
          ctx.lineTo(p.width / 2 + waveOffset, ty);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  },
};
