/**
 * Solarsystem エフェクト
 * ソーラーシステム + 太陽系 + 公転
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ffdd44', '#4488ff', '#ff4444'];
interface SolarsystemParticle extends Particle { type: 'sun' | 'planet'; size: number; orbitRadius: number; angle: number; speed: number; color: string; }
export const solarsystemEffect: Effect = {
  config: { name: 'solarsystem', description: 'ソーラーシステム + 太陽系', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: SolarsystemParticle[] = [];
    particles.push({ id: generateId(), type: 'sun', x, y, progress: 0, maxProgress: 80, delay: 0, alpha: 0, size: 15, orbitRadius: 0, angle: 0, speed: 0, color: '#ffdd44' });
    const planetCount = Math.floor(5 * intensity);
    const planetColors = ['#8888ff', '#88ff88', '#ff8888', '#ffaa44', '#aa88ff'];
    for (let i = 0; i < planetCount; i++) {
      const orbitRadius = 30 + i * 15;
      particles.push({ id: generateId(), type: 'planet', x, y, progress: 0, maxProgress: 80, delay: i * 3, alpha: 0, size: random(4, 8), orbitRadius, angle: random(0, Math.PI * 2), speed: 0.02 + (1 / (i + 1)) * 0.03, color: planetColors[i % 5] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as SolarsystemParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'planet') {
      p.angle += p.speed;
    }
    p.alpha = Math.sin(t * Math.PI);
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as SolarsystemParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.type === 'sun') {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.5, '#ffdd44');
      gradient.addColorStop(1, '#ff8800');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      const px = p.x + Math.cos(p.angle) * p.orbitRadius;
      const py = p.y + Math.sin(p.angle) * p.orbitRadius;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
