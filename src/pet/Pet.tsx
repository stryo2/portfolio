// The desktop pet: a cat or raccoon that wanders along the top of the taskbar and reacts to the windows you open.
import { useCallback, useEffect, useRef, useState } from 'react';
import { PETS, composeFrame, drawGrid, type Emotion, type Species } from './sprites';
import { confettiBus, petBus, reducedMotion } from './bus';

type Action = 'idle' | 'walk' | 'sit' | 'groom' | 'sleep' | 'stretch' | 'hide' | 'return' | 'celebrate';

const SCALE = 3;
const WALK_SPEED = 55; // px per second
const HIDE_SPEED = 120;

const WEIGHTS: [Action, number][] = [
  ['walk', 30],
  ['idle', 15],
  ['sit', 20],
  ['groom', 10],
  ['stretch', 6],
  ['sleep', 5],
];
const DURATION: Partial<Record<Action, [number, number]>> = {
  idle: [2000, 4000],
  sit: [3000, 6000],
  groom: [2000, 4000],
  stretch: [1200, 1800],
  sleep: [6000, 10000],
};
const ANIM: Record<Action, string> = {
  idle: 'idle',
  walk: 'walk',
  sit: 'sit',
  groom: 'groom',
  sleep: 'sleep',
  stretch: 'stretch',
  hide: 'walk',
  return: 'walk',
  celebrate: 'idle',
};

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
const between = ([a, b]: [number, number]) => a + Math.random() * (b - a);

