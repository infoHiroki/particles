/**
 * Sunset エフェクト
 * 夕焼け + 美しい + 温かい
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff4422', '#ff6644', '#ffaa66'];
interface SunsetParticle extends Particle { type: 'sun' | 'cloud' | 'sky' | 'bird'; size: number; vx: number; vy: number; color: string; }
export const sunsetEffect: Effect = {
  config: { name: 'sunset', description: '夕焼け + 美しい', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SunsetParticle[] = [];
    particles.push({ id: generateId(), type: 'sky', x, y, progress: 0, maxProgress: 70, alpha: 0, size: 100, vx: 0, vy: 0, color: '#ff6633' });
    particles.push({ id: generateId(), type: 'sun', x, y: y + 15, progress: 0, maxProgress: 65, delay: 3, alpha: 0, size: 30, vx: 0, vy: 0.3, color: '#ff4400' });
    const cloudCount = Math.floor(4 * intensity);
    for (let i = 0; i < cloudCount; i++) {
      particles.push({ id: generateId(), type: 'cloud', x: x + random(-60, 60), y: y + random(-30, 10), progress: 0, maxProgress: 60, delay: random(5, 20), alpha: 0, size: random(20, 35), vx: random(0.2, 0.5), vy: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const birdCount = Math.floor(3 * intensity);
    for (let i = 0; i < birdCount; i++) {
      particles.push({ id: generateId(), type: 'bird', x: x + random(-50, 50), y: y + random(-40, -10), progress: 0, maxProgress: 55, delay: random(10, 30), alpha: 0, size: random(3, 5), vx: random(0.5, 1), vy: random(-0.2, 0.2), color: '#222222' });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SunsetParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'sun') {
      p.y += p.vy;
    } else if (p.type === 'cloud' || p.type === 'bird') {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : (p.type === 'sky' ? 0.6 : 1);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SunsetParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'sky') {
      const g = ctx.createLinearGradient(p.x, p.y - p.size, p.x, p.y + p.size);
      g.addColorStop(0, '#553366');
      g.addColorStop(0.4, '#ff6633');
      g.addColorStop(0.7, '#ffaa66');
      g.addColorStop(1, '#ffddaa');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.size, p.y - p.size * 0.7, p.size * 2, p.size * 1.4);
    } else if (p.type === 'sun') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI, true);
      ctx.fill();
    } else if (p.type === 'cloud') {
      ctx.fillStyle = p.color + 'aa';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(p.x + (i - 1) * p.size * 0.5, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(p.x - p.size, p.y);
      ctx.quadraticCurveTo(p.x - p.size * 0.3, p.y - p.size, p.x, p.y);
      ctx.quadraticCurveTo(p.x + p.size * 0.3, p.y - p.size, p.x + p.size, p.y);
      ctx.stroke();
    }
    ctx.restore();
  },
};
