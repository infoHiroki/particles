/**
 * Focus エフェクト
 * 集中 + 収束 + 光
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';

const DEFAULT_COLORS = ['#88aaff', '#aaccff', '#cceeff'];

interface FocusParticle extends Particle {
  type: 'ring' | 'line' | 'glow';
  size: number;
  angle: number;
  targetSize: number;
  color: string;
}

export const focusEffect: Effect = {
  config: { name: 'focus', description: '集中 + 収束', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: FocusParticle[] = [];

    // Converging rings
    for (let i = 0; i < 3; i++) {
      particles.push({
        id: generateId(), type: 'ring', x, y, progress: 0, maxProgress: 40,
        delay: i * 8, alpha: 0, size: 80 - i * 15, angle: 0, targetSize: 20,
        color: DEFAULT_COLORS[i],
      });
    }

    // Focus lines
    const lineCount = 8;
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      particles.push({
        id: generateId(), type: 'line', x, y, progress: 0, maxProgress: 35,
        delay: random(0, 15), alpha: 0, size: random(40, 60), angle, targetSize: 15,
        color: DEFAULT_COLORS[Math.floor(random(0, 3))],
      });
    }

    // Central glow
    particles.push({
      id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 50,
      delay: 15, alpha: 0, size: 30, angle: 0, targetSize: 0, color: '#ffffff',
    });

    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as FocusParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;

    if (p.type === 'ring') {
      p.size = p.size + (p.targetSize - p.size) * t;
      p.alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8 * 0.7;
    } else if (p.type === 'line') {
      p.size = p.size * (1 - t * 0.7);
      p.alpha = t < 0.3 ? t / 0.3 : (1 - t) / 0.7;
    } else {
      p.size = 30 + Math.sin(p.progress * 0.2) * 8;
      p.alpha = (t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1) * 0.6;
    }
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as FocusParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'line') {
      const startX = p.x + Math.cos(p.angle) * p.size;
      const startY = p.y + Math.sin(p.angle) * p.size;
      const endX = p.x + Math.cos(p.angle) * p.targetSize;
      const endY = p.y + Math.sin(p.angle) * p.targetSize;

      const g = ctx.createLinearGradient(startX, startY, endX, endY);
      g.addColorStop(0, 'transparent');
      g.addColorStop(1, p.color);
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, p.color + 'cc');
      g.addColorStop(0.5, p.color + '44');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
