/**
 * Microphone エフェクト
 * マイク + 音波 + 収音
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#444444', '#666666', '#00aaff'];
interface MicrophoneParticle extends Particle { type: 'mic' | 'wave'; size: number; dist: number; angle: number; color: string; }
export const microphoneEffect: Effect = {
  config: { name: 'microphone', description: 'マイク + 音波', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: MicrophoneParticle[] = [];
    particles.push({ id: generateId(), type: 'mic', x, y, progress: 0, maxProgress: 70, delay: 0, alpha: 0, size: 20, dist: 0, angle: 0, color: DEFAULT_COLORS[0] });
    const waveCount = Math.floor(8 * intensity);
    for (let i = 0; i < waveCount; i++) {
      const angle = random(-0.8, 0.8) - Math.PI / 2;
      particles.push({ id: generateId(), type: 'wave', x, y: y - 25, progress: 0, maxProgress: 40, delay: i * 5, alpha: 0, size: 3, dist: 0, angle, color: DEFAULT_COLORS[2] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as MicrophoneParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'wave') {
      p.dist = t * 40;
    }
    p.alpha = Math.sin(t * Math.PI) * (p.type === 'mic' ? 1 : 0.6);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as MicrophoneParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'mic') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y - 10, p.size * 0.5, p.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(p.x - 3, p.y, 6, 20);
      ctx.fillStyle = '#888888';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 10, p.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const px = p.x + Math.cos(p.angle) * p.dist;
      const py = p.y + Math.sin(p.angle) * p.dist;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
