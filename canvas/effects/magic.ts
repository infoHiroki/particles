/**
 * Magic エフェクト
 * 魔法 + キラキラ + 光の軌跡
 * 用途: ファンタジー、魔法詠唱、神秘
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, randomPick, random, easeOutCubic } from '../utils';

const DEFAULT_COLORS = ['#ff88ff', '#88ffff', '#ffff88', '#ffffff', '#aa88ff'];

interface OrbParticle extends Particle {
  type: 'orb';
  size: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  currentX: number;
  currentY: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface SparkleParticle extends Particle {
  type: 'sparkle';
  size: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

interface RuneParticle extends Particle {
  type: 'rune';
  size: number;
  rotation: number;
  rotationSpeed: number;
  symbol: string;
  color: string;
}

interface AuraParticle extends Particle {
  type: 'aura';
  radius: number;
  maxRadius: number;
  rotation: number;
  color: string;
}

type MagicParticle = OrbParticle | SparkleParticle | RuneParticle | AuraParticle;

const RUNE_SYMBOLS = ['★', '✦', '◇', '○', '△', '☆'];

export const magicEffect: Effect = {
  config: {
    name: 'magic',
    description: '魔法 + キラキラ + 光の軌跡',
    colors: DEFAULT_COLORS,
    intensity: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const particles: MagicParticle[] = [];

    // 中心オーラ
    particles.push({
      id: generateId(),
      type: 'aura',
      x,
      y,
      progress: 0,
      maxProgress: 70,
      alpha: 0,
      radius: 20,
      maxRadius: 60,
      rotation: 0,
      color: colors[0],
    });

    // 周回する光の玉
    const orbCount = Math.floor(5 * intensity);
    for (let i = 0; i < orbCount; i++) {
      const startAngle = (i / orbCount) * Math.PI * 2;
      particles.push({
        id: generateId(),
        type: 'orb',
        x,
        y,
        progress: 0,
        maxProgress: 80,
        delay: i * 3,
        alpha: 0,
        size: random(4, 7),
        angle: startAngle,
        orbitRadius: random(40, 70),
        orbitSpeed: random(0.08, 0.12) * (i % 2 === 0 ? 1 : -1),
        currentX: x + Math.cos(startAngle) * 50,
        currentY: y + Math.sin(startAngle) * 50,
        color: randomPick(colors),
        trail: [],
      });
    }

    // キラキラ
    const sparkleCount = Math.floor(30 * intensity);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 3);
      particles.push({
        id: generateId(),
        type: 'sparkle',
        x,
        y,
        progress: 0,
        maxProgress: 50 + random(0, 30),
        delay: random(0, 25),
        alpha: 0,
        size: random(2, 5),
        currentX: x + random(-20, 20),
        currentY: y + random(-20, 20),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.1, 0.1),
        color: randomPick(colors),
      });
    }

    // ルーン記号
    const runeCount = Math.floor(6 * intensity);
    for (let i = 0; i < runeCount; i++) {
      particles.push({
        id: generateId(),
        type: 'rune',
        x: x + random(-60, 60),
        y: y + random(-60, 60),
        progress: 0,
        maxProgress: 40 + random(0, 20),
        delay: random(10, 30),
        alpha: 0,
        size: random(12, 20),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.03, 0.03),
        symbol: randomPick(RUNE_SYMBOLS),
        color: randomPick(colors),
      });
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MagicParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'aura':
        p.rotation += 0.02;
        const auraEased = easeOutCubic(t);
        p.radius = 20 + (p.maxRadius - 20) * auraEased;
        p.alpha = t < 0.2 ? t / 0.2 * 0.5 : 0.5 * (1 - (t - 0.2) / 0.8);
        break;

      case 'orb':
        p.angle += p.orbitSpeed;
        const orbitShrink = 1 - t * 0.3;
        p.currentX = p.x + Math.cos(p.angle) * p.orbitRadius * orbitShrink;
        p.currentY = p.y + Math.sin(p.angle) * p.orbitRadius * orbitShrink;

        // 軌跡を記録
        p.trail.unshift({ x: p.currentX, y: p.currentY });
        if (p.trail.length > 10) p.trail.pop();

        p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
        break;

      case 'sparkle':
        p.currentX += p.vx;
        p.currentY += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.rotation += p.rotationSpeed;
        p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
        p.size *= 0.995;
        break;

      case 'rune':
        p.rotation += p.rotationSpeed;
        p.alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MagicParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'aura':
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // 内側のグロー
        const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
        innerGradient.addColorStop(0, p.color + '60');
        innerGradient.addColorStop(0.5, p.color + '30');
        innerGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // 外周の破線リング
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, p.radius * 1.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        break;

      case 'orb':
        // 軌跡を描画
        if (p.trail.length > 1) {
          for (let i = 1; i < p.trail.length; i++) {
            const trailAlpha = (1 - i / p.trail.length) * 0.5;
            ctx.globalAlpha = p.alpha * trailAlpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.trail[i].x, p.trail[i].y, p.size * (1 - i / p.trail.length), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 光の玉本体
        ctx.globalAlpha = p.alpha;
        const orbGradient = ctx.createRadialGradient(
          p.currentX, p.currentY, 0,
          p.currentX, p.currentY, p.size * 2
        );
        orbGradient.addColorStop(0, '#ffffff');
        orbGradient.addColorStop(0.3, p.color);
        orbGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = orbGradient;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'sparkle':
        ctx.translate(p.currentX, p.currentY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        // 4方向の輝き
        const spikes = 4;
        const outerRadius = p.size;
        const innerRadius = p.size * 0.3;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i / (spikes * 2)) * Math.PI * 2;
          const sx = Math.cos(angle) * radius;
          const sy = Math.sin(angle) * radius;
          if (i === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'rune':
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillText(p.symbol, 0, 0);
        break;
    }

    ctx.restore();
  },
};
