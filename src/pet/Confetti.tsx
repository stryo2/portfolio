import { useEffect, useState } from 'react';
import { confettiBus } from './bus';

const COLORS = ['#f2a65a', '#f78fa7', '#6cc4f5', '#ffd166', '#9be29b', '#c7a6ff'];

type Piece = { id: number; x: number; y: number; dx: number; dy: number; rot: number; color: string };

let nextId = 0;

/** Pixel confetti that bursts from a point and falls. */
export function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  useEffect(
    () =>
      confettiBus.on(({ x, y }) => {
        const burst = Array.from({ length: 36 }, () => {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
          const speed = 90 + Math.random() * 160;
          return {
            id: nextId++,
            x,
            y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            rot: (Math.random() - 0.5) * 720,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          };
        });
        setPieces((p) => [...p, ...burst]);
        const ids = new Set(burst.map((b) => b.id));
        window.setTimeout(() => setPieces((p) => p.filter((q) => !ids.has(q.id))), 1600);
      }),
    [],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <i
          key={p.id}
          style={
            {
              left: p.x,
              top: p.y,
              background: p.color,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
