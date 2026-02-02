/**
 * Glitch エフェクト
 * デジタルノイズ + 色ずれ + スキャンライン
 * 用途: サイバー、エラー、ハッキング
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random } from '../utils';

const DEFAULT_COLORS = ['#ff0066', '#00ffff', '#00ff00', '#ffffff'];

interface BlockParticle extends Particle {
  type: 'block';
  width: number;
  height: number;
  offsetX: number;
  color: string;
  flickerRate: number;
}

interface ScanlineParticle extends Particle {
  type: 'scanline';
  width: number;
  currentY: number;
  speed: number;
}

interface NoiseParticle extends Particle {
  type: 'noise';
  size: number;
  currentX: number;
  currentY: number;
  flickerPhase: number;
}

interface ChromaParticle extends Particle {
  type: 'chroma';
  text: string;
  fontSize: number;
  offsetR: number;
  offsetG: number;
  offsetB: number;
}

type GlitchParticle = BlockParticle | ScanlineParticle | NoiseParticle | ChromaParticle;

export const glitchEffect: Effect = {
  config: {
    name: 'glitch',
    description: 'デジタルノイズ + 色ずれ + スキャンライン',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: GlitchParticle[] = [];

    // グリッチブロック
    const blockCount = Math.floor(8 * intensity);
    for (let i = 0; i < blockCount; i++) {
      particles.push({
        id: generateId(),
        type: 'block',
        x: x + random(-80, 80),
        y: y + random(-60, 60),
        progress: 0,
        maxProgress: 20 + random(0, 30),
        delay: random(0, 15),
        alpha: 0,
        width: random(30, 100),
        height: random(5, 20),
        offsetX: random(-20, 20),
        color: randomPick(colors),
        flickerRate: random(0.3, 0.7),
      });
    }

    // スキャンライン
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(),
        type: 'scanline',
        x,
        y: y - 80 + i * 50,
        progress: 0,
        maxProgress: 40,
        delay: i * 8,
        alpha: 0,
        width: 200,
        currentY: y - 80 + i * 50,
        speed: random(3, 6),
      });
    }

    // ノイズパーティクル
    const noiseCount = Math.floor(30 * intensity);
    for (let i = 0; i < noiseCount; i++) {
      particles.push({
        id: generateId(),
        type: 'noise',
        x: x + random(-100, 100),
        y: y + random(-80, 80),
        progress: 0,
        maxProgress: 25 + random(0, 20),
        delay: random(0, 20),
        alpha: 0,
        size: random(1, 4),
        currentX: x + random(-100, 100),
        currentY: y + random(-80, 80),
        flickerPhase: random(0, Math.PI * 2),
      });
    }

    // 色収差テキスト（装飾用）
    const glitchChars = ['@', '#', '$', '%', '&', '*', '!', '?', '0', '1'];
    for (let i = 0; i < 5; i++) {
      particles.push({
        id: generateId(),
        type: 'chroma',
        x: x + random(-60, 60),
        y: y + random(-40, 40),
        progress: 0,
        maxProgress: 30,
        delay: random(5, 15),
        alpha: 0,
        text: randomPick(glitchChars),
        fontSize: random(12, 24),
        offsetR: random(2, 5),
        offsetG: 0,
        offsetB: random(-5, -2),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as GlitchParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'block':
        // ランダムなちらつき
        p.alpha = Math.random() > p.flickerRate ? 0.8 : 0;
        p.offsetX = random(-20, 20);
        if (t > 0.7) p.alpha *= (1 - t) / 0.3;
        break;

      case 'scanline':
        p.currentY += p.speed;
        p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 0.6;
        break;

      case 'noise':
        p.flickerPhase += 0.5;
        p.alpha = Math.sin(p.flickerPhase) > 0 ? random(0.3, 0.8) : 0;
        p.currentX = p.x + random(-5, 5);
        p.currentY = p.y + random(-5, 5);
        if (t > 0.6) p.alpha *= (1 - t) / 0.4;
        break;

      case 'chroma':
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 0.9;
        p.offsetR = random(2, 6);
        p.offsetB = random(-6, -2);
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as GlitchParticle;
    ctx.save();

    switch (p.type) {
      case 'block':
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x + p.offsetX, p.y, p.width, p.height);
        break;

      case 'scanline':
        ctx.globalAlpha = p.alpha;
        const gradient = ctx.createLinearGradient(
          p.x - p.width / 2, p.currentY,
          p.x + p.width / 2, p.currentY
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(p.x - p.width / 2, p.currentY, p.width, 2);
        break;

      case 'noise':
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.currentX, p.currentY, p.size, p.size);
        break;

      case 'chroma':
        ctx.font = `bold ${p.fontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 赤チャンネル
        ctx.globalAlpha = p.alpha * 0.8;
        ctx.fillStyle = '#ff0000';
        ctx.fillText(p.text, p.x + p.offsetR, p.y);

        // 青チャンネル
        ctx.fillStyle = '#0000ff';
        ctx.fillText(p.text, p.x + p.offsetB, p.y);

        // 白（メイン）
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(p.text, p.x, p.y);
        break;
    }

    ctx.restore();
  },
};
