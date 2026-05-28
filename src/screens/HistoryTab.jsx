import React from 'react';
import { useApp } from '../context/AppContext';

export default function HistoryTab() {
  const { data, currentVehicle } = useApp();
  const vHist = data.history.filter(h => h.vid === currentVehicle).reverse();

  if (vHist.length === 0) {
    return <div style={{ fontSize: 13, color: 'var(--text3)', padding: '20px 0', textAlign: 'center' }}>기록이 없습니다</div>;
  }

  return (
    <>
      {vHist.map((h, i) => (
        <div key={i} className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{h.preset}</div>
            <span className="badge badge-gray">{Math.round(h.duration / 60)}분</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            {new Date(h.date).toLocaleDateString('ko-KR')}{h.locName ? ' · ' + h.locName : ''}
          </div>
          {h.memo && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{h.memo}</div>}
          {h.cost > 0 && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{h.cost.toLocaleString()}원</div>}
        </div>
      ))}
    </>
  );
}
