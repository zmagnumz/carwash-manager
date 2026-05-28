import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CompleteScreen() {
  const { wash, data, saveData, goHome } = useApp();
  const [memo, setMemo] = useState('');
  const [cost, setCost] = useState('');

  if (!wash?._complete) return null;

  const saveRecord = () => {
    const chemUsage = [];
    wash.preset.steps.forEach((s) => {
      if (s.chemId == null) return;
      const chem = data.chemicals.find(c => c.id === s.chemId);
      if (!chem) return;
    });
    saveData({
      ...data,
      history: [...data.history, {
        vid: wash.vid,
        preset: wash.preset.name,
        date: new Date().toISOString(),
        duration: wash.totalSec,
        locName: wash.locName || '',
        memo: memo.trim(),
        cost: parseInt(cost) || 0,
        chemUsage,
      }],
    });
    goHome();
  };

  return (
    <>
      <div className="topbar">
        <div style={{ width: 32 }} />
        <span className="topbar-title">완료</span>
        <div style={{ width: 32 }} />
      </div>
      <div className="content" style={{ textAlign: 'center' }}>
        <div style={{ height: 24 }} />
        <div className="complete-circle"><i className="ti ti-check" /></div>
        <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 6 }}>세차 완료!</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>{wash.preset.name} 완료!</div>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-lbl">총 소요</div>
            <div className="stat-val">{Math.round(wash.totalSec / 60)}<span style={{ fontSize: 13, color: 'var(--text2)' }}>분</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-lbl">완료 단계</div>
            <div className="stat-val">{wash.doneCount}<span style={{ fontSize: 13, color: 'var(--text2)' }}>개</span></div>
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div className="input-wrap">
            <div className="input-label">메모</div>
            <input className="input-field" value={memo} onChange={e => setMemo(e.target.value)} placeholder="오늘 세차 메모..." />
          </div>
          <div className="input-wrap">
            <div className="input-label">비용 (원)</div>
            <input className="input-field" type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="0" />
          </div>
        </div>
        <button className="btn-primary" onClick={saveRecord}>기록 저장</button>
        <button className="btn-secondary" style={{ marginTop: 10 }} onClick={goHome}>저장 없이 홈으로</button>
      </div>
    </>
  );
}
