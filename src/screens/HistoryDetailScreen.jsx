import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';

function toLocalDate(isoStr) {
  const d = new Date(isoStr);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

export default function HistoryDetailScreen() {
  const { data, saveData, historyEditIndex, back } = useApp();
  const h = historyEditIndex != null ? data.history[historyEditIndex] : null;

  const [preset, setPreset] = useState('');
  const [date, setDate] = useState('');
  const [locName, setLocName] = useState('');
  const [durationMin, setDurationMin] = useState('');
  const [cost, setCost] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (!h) return;
    setPreset(h.preset || '');
    setDate(toLocalDate(h.date));
    setLocName(h.locName || '');
    setDurationMin(String(Math.round((h.duration || 0) / 60)));
    setCost(h.cost > 0 ? String(h.cost) : '');
    setMemo(h.memo || '');
  }, [historyEditIndex]); // eslint-disable-line

  if (!h) return null;

  const vehicle = data.vehicles[h.vid];

  const save = () => {
    const updated = {
      ...h,
      preset: preset.trim() || h.preset,
      date: new Date(date + 'T12:00:00').toISOString(),
      locName: locName.trim(),
      duration: (parseInt(durationMin) || 0) * 60,
      cost: parseInt(cost) || 0,
      memo: memo.trim(),
    };
    saveData({ ...data, history: data.history.map((item, i) => i === historyEditIndex ? updated : item) });
    back();
  };

  const remove = () => {
    if (!window.confirm('이 기록을 삭제할까요?')) return;
    saveData({ ...data, history: data.history.filter((_, i) => i !== historyEditIndex) });
    back();
  };

  const deleteBtn = (
    <button className="btn-icon" onClick={remove} aria-label="삭제">
      <i className="ti ti-trash" style={{ color: 'var(--red)' }} />
    </button>
  );

  return (
    <>
      <TopBar title="세차 기록" left="back" right={deleteBtn} />
      <div className="content">
        {vehicle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 12px', background: 'var(--bg2)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 28 }}>{vehicle.emoji || '🚗'}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{vehicle.plate}</div>
              {vehicle.model && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>{vehicle.model}</div>}
            </div>
          </div>
        )}

        <div className="input-wrap">
          <div className="input-label">날짜</div>
          <input className="input-field" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ textAlign: 'center' }} />
        </div>

        <div className="input-wrap">
          <div className="input-label">프리셋</div>
          <input className="input-field" value={preset} onChange={e => setPreset(e.target.value)} placeholder="프리셋 이름" />
        </div>

        <div className="input-wrap">
          <div className="input-label">세차장</div>
          <input className="input-field" value={locName} onChange={e => setLocName(e.target.value)} placeholder="세차장 이름" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="input-wrap">
            <div className="input-label">소요 시간 (분)</div>
            <input className="input-field" type="number" min="0" value={durationMin} onChange={e => setDurationMin(e.target.value)} style={{ textAlign: 'center' }} />
          </div>
          <div className="input-wrap">
            <div className="input-label">비용 (원)</div>
            <input className="input-field" type="number" min="0" value={cost} onChange={e => setCost(e.target.value)} placeholder="0" style={{ textAlign: 'center' }} />
          </div>
        </div>

        <div className="input-wrap">
          <div className="input-label">메모</div>
          <input className="input-field" value={memo} onChange={e => setMemo(e.target.value)} placeholder="메모..." />
        </div>

        <button className="btn-primary" onClick={save}>저장</button>
      </div>
    </>
  );
}
