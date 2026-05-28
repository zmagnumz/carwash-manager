import { useRef } from 'react';

export function useAudio() {
  const actxRef = useRef(null);

  const getAC = () => {
    if (!actxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      actxRef.current = new AudioCtx();
    }
    return actxRef.current;
  };

  const beep = (freq, dur, times, gap) => {
    const ac = getAC();
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.connect(g);
        g.connect(ac.destination);
        o.frequency.value = freq;
        o.type = 'sine';
        g.gain.setValueAtTime(0.4, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
        o.start(ac.currentTime);
        o.stop(ac.currentTime + dur);
      }, i * (dur * 1000 + gap));
    }
  };

  const alarm5 = () => {
    const ac = getAC();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g);
    g.connect(ac.destination);
    o.frequency.value = 1000;
    o.type = 'sine';
    g.gain.setValueAtTime(0.5, ac.currentTime);
    g.gain.linearRampToValueAtTime(0, ac.currentTime + 5);
    o.start(ac.currentTime);
    o.stop(ac.currentTime + 5);
  };

  return { beep, alarm5 };
}
