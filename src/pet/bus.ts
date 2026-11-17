// A tiny event bus so any window can make the pet (or the confetti) react.

export type PetEvent =
  | { type: 'open'; app: string; line?: string }
  | { type: 'close'; app: string }
  | { type: 'celebrate'; line?: string }
  | { type: 'say'; line: string };

type Listener<T> = (e: T) => void;

function makeBus<T>() {
  const listeners = new Set<Listener<T>>();
  return {
    emit: (e: T) => listeners.forEach((l) => l(e)),
    on: (l: Listener<T>) => {
      listeners.add(l);
      return () => void listeners.delete(l);
    },
  };
}

export const petBus = makeBus<PetEvent>();
/** Confetti bursts, in viewport pixels. */
export const confettiBus = makeBus<{ x: number; y: number }>();

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
