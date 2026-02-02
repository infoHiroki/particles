/**
 * Pyramid エフェクト
 * ピラミッド + 3D + 神秘
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffcc44', '#ffaa22', '#ff8800'];
interface PyramidParticle extends Particle { type: 'pyramid' | 'glow'; size: number; rotationY: number; spinY: number; color: string; }
export const pyramidEffect: Effect = {
  config: { name: 'pyramid', description: 'ピラミッド + 神秘', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PyramidParticle[] = [];
    particles.push({ id: generateId(), type: 'glow', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 50, rotationY: 0, spinY: 0, color: DEFAULT_COLORS[0] });
    const count = Math.floor(3 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'pyramid', x: x + random(-20, 20), y: y + random(-15, 15), progress: 0, maxProgress: 55, delay: i * 8, alpha: 0, size: random(18, 28), rotationY: random(0, Math.PI * 2), spinY: random(-0.04, 0.04), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PyramidParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.rotationY += p.spinY;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : (p.type === 'glow' ? 0.4 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PyramidParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    if (p.type === 'glow') {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      g.addColorStop(0, p.color + '44');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const s = p.size;
      const cosY = Math.cos(p.rotationY);
      const sinY = Math.sin(p.rotationY);
      const basePoints = [
        [-1, 0.5, -1], [1, 0.5, -1], [1, 0.5, 1], [-1, 0.5, 1]
      ].map(([x, y, z]) => {
        const x1 = x * cosY + z * sinY;
        return [x1 * s * 0.4, y * s * 0.5];
      });
      const apex = [0, -s * 0.6];
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(basePoints[0][0], basePoints[0][1]);
      for (let i = 1; i < 4; i++) {
        ctx.lineTo(basePoints[i][0], basePoints[i][1]);
      }
      ctx.closePath();
      ctx.fill();
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(apex[0], apex[1]);
        ctx.lineTo(basePoints[i][0], basePoints[i][1]);
        ctx.lineTo(basePoints[(i + 1) % 4][0], basePoints[(i + 1) % 4][1]);
        ctx.closePath();
        ctx.globalAlpha = p.alpha * (0.5 + (i % 2) * 0.3);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
