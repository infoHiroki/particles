/**
 * Record エフェクト
 * レコード + 回転 + ビニール
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#111111', '#333333', '#ff0000'];
interface RecordParticle extends Particle { type: 'disc' | 'groove' | 'arm'; size: number; rotation: number; rotSpeed: number; color: string; }
export const recordEffect: Effect = {
  config: { name: 'record', description: 'レコード + 回転', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: RecordParticle[] = [];
    particles.push({ id: generateId(), type: 'disc', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 35, rotation: 0, rotSpeed: 0.05, color: DEFAULT_COLORS[0] });
    const grooveCount = Math.floor(4 * intensity);
    for (let i = 0; i < grooveCount; i++) {
      particles.push({ id: generateId(), type: 'groove', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 15 + i * 6, rotation: 0, rotSpeed: 0.05, color: DEFAULT_COLORS[1] });
    }
    particles.push({ id: generateId(), type: 'arm', x: x + 25, y: y - 30, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 30, rotation: 0.3, rotSpeed: 0, color: '#888888' });
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as RecordParticle;
    p.progress += deltaTime;
    const t = p.progress / p.maxProgress;
    if (t >= 1) return null;
    p.rotation += p.rotSpeed;
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as RecordParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'disc') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = DEFAULT_COLORS[2];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'groove') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(0, 0, 5, p.size);
      ctx.fillRect(0, p.size - 5, 10, 5);
      ctx.restore();
      return;
    }
    ctx.restore();
  },
};
