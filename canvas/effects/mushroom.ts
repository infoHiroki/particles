/**
 * Mushroom エフェクト
 * シンプルなベニテングタケ風キノコ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

interface MushroomParticle extends Particle {
  type: 'stem' | 'cap' | 'spot' | 'spore';
  size: number;
  vx: number;
  vy: number;
  color: string;
  angle?: number;
}

export const mushroomEffect: Effect = {
  config: {
    name: 'mushroom',
    description: 'シンプルなキノコ',
    colors: ['#e63946', '#f1faee', '#ffffff'],
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MushroomParticle[] = [];

    const capRadius = 30;
    const stemWidth = 16;
    const stemHeight = 25;

    // 1. 軸（stem）- 傘の下に接続
    particles.push({
      id: generateId(),
      type: 'stem',
      x,
      y: y + capRadius * 0.3,  // 傘の下端に接続
      progress: 0,
      maxProgress: 80,
      delay: 0,
      alpha: 0,
      size: stemWidth,
      vx: stemHeight,  // vxをstemHeightとして使用
      vy: 0,
      color: '#f1faee',
    });

    // 2. 傘（cap）- 赤い半円
    particles.push({
      id: generateId(),
      type: 'cap',
      x,
      y,
      progress: 0,
      maxProgress: 80,
      delay: 2,
      alpha: 0,
      size: capRadius,
      vx: 0,
      vy: 0,
      color: '#e63946',
    });

    // 3. 斑点（spot）- 傘の半円上に等間隔で配置
    const spotCount = 5;
    for (let i = 0; i < spotCount; i++) {
      // 半円上に等間隔で配置（π/6 から 5π/6 の範囲）
      const angle = Math.PI * (0.15 + (i / (spotCount - 1)) * 0.7);
      particles.push({
        id: generateId(),
        type: 'spot',
        x,
        y,
        progress: 0,
        maxProgress: 75,
        delay: 5 + i,
        alpha: 0,
        size: 5,
        vx: 0,
        vy: 0,
        color: '#ffffff',
        angle,
      });
    }

    // 4. 胞子（spore）
    const sporeCount = Math.floor(8 * intensity);
    for (let i = 0; i < sporeCount; i++) {
      particles.push({
        id: generateId(),
        type: 'spore',
        x: x + random(-20, 20),
        y: y + stemHeight + random(5, 15),
        progress: 0,
        maxProgress: 60,
        delay: random(15, 40),
        alpha: 0,
        size: random(2, 3),
        vx: random(-0.2, 0.2),
        vy: random(-0.5, -0.2),
        color: '#ffffcc',
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MushroomParticle;
    p.progress += deltaTime;

    const delayFrames = (p.delay ?? 0) * deltaTime;
    if (p.progress < delayFrames) return p;

    const t = (p.progress - delayFrames) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'spore') {
      p.x += p.vx;
      p.y += p.vy;
    }

    // フェードイン・フェードアウト
    if (t < 0.15) {
      p.alpha = t / 0.15;
    } else if (t > 0.75) {
      p.alpha = (1 - t) / 0.25;
    } else {
      p.alpha = 1;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MushroomParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'stem') {
      // 軸: シンプルな長方形
      const width = p.size;
      const height = p.vx;  // vxにstemHeightを格納
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - width / 2, p.y, width, height);
    } else if (p.type === 'cap') {
      // 傘: シンプルな半円
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, Math.PI, 0);  // 上半分の半円
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'spot') {
      // 斑点: 傘の半円上に配置
      const capRadius = 30;
      const spotDist = capRadius * 0.65;  // 傘の中心から斑点までの距離
      const angle = p.angle ?? Math.PI * 0.5;
      const spotX = p.x + Math.cos(angle) * spotDist;
      const spotY = p.y - Math.sin(angle) * spotDist;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(spotX, spotY, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'spore') {
      // 胞子
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },
};
