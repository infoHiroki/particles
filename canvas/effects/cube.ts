/**
 * Cube エフェクト
 * 立方体 + 3D + 回転
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6688', '#6688ff', '#88ff66'];
interface CubeParticle extends Particle { type: 'cube'; size: number; rotationX: number; rotationY: number; spinX: number; spinY: number; color: string; }
export const cubeEffect: Effect = {
  config: { name: 'cube', description: '立方体 + 3D', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: CubeParticle[] = [];
    const count = Math.floor(4 * intensity);
    for (let i = 0; i < count; i++) {
      particles.push({ id: generateId(), type: 'cube', x: x + random(-30, 30), y: y + random(-30, 30), progress: 0, maxProgress: 60, delay: i * 6, alpha: 0, size: random(15, 25), rotationX: random(0, Math.PI), rotationY: random(0, Math.PI), spinX: random(-0.05, 0.05), spinY: random(-0.05, 0.05), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as CubeParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    p.rotationX += p.spinX;
    p.rotationY += p.spinY;
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as CubeParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    const s = p.size;
    const cosX = Math.cos(p.rotationX);
    const sinX = Math.sin(p.rotationX);
    const cosY = Math.cos(p.rotationY);
    const sinY = Math.sin(p.rotationY);
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ].map(([x, y, z]) => {
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x1 = x * cosY + z1 * sinY;
      return [x1 * s * 0.5, y1 * s * 0.5];
    });
    const faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5]];
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    for (const face of faces) {
      ctx.beginPath();
      ctx.moveTo(vertices[face[0]][0], vertices[face[0]][1]);
      for (let i = 1; i < face.length; i++) {
        ctx.lineTo(vertices[face[i]][0], vertices[face[i]][1]);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  },
};
