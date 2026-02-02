/**
 * Phoenix エフェクト
 * 不死鳥 + 炎 + 再生
 */
import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
const DEFAULT_COLORS = ['#ff6600', '#ffaa00', '#ffdd00'];
interface PhoenixParticle extends Particle { type: 'body' | 'wing' | 'flame' | 'feather'; size: number; vx: number; vy: number; wingAngle: number; color: string; }
export const phoenixEffect: Effect = {
  config: { name: 'phoenix', description: '不死鳥 + 炎', colors: DEFAULT_COLORS, intensity: 1 },
  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const particles: PhoenixParticle[] = [];
    particles.push({ id: generateId(), type: 'body', x, y, progress: 0, maxProgress: 75, alpha: 0, size: 20, vx: 0, vy: -1, wingAngle: 0, color: '#ff4400' });
    particles.push({ id: generateId(), type: 'wing', x, y, progress: 0, maxProgress: 75, delay: 2, alpha: 0, size: 30, vx: 0, vy: -1, wingAngle: 0, color: DEFAULT_COLORS[0] });
    const flameCount = Math.floor(15 * intensity);
    for (let i = 0; i < flameCount; i++) {
      particles.push({ id: generateId(), type: 'flame', x: x + random(-15, 15), y: y + random(5, 20), progress: 0, maxProgress: 35, delay: random(0, 20), alpha: 0, size: random(6, 12), vx: random(-0.5, 0.5), vy: random(-1.5, -0.5), wingAngle: 0, color: DEFAULT_COLORS[i % 3] });
    }
    const featherCount = Math.floor(6 * intensity);
    for (let i = 0; i < featherCount; i++) {
      particles.push({ id: generateId(), type: 'feather', x: x + random(-25, 25), y: y + random(-15, 15), progress: 0, maxProgress: 55, delay: random(10, 35), alpha: 0, size: random(5, 9), vx: random(-1, 1), vy: random(0.3, 1), wingAngle: random(0, Math.PI * 2), color: DEFAULT_COLORS[i % 3] });
    }
    return particles;
  },
  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as PhoenixParticle;
    p.progress += deltaTime;
    if (p.progress < (p.delay ?? 0) * deltaTime) return p;
    const t = (p.progress - (p.delay ?? 0) * deltaTime) / p.maxProgress;
    if (t >= 1) return null;
    if (p.type === 'body' || p.type === 'wing') {
      p.y += p.vy;
      p.wingAngle = Math.sin(p.progress * 0.25) * 0.6;
    } else if (p.type === 'flame') {
      p.x += p.vx;
      p.y += p.vy;
      p.size *= 0.96;
    } else {
      p.x += p.vx;
      p.y += p.vy;
      p.wingAngle += 0.08;
    }
    p.alpha = t < 0.1 ? t / 0.1 : t > 0.75 ? (1 - t) / 0.25 : 1;
    return p;
  },
  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as PhoenixParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    if (p.type === 'body') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -p.size * 0.9, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffdd00';
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.1);
      ctx.lineTo(p.size * 0.15, -p.size * 1.3);
      ctx.lineTo(-p.size * 0.15, -p.size * 1.3);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'wing') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#ff8800';
      ctx.shadowBlur = 10;
      const wingY = Math.sin(p.wingAngle) * p.size * 0.3;
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.2, 0);
      ctx.quadraticCurveTo(-p.size * 0.8, wingY - p.size * 0.3, -p.size, wingY);
      ctx.quadraticCurveTo(-p.size * 0.6, wingY + p.size * 0.2, -p.size * 0.2, p.size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.size * 0.2, 0);
      ctx.quadraticCurveTo(p.size * 0.8, wingY - p.size * 0.3, p.size, wingY);
      ctx.quadraticCurveTo(p.size * 0.6, wingY + p.size * 0.2, p.size * 0.2, p.size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.moveTo(0, p.size * 0.3);
      ctx.quadraticCurveTo(p.size * 0.15, p.size * 0.8, 0, p.size * 1.2);
      ctx.quadraticCurveTo(-p.size * 0.15, p.size * 0.8, 0, p.size * 0.3);
      ctx.fill();
    } else if (p.type === 'flame') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.quadraticCurveTo(p.size * 0.4, 0, 0, p.size * 0.5);
      ctx.quadraticCurveTo(-p.size * 0.4, 0, 0, -p.size);
      ctx.fill();
    } else {
      ctx.rotate(p.wingAngle);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
