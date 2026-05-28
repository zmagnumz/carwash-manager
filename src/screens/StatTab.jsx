import React from 'react';
import { useApp } from '../context/AppContext';
import { fmtVol } from '../utils/format';

export default function StatTab() {
  const { data, currentVehicle } = useApp();
  const vHist = data.history.filter(h => h.vid === currentVehicle);

  const totalWash = vHist.length;
  const totalMin = vHist.reduce((a, h) => a + Math.round(h.duration / 60), 0);
  const totalCost = vHist.reduce((a, h) => a + (h.cost || 0), 0);

  const chemUsage = {};
  vHist.forEach(h => {
    if (h.chemUsage) h.chemUsage.forEach(u => {
      const k = u.brand + ' ' + u.product;
      chemUsage[k] = (chemUsage[k] || 0) + u.ml;
    });
  });
  const ranked = Object.entries(chemUsage).sort((a, b) => b[1] - a[1]);
  const maxVol = ranked.length > 0 ? ranked[0][1] : 1;

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-lbl">총 세차 횟수</div>
          <div className="stat-val">{totalWash}<span style={{ fontSize: 13, color: 'var(--text2)' }}>회</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">총 소요 시간</div>
          <div className="stat-val">{totalMin}<span style={{ fontSize: 13, color: 'var(--text2)' }}>분</span></div>
        </div>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-lbl">총 비용</div>
          <div className="stat-val" style={{ fontSize: 15 }}>{totalCost.toLocaleString()}<span style={{ fontSize: 11, color: 'var(--text2)' }}>원</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">평균 소요</div>
          <div className="stat-val">{totalWash > 0 ? Math.round(totalMin / totalWash) : 0}<span style={{ fontSize: 13, color: 'var(--text2)' }}>분</span></div>
        </div>
      </div>
      <div className="section-title" style={{ marginTop: 4 }}>케미컬 사용량 랭킹</div>
      <div className="card">
        {ranked.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--text3)', padding: '10px 0' }}>사용 데이터 없음</div>
        ) : ranked.map(([name, vol], i) => (
          <div key={i} className="rank-row">
            <div className="rank-num">{i + 1}</div>
            <div className="rank-bar-wrap">
              <div className="rank-name">{name}</div>
              <div className="rank-bar">
                <div className="rank-fill" style={{ width: Math.round(vol / maxVol * 100) + '%' }} />
              </div>
            </div>
            <div className="rank-vol">{fmtVol(vol)}</div>
          </div>
        ))}
      </div>
    </>
  );
}