export function Pet({ species }: { species: Species }) {
  const laneRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bubble, setBubble] = useState<string | null>(null);
  const bubbleTimer = useRef(0);
  const speciesRef = useRef(species);
  speciesRef.current = species;

  const st = useRef({
    action: 'walk' as Action,
    x: 24,
    dir: 1,
    target: 260,
    until: 0,
    emotion: 'neutral' as Emotion,
    emotionUntil: 0,
    jumpT: 0,
    nextBlink: 0,
    blinkUntil: 0,
  });

  const say = useCallback((text: string, ms = 3200) => {
    setBubble(text);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  }, []);

  const feel = (emotion: Emotion, ms = 2500) => {
    st.current.emotion = emotion;
    st.current.emotionUntil = performance.now() + ms;
  };

  const laneWidth = () => laneRef.current?.clientWidth ?? 800;

  const celebrate = useCallback(() => {
    const s = st.current;
    if (s.action === 'hide') return;
    s.action = 'celebrate';
    s.until = performance.now() + 1700;
    s.jumpT = 0;
    feel('happy', 2500);
    const r = boxRef.current?.getBoundingClientRect();
    if (r && !reducedMotion()) confettiBus.emit({ x: r.left + r.width / 2, y: r.top });
  }, []);

  // React to windows opening and closing.
  useEffect(
    () =>
      petBus.on((e) => {
        const s = st.current;
        const now = performance.now();
        if (e.type === 'say') return say(e.line);
        if (e.type === 'celebrate') {
          celebrate();
          if (e.line) say(e.line);
          return;
        }
        if (e.type === 'close') {
          if (e.app === 'project:hexpush' && s.action === 'hide') {
            s.action = 'return';
            s.x = laneWidth() + 10;
            s.target = laneWidth() * 0.6;
            s.until = now + 30000;
            say('is it over? 😺');
          }
          return;
        }
        // open
        if (e.app === 'project:hexpush') {
          s.action = 'hide';
          s.until = Infinity;
          feel('surprised', 1500);
          if (e.line) say(e.line, 2400);
          return;
        }
        if (s.action === 'hide') return;
        if (e.app === 'contact') {
          celebrate();
          say(e.line ?? 'say hi! 👋');
          return;
        }
        if (s.action === 'sleep') feel('yawn', 1200);
        else feel(e.app === 'about' ? 'love' : 'happy', 3000);
        if (s.action !== 'celebrate') {
          s.action = 'sit';
          s.until = now + 3500;
        }
        if (e.line) say(e.line);
      }),
    [say, celebrate],
  );

  // The brain and the renderer, one requestAnimationFrame loop.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const choose = (now: number, maxX: number) => {
      const s = st.current;
      const weights = reducedMotion() ? WEIGHTS.filter(([a]) => a !== 'walk') : WEIGHTS;
      let r = Math.random() * weights.reduce((t, [, w]) => t + w, 0);
      let next: Action = 'idle';
      for (const [a, w] of weights) if ((r -= w) <= 0) { next = a; break; }
      s.action = next;
      if (next === 'walk') {
        s.target = Math.random() * maxX;
        s.until = now + 30000;
      } else {
        s.until = now + between(DURATION[next] ?? [2000, 3000]);
      }
    };

    const tick = (now: number) => {
      // Capped so a backgrounded tab doesn't teleport the pet, but loose enough for slow devices.
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const s = st.current;
      const pet = PETS[speciesRef.current];
      const petW = pet.width * SCALE;
      const laneW = laneWidth();
      const maxX = Math.max(0, laneW - petW);

      if (s.action !== 'hide' && now > s.until) choose(now, maxX);

      let oy = 0;
      if (s.action === 'walk' || s.action === 'return') {
        const d = s.target - s.x;
        if (Math.abs(d) < 2) {
          s.action = 'sit';
          s.until = now + between([2500, 5000]);
        } else {
          s.dir = Math.sign(d);
          s.x += s.dir * Math.min(Math.abs(d), WALK_SPEED * dt);
        }
      } else if (s.action === 'hide') {
        const goal = laneW + 20;
        if (s.x < goal) {
          s.dir = 1;
          s.x = Math.min(goal, s.x + HIDE_SPEED * dt);
        }
      } else if (s.action === 'celebrate') {
        s.jumpT += dt;
        oy = -Math.abs(Math.sin(s.jumpT * 7)) * 16;
      }
      if (s.action !== 'hide' && s.action !== 'return') s.x = Math.min(Math.max(0, s.x), maxX);

      // Face: a held emotion, else sleepy or neutral with the odd blink.
      let emo: Emotion = now < s.emotionUntil ? s.emotion : s.action === 'sleep' ? 'sleepy' : 'neutral';
      if (emo === 'neutral') {
        if (now > s.nextBlink) {
          s.blinkUntil = now + 140;
          s.nextBlink = now + 2500 + Math.random() * 3000;
        }
        if (now < s.blinkUntil) emo = 'blink';
      }

      let animName = ANIM[s.action];
      if ((s.action === 'hide' || s.action === 'return') && pet.animations.sneak) animName = 'sneak';
      const anim = pet.animations[animName] ?? pet.animations.idle;
      const frame = anim.frames[Math.floor((now / 1000) * anim.fps) % anim.frames.length];

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        if (canvas.width !== petW) canvas.width = petW;
        if (canvas.height !== pet.height * SCALE) canvas.height = pet.height * SCALE;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, composeFrame(pet, frame, emo), SCALE, s.dir < 0);
      }
      if (boxRef.current) boxRef.current.style.transform = `translate(${s.x}px, ${oy}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPet = () => {
    const s = st.current;
    if (s.action === 'sleep') {
      feel('yawn', 1500);
      say(pick(['…5 more minutes', 'mrrp?!', '*yawn*']));
      return;
    }
    feel('love', 2200);
    s.action = 'sit';
    s.until = performance.now() + 3000;
    say(pick(['purr~', 'so much love!', 'purrrrr', 'hehe']));
  };

  const name = PETS[species].name.toLowerCase();
  return (
    <div className="pet-lane" ref={laneRef}>
      <button
        ref={boxRef}
        className="pet"
        onClick={onPet}
        aria-label={`Pet the ${name}`}
        title={`Pet the ${name}`}
      >
        {bubble && (
          <span className="pet-bubble" role="status">
            {bubble}
          </span>
        )}
        <canvas ref={canvasRef} />
      </button>
    </div>
  );
}
