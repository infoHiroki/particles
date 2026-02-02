/**
 * Matrix エフェクト
 * デジタル文字 + 落下 + グロー
 * 用途: サイバー、ハッカー、テクノロジー
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

const DEFAULT_COLORS = ['#00ff00', '#00cc00', '#00ff44', '#88ff88'];
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface ColumnParticle extends Particle {
  type: 'column';
  chars: string[];
  charAlphas: number[];
  fontSize: number;
  currentY: number;
  speed: number;
  color: string;
  changeTimer: number;
}

interface FlashParticle extends Particle {
  type: 'flash';
  char: string;
  fontSize: number;
  color: string;
}

type MatrixParticle = ColumnParticle | FlashParticle;

function randomChar(): string {
  return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
}

export const matrixEffect: Effect = {
  config: {
    name: 'matrix',
    description: 'デジタル文字 + 落下 + グロー',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: MatrixParticle[] = [];

    // 落下する文字列
    const columnCount = Math.floor(12 * intensity);
    for (let i = 0; i < columnCount; i++) {
      const charCount = Math.floor(random(8, 16));
      const chars: string[] = [];
      const charAlphas: number[] = [];

      for (let j = 0; j < charCount; j++) {
        chars.push(randomChar());
        // 先頭が一番明るく、末尾に向かって暗くなる
        charAlphas.push(1 - (j / charCount) * 0.8);
      }

      const fontSize = random(12, 18);
      particles.push({
        id: generateId(),
        type: 'column',
        x: x - 100 + (i / columnCount) * 200 + random(-10, 10),
        y: y - 100,
        progress: 0,
        maxProgress: 80 + random(0, 40),
        delay: random(0, 20),
        alpha: 0,
        chars,
        charAlphas,
        fontSize,
        currentY: y - 150 - random(0, 100),
        speed: random(3, 6),
        color: randomPick(colors),
        changeTimer: 0,
      });
    }

    // フラッシュする文字（ランダム位置）
    const flashCount = Math.floor(15 * intensity);
    for (let i = 0; i < flashCount; i++) {
      particles.push({
        id: generateId(),
        type: 'flash',
        x: x + random(-120, 120),
        y: y + random(-80, 80),
        progress: 0,
        maxProgress: 15 + random(0, 15),
        delay: random(0, 50),
        alpha: 0,
        char: randomChar(),
        fontSize: random(14, 22),
        color: randomPick(colors),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MatrixParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'column':
        p.currentY += p.speed;
        p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;

        // 定期的に文字をランダム変更
        p.changeTimer += deltaTime;
        if (p.changeTimer > 3) {
          const idx = Math.floor(random(0, p.chars.length));
          p.chars[idx] = randomChar();
          p.changeTimer = 0;
        }
        break;

      case 'flash':
        p.alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        // ランダムに文字変更
        if (Math.random() > 0.7) {
          p.char = randomChar();
        }
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MatrixParticle;
    ctx.save();

    switch (p.type) {
      case 'column':
        ctx.font = `bold ${p.fontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        for (let i = 0; i < p.chars.length; i++) {
          const charY = p.currentY + i * p.fontSize;
          const charAlpha = p.alpha * p.charAlphas[i];

          if (charAlpha <= 0) continue;

          // 先頭文字は白く光る
          if (i === 0) {
            ctx.globalAlpha = charAlpha;
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
          } else {
            ctx.globalAlpha = charAlpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 5;
          }

          ctx.fillText(p.chars[i], p.x, charY);
        }
        break;

      case 'flash':
        ctx.globalAlpha = p.alpha;
        ctx.font = `bold ${p.fontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.fillText(p.char, p.x, p.y);
        break;
    }

    ctx.restore();
  },
};
