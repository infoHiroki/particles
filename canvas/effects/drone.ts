/**
 * Drone エフェクト
 * ドローン + 飛行 + プロペラ
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#444444', '#888888', '#aaaaaa'];
interface DroneParticle extends Particle { type: 'body' | 'propeller' | 'wind'; size: number; propAngle: number; armIndex: number; color: string; }
export const droneEffect: Effect = {
  config: { name: 'drone', description: 'ドローン + 飛行', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: DroneParticle[] = [];
    particles.push({ id: generateId(), type: 'body', x, y, progress: 0, maxProgress: 60, alpha: 0, size: 12, propAngle: 0, armIndex: 0, color: DEFAULT_COLORS[0] });
    const armOffsets = [[-20, -15], [20, -15], [-20, 15], [20, 15]];
    for (let i = 0; i < 4; i++) {
      particles.push({ id: generateId(), type: 'propeller', x: x + armOffsets[i][0], y: y + armOffsets[i][1], progress: 0, maxProgress: 55, delay: 2, alpha: 0, size: 10, propAngle: random(0, Math.PI * 2), armIndex: i, color: DEFAULT_COLORS[2] });
    }
    const windCount = Math.floor(6 * intensity);
    for (let i = 0; i < windCount; i++) {
      particles.push({ id: generateId(), type: 'wind', x: x + random(-25, 25), y: y + random(10, 25), progress: 0, maxProgress: 35, delay: random(5, 25), alpha: 0, size: random(3, 6), propAngle: 0, armIndex: 0, color: '#cccccc' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as DroneParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'propeller') {
      p.propAngle += 0.5;
    } else if (p.type === 'wind') {
      p.y += 0.8;
      p.size *= 0.98;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : (p.type === 'wind' ? 0.4 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as DroneParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'body') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;
      const armOffsets = [[-20, -15], [20, -15], [-20, 15], [20, 15]];
      for (const [ox, oy] of armOffsets) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + ox, p.y + oy);
        ctx.stroke();
      }
    } else if (p.type === 'propeller') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.propAngle);
      ctx.fillStyle = p.color + '88';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color + '66';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
