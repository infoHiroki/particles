/**
 * Summon エフェクト
 * 召喚 + 魔法陣 + 光柱
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#aa66ff', '#cc88ff', '#ddaaff'];

interface SummonParticle extends Particle {
  type: 'circle' | 'pillar' | 'rune' | 'spark';
  size: number;
  rotation: number;
  rotationSpeed: number;
  currentY: number;
  color: string;
}

export const summonEffect: Effect = {
  config: { name: 'summon', description: '召喚 + 魔法陣', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SummonParticle[] = [];

    // Magic circle
    particles.push({
      id: generateId(), type: 'circle', x, y: y + 30, progress: 0, maxProgress: 80,
      alpha: 0, size: 60, rotation: 0, rotationSpeed: 0.03, currentY: y + 30,
      color: DEFAULT_COLORS[0],
    });

    // Light pillar
    particles.push({
      id: generateId(), type: 'pillar', x, y, progress: 0, maxProgress: 70,
      delay: 15, alpha: 0, size: 40, rotation: 0, rotationSpeed: 0, currentY: y,
      color: DEFAULT_COLORS[1],
    });

    // Runes
    const runeCount = 6;
    for (let i = 0; i < runeCount; i++) {
      const angle = (i / runeCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'rune', x: x + Math.cos(angle) * 50, y: y + 30,
        progress: 0, maxProgress: 60, delay: i * 3, alpha: 0, size: 10,
        rotation: angle, rotationSpeed: 0.02, currentY: y + 30, color: DEFAULT_COLORS[2],
      });
    }

    // Rising sparks
    const sparkCount = Math.floor(15 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      particles.push({
        id: generateId(), type: 'spark', x: x + random(-40, 40), y: y + 30,
        progress: 0, maxProgress: 50, delay: random(10, 40), alpha: 0,
        size: random(2, 4), rotation: 0, rotationSpeed: 0,
        currentY: y + 30, color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SummonParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'circle') {
      p.rotation += p.rotationSpeed;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 0.8;
    } else if (p.type === 'pillar') {
      p.alpha = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 0.6;
    } else if (p.type === 'rune') {
      p.rotation += p.rotationSpeed;
      p.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
    } else {
      p.currentY -= 2;
      p.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SummonParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'circle') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;

      // Outer circle
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.stroke();

      // Inner circle
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Hexagram
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * p.size * 0.8, Math.sin(a) * p.size * 0.8);
        ctx.lineTo(Math.cos(a + Math.PI * 2 / 3) * p.size * 0.8,
                   Math.sin(a + Math.PI * 2 / 3) * p.size * 0.8);
        ctx.stroke();
      }
    } else if (p.type === 'pillar') {
      const g = ctx.createLinearGradient(p.x, p.y - 80, p.x, p.y + 30);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.3, p.color + '60');
      g.addColorStop(0.5, p.color + 'aa');
      g.addColorStop(0.7, p.color + '60');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.size / 2, p.y - 80, p.size, 110);
    } else if (p.type === 'rune') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('✧', p.x, p.y);
    } else {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.currentY, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
