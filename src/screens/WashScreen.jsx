import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/format';
import { useAudio } from '../hooks/useAudio';

export default function WashScreen() {
  const { wash, setWash, go } = useApp();
  const { beep, alarm5 } = useAudio();
  const [, forceUpdate] = useState(0);
  const wRef = useRef(null);
  const intervalRef = useRef(null);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (!wash) return;
    wRef.current = { ...wash };
    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const w = wRef.current;
      if (!w || w.paused) return;
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (w.garageTotal > 0) {
        w.garageRemain = Math.max(0, w.garageRemain - delta);
        const rem = Math.round(w.garageRemain);
        if (rem <= 600 && !w.garageAlarm10) { w.garageAlarm10 = true; beep(880, 0.3, 1, 0); }
        if (rem <= 300 && rem > 0 && !w.garageAlarm5) { w.garageAlarm5 = true; beep(880, 0.2, 2, 200); }
        if (rem <= 0 && !w.garageAlarmDone) { w.garageAlarmDone = true; alarm5(); }
      }

      const st = w.stepT[w.curStep];
      if (st && st.running) {
        st.elapsed += delta;
        const rec = w.preset.steps[w.curStep].min * 60;
        if (!st.warned1 && st.elapsed >= rec - 60) { st.warned1 = true; beep(880, 0.3, 1, 0); }
        if (!st.warned2 && st.elapsed >= rec) { st.warned2 = true; beep(880, 0.2, 2, 200); st.over = true; }
      }
      forceUpdate(n => n + 1);
    }, 500);

    return () => clearInterval(intervalRef.current);
  }, [wash]);

  const togglePause = () => {
    wRef.current.paused = !wRef.current.paused;
    lastTickRef.current = Date.now();
    forceUpdate(n => n + 1);
  };

  const completeStep = (i) => {
    const w = wRef.current;
    if (i !== w.curStep) return;
    w.stepT[i].running = false;
    beep(880, 0.15, 1, 0);
    if (i + 1 < w.preset.steps.length) {
      w.curStep = i + 1;
      w.stepT[i + 1].running = true;
      forceUpdate(n => n + 1);
    } else {
      clearInterval(intervalRef.current);
      const totalSec = Math.round((Date.now() - w.start) / 1000);
      const done = w.stepT.filter(t => t.elapsed > 0).length;
      alarm5();
      setWash({ ...w, _complete: true, totalSec, doneCount: done });
      go('sc-complete');
    }
  };

  const confirmStop = () => {
    if (window.confirm('세차를 중단할까요?')) {
      clearInterval(intervalRef.current);
      go('sc-home');
    }
  };

  const w = wRef.current;
  if (!w) return null;

  const stepT = w.stepT;
  const total = w.preset.steps.length;
  const done = stepT.filter(t => !t.running && t.elapsed > 0).length;
  const pct = Math.round(done / total * 100);
  const rem = Math.round(w.garageRemain);
  const garageCls = rem > 300 ? 'normal' : rem > 0 ? 'warn' : 'danger';

  return (
    <>
      <div className="topbar">
        <button className="btn-icon" onClick={confirmStop} aria-label="중단"><i className="ti ti-x" /></button>
        <span className="topbar-title">{w.preset.name}</span>
        <button className="btn-icon" onClick={togglePause} aria-label="일시정지">
          <i className={`ti ${w.paused ? 'ti-player-play' : 'ti-player-pause'}`} />
        </button>
      </div>
      <div className="content">
        {w.startOffset != null && Math.abs(w.startOffset) >= 60 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, fontWeight: 600, padding: '5px 10px',
            borderRadius: 20, marginBottom: 10,
            background: w.startOffset > 0 ? 'var(--red-light)' : 'var(--blue-light)',
            color: w.startOffset > 0 ? 'var(--red-dark)' : 'var(--blue-dark)',
          }}>
            <i className={`ti ${w.startOffset > 0 ? 'ti-clock-exclamation' : 'ti-clock'}`} style={{ fontSize: 13 }} />
            {w.startOffset > 0
              ? `${Math.round(w.startOffset / 60)}분 지각`
              : `세차 시작 ${Math.round(-w.startOffset / 60)}분 전`}
          </div>
        )}
        {w.garageTotal > 0 && (
          <div className={`garage-banner ${garageCls}`} style={{ marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>{w.locName || '개러지'}</div>
              <div className={`g-time ${garageCls}`}>
                {rem > 0 ? fmt(w.garageRemain) : '+' + fmt(-w.garageRemain)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>잔여시간</div>
            </div>
            <i className="ti ti-building" style={{ fontSize: 24, color: 'var(--text3)' }} />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <StepTimelineBar steps={w.preset.steps} stepT={stepT} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>
            <span>{done} / {total} 단계</span>
            <span>{pct}%</span>
          </div>
        </div>
        {w.preset.steps.map((s, i) => {
          const t = stepT[i];
          const isDone = !t.running && t.elapsed > 0;
          const isActive = t.running;
          const isNext = !isDone && !isActive && i === w.curStep + 1;
          const isOver = t.over && t.running;
          const rec = s.min * 60;
          let timerStr = '—';
          let timerCls = 'step-timer-txt';
          if (isDone) { timerStr = '완료'; timerCls = 'step-timer-txt done'; }
          else if (isActive) { timerStr = isOver ? '+' + fmt(t.elapsed - rec) : fmt(rec - t.elapsed); timerCls = 'step-timer-txt ' + (isOver ? 'over' : 'active'); }
          const checkCls = 'step-check' + (isDone ? ' done' : isActive && isOver ? ' over' : isActive ? ' active' : '');
          const nameCls = 'step-name-txt' + (!isDone && !isActive && !isNext ? ' inactive' : '') + (isOver ? ' over' : '');
          return (
            <div key={i} className="step-row" style={isActive && isOver ? { background: 'var(--red-light)', borderRadius: 'var(--radius)', padding: '0 4px', margin: '0 -4px' } : {}}>
              <div className="step-main">
                <div className={checkCls} onClick={() => completeStep(i)}>
                  {isDone && <i className="ti ti-check" style={{ fontSize: 13 }} />}
                  {isActive && !isDone && <i className="ti ti-player-play" style={{ fontSize: 11 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div className={nameCls}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>권장 {s.min}분</div>
                </div>
                <div className={timerCls}>{timerStr}</div>
              </div>
              {(isActive || isNext) && s.chemId != null && <ChemPanel step={s} idx={i} isActive={isActive} isNext={isNext} isOver={isOver} chemicals={w.preset.chemicals || []} />}
            </div>
          );
        })}
        <div style={{ height: 16 }} />
      </div>
    </>
  );
}

function StepTimelineBar({ steps, stepT }) {
  return (
    <div style={{ display: 'flex', gap: 3, height: 10 }}>
      {steps.map((s, i) => {
        const t = stepT[i];
        const isDone = !t.running && t.elapsed > 0;
        const isActive = t.running;
        const rec = s.min * 60;
        const remaining = isActive ? Math.max(0, rec - t.elapsed) : 0;
        const fillPct = isDone ? 0 : isActive ? (remaining / rec) * 100 : 100;
        const isLow = isActive && remaining < rec / 3;
        const fillColor = isDone ? 'transparent'
          : isLow ? 'var(--red)'
          : isActive ? 'var(--blue)'
          : 'var(--blue-mid)';
        const trackColor = isDone ? 'var(--bg3)' : 'var(--bg3)';

        return (
          <div
            key={i}
            style={{
              flex: s.min,
              background: trackColor,
              borderRadius: 5,
              overflow: 'hidden',
              position: 'relative',
              height: '100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 0, top: 0, bottom: 0,
                width: fillPct + '%',
                background: fillColor,
                borderRadius: 5,
                transition: 'background-color 0.6s ease',
              }}
            />
            {isDone && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--text3)',
                opacity: 0.35,
                borderRadius: 5,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChemPanel({ step, idx, isActive, isNext, isOver, chemicals }) {
  const { data } = useApp();
  const [calcC, setCalcC] = useState('');
  const [calcW, setCalcW] = useState('');
  const chem = data.chemicals.find(c => c.id === step.chemId);
  if (!chem) return null;
  const cls = 'chem-panel' + (isNext ? ' next' : isOver ? ' over' : '');
  const handleC = (v) => { setCalcC(v); const c = parseFloat(v); if (!isNaN(c)) setCalcW(String(Math.round(c * (chem.dw / chem.dr)))); };
  const handleW = (v) => { setCalcW(v); const w = parseFloat(v); if (!isNaN(w) && chem.dw !== 0) setCalcC(String(Math.round(w / (chem.dw / chem.dr)))); };
  const total = () => { const c = parseFloat(calcC), w = parseFloat(calcW); return (!isNaN(c) && !isNaN(w)) ? '총 ' + (c + w) + 'ml' : ''; };
  return (
    <div className={cls}>
      <div className="chem-row">
        <span className="chem-label-txt">{isNext ? '다음 준비' : '사용 중'}</span>
        <span className={`badge ${isNext ? 'badge-gray' : 'badge-blue'}`}>{chem.category}</span>
      </div>
      <div className="chem-row"><span className="chem-label-txt">브랜드</span><span className="chem-val">{chem.brand}</span></div>
      <div className="chem-row"><span className="chem-label-txt">제품</span><span className="chem-val">{chem.product}</span></div>
      <div className="chem-row"><span className="chem-label-txt">희석비</span><span className="chem-val">{chem.dr} : {chem.dw}</span></div>
      {chem.memo && <div className="chem-row"><span className="chem-label-txt">메모</span><span className="chem-val" style={{ fontSize: 12 }}>{chem.memo}</span></div>}
      {isActive && (
        <>
          <div className="dil-calc">
            <div className="dil-input-wrap"><div className="dil-label">케미컬 (ml)</div><input className="dil-input" type="number" placeholder="50" value={calcC} onChange={e => handleC(e.target.value)} /></div>
            <div className="dil-input-wrap"><div className="dil-label">물 (ml)</div><input className="dil-input" type="number" placeholder={50 * chem.dw} value={calcW} onChange={e => handleW(e.target.value)} /></div>
          </div>
          <div className="dil-total">{total()}</div>
        </>
      )}
    </div>
  );
}
