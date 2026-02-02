/**
 * Network エフェクト
 * ノード + 接続線 + 浮遊
 * 用途: テクノロジー、接続
 */

import type { Particle, Effect, EffectOptions } from '../types';
import { generateId, random } from '../utils';
import { drawCircle, drawLine } from '../core';

// カラーパレット
const DEFAULT_COLORS = ['#667eea', '#764ba2', '#00d4ff'];

interface NodeParticle extends Particle {
  type: 'node';
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  floatSpeed: number;
  floatAmount: number;
  floatY: number;
}

interface LineParticle extends Particle {
  type: 'line';
  node1: NodeParticle;
  node2: NodeParticle;
  color: string;
}

type NetworkParticle = NodeParticle | LineParticle;

export const networkEffect: Effect = {
  config: {
    name: 'network',
    description: 'ノード + 接続線 + 浮遊',
    colors: DEFAULT_COLORS,
    intensity: 1,
    durationScale: 1,
  },

  create(x: number, y: number, options: EffectOptions = {}): Particle[] {
    const intensity = options.intensity ?? 1;
    const colors = options.colors ?? DEFAULT_COLORS;
    const color = typeof options.color === 'string' ? options.color : colors[0];
    const particles: NetworkParticle[] = [];

    // ノード
    const nodeCount = Math.floor(12 * intensity);
    const nodes: NodeParticle[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = random(0, Math.PI * 2);
      const distance = random(30, 100);
      const node: NodeParticle = {
        id: generateId(),
        type: 'node',
        x,
        y,
        progress: 0,
        maxProgress: 100,
        delay: random(0, 20),
        alpha: 0,
        targetX: x + Math.cos(angle) * distance,
        targetY: y + Math.sin(angle) * distance,
        size: random(3, 6),
        color,
        floatSpeed: random(0.02, 0.05),
        floatAmount: random(5, 15),
        floatY: 0,
      };
      nodes.push(node);
      particles.push(node);
    }

    // 接続線（近いノード同士を接続）
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].targetX - nodes[i].targetX;
        const dy = nodes[j].targetY - nodes[i].targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          particles.push({
            id: generateId(),
            type: 'line',
            x,
            y,
            progress: 0,
            maxProgress: 100,
            delay: Math.max(nodes[i].delay ?? 0, nodes[j].delay ?? 0) + 10,
            alpha: 0,
            node1: nodes[i],
            node2: nodes[j],
            color,
          });
        }
      }
    }

    return particles;
  },

  update(particle: Particle, deltaTime: number): Particle | null {
    const p = particle as NetworkParticle;
    const delayFrames = p.delay ?? 0;
    p.progress += deltaTime;

    if (p.progress < delayFrames * deltaTime) {
      return p;
    }

    const effectiveProgress = p.progress - delayFrames * deltaTime;
    const t = effectiveProgress / p.maxProgress;

    if (t >= 1) return null;

    switch (p.type) {
      case 'node':
        p.alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;
        p.floatY = Math.sin(effectiveProgress * p.floatSpeed) * p.floatAmount;
        break;

      case 'line':
        p.alpha = t < 0.2 ? (t / 0.2) * 0.3 : t > 0.8 ? ((1 - (t - 0.8) / 0.2) * 0.3) : 0.3;
        break;
    }

    return p;
  },

  draw(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const p = particle as NetworkParticle;
    ctx.save();
    ctx.globalAlpha = p.alpha;

    switch (p.type) {
      case 'node':
        // グロー効果
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        drawCircle(
          ctx,
          p.targetX,
          p.targetY + p.floatY,
          p.size,
          p.color,
          p.alpha
        );
        break;

      case 'line':
        drawLine(
          ctx,
          p.node1.targetX,
          p.node1.targetY + (p.node1.floatY || 0),
          p.node2.targetX,
          p.node2.targetY + (p.node2.floatY || 0),
          p.color,
          1,
          p.alpha
        );
        break;
    }

    ctx.restore();
  },
};
