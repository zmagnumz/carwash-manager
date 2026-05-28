import React, { useEffect, useRef, useState } from 'react';

const ITEM_H = 44;
const VISIBLE = 5;

function WheelColumn({ values, value, onChange }) {
  const ref = useRef(null);
  const timerRef = useRef(null);
  const idx = values.indexOf(value);
  const [activeIdx, setActiveIdx] = useState(idx);
  const padded = [null, null, ...values, null, null];

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = idx * ITEM_H;
  }, []); // eslint-disable-line

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    const cur = Math.max(0, Math.min(values.length - 1, Math.round(el.scrollTop / ITEM_H)));
    setActiveIdx(cur);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const fin = Math.max(0, Math.min(values.length - 1, Math.round(el.scrollTop / ITEM_H)));
      onChange(values[fin]);
    }, 120);
  };

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <div
        ref={ref}
        className="wheel-col"
        onScroll={handleScroll}
        style={{ height: ITEM_H * VISIBLE, overflowY: 'scroll', scrollSnapType: 'y mandatory' }}
      >
        {padded.map((v, i) => (
          <div
            key={i}
            style={{
              height: ITEM_H,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              color: v !== null && values[activeIdx] === v ? 'var(--text)' : 'var(--text3)',
              scrollSnapAlign: 'center',
              transition: 'color 0.08s',
              userSelect: 'none',
            }}
          >
            {v !== null ? String(v).padStart(2, '0') : ''}
          </div>
        ))}
      </div>
      {/* 위 페이드 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H * 2, background: 'linear-gradient(to bottom, var(--bg2) 10%, transparent)', pointerEvents: 'none' }} />
      {/* 아래 페이드 */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_H * 2, background: 'linear-gradient(to top, var(--bg2) 10%, transparent)', pointerEvents: 'none' }} />
      {/* 선택 하이라이트 */}
      <div style={{ position: 'absolute', top: '50%', left: 10, right: 10, height: ITEM_H, transform: 'translateY(-50%)', borderTop: '1px solid var(--border2)', borderBottom: '1px solid var(--border2)', borderRadius: 6, pointerEvents: 'none' }} />
    </div>
  );
}

export default function TimeWheelPicker({ hour, minute, onHourChange, onMinuteChange, label }) {
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const MINUTES = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="input-wrap">
      {label && <div className="input-label">{label}</div>}
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg2)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border)', overflow: 'hidden' }}>
        <WheelColumn values={HOURS} value={hour} onChange={onHourChange} />
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text2)', padding: '0 4px', flexShrink: 0 }}>:</div>
        <WheelColumn values={MINUTES} value={minute} onChange={onMinuteChange} />
      </div>
    </div>
  );
}
