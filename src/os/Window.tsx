import { useRef, type PointerEvent, type ReactNode } from 'react';
import type { AppDef, Win } from './types';

type Props = {
  win: Win;
  def: AppDef;
  active: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
};

export function Window({ win, def, active, onFocus, onClose, onMinimize, onToggleMax, onMove, children }: Props) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (win.max || (e.target as HTMLElement).closest('button')) return;
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const x = Math.min(window.innerWidth - 80, Math.max(-win.w + 120, e.clientX - drag.current.dx));
    const y = Math.min(window.innerHeight - 90, Math.max(0, e.clientY - drag.current.dy));
    onMove(x, y);
  };
  const up = () => (drag.current = null);

  return (
    <section
      className={`window${active ? ' active' : ''}${win.max ? ' max' : ''}`}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z, display: win.min ? 'none' : undefined }}
      onPointerDown={onFocus}
      aria-label={def.title}
      role="dialog"
    >
      <div
        className="titlebar"
        style={{ '--title-bg': def.color } as React.CSSProperties}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onDoubleClick={onToggleMax}
      >
        <span className="title">
          <span aria-hidden="true">{def.icon}</span> {def.title}
        </span>
        <span className="controls">
          <button onClick={onMinimize} aria-label="Minimize" title="Minimize">
            _
          </button>
          <button className="max-btn" onClick={onToggleMax} aria-label={win.max ? 'Restore' : 'Maximize'} title="Maximize">
            □
          </button>
          <button onClick={onClose} aria-label="Close" title="Close">
            ×
          </button>
        </span>
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
}
