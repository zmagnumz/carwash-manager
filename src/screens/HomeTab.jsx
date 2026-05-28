import React from 'react';
import { useApp } from '../context/AppContext';

export default function HomeTab() {
  const { data, currentVehicle, go, setHistoryEditIndex } = useApp();
  const v = data.vehicles[currentVehicle];
  if (!v) return null;

  const vHist = data.history.filter(h => h.vid === currentVehicle);
  const now = new Date();
  const mc = vHist.filter(h => {
    const d = new Date(h.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  let daysStr = '없음';
  let lastPreset = '';
  if (vHist.length > 0) {
    const last = vHist[vHist.length - 1];
    const days = Math.floor((Date.now() - new Date(last.date).getTime()) / 86400000);
    daysStr = days === 0 ? '오늘' : days + '일 전';
    lastPreset = last.preset;
  }

  const recent = vHist.slice(-3).reverse();

  return (
    <>
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 44 }}>{v.emoji || '🚗'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{v.plate}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{v.model || ''}</div>
            {lastPreset && (
              <div style={{ marginTop: 8 }}>
                <span className="badge badge-blue">{lastPreset}</span>
              </div>
            )}
          </div>
          <button className="btn-icon" onClick={() => go('sc-vehicle')} aria-label="차량 변경" style={{ alignSelf: 'flex-start' }}>
            <i className="ti ti-selector" />
          </button>
        </div>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-lbl">이번 달 세차</div>
          <div className="stat-val">{mc}<span style={{ fontSize: 13, color: 'var(--text2)' }}>회</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">마지막 세차</div>
          <div className="stat-val" style={{ fontSize: 15 }}>{daysStr}</div>
        </div>
      </div>
      <button className="btn-primary" style={{ marginBottom: 20 }} onClick={() => go('sc-plan')}>
        <i className="ti ti-player-play" style={{ marginRight: 6, fontSize: 15, verticalAlign: -2 }} />
        세차 계획 시작
      </button>
      <div className="section-title">최근 기록</div>
      {recent.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--text3)', padding: '10px 0' }}>세차 기록이 없습니다</div>
      ) : recent.map((h, i) => (
        <div
          key={i}
          className="history-item"
          style={{ cursor: 'pointer' }}
          onClick={() => { setHistoryEditIndex(data.history.indexOf(h)); go('sc-history-detail'); }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{h.preset}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>
              {new Date(h.date).toLocaleDateString('ko-KR')}{h.locName ? ' · ' + h.locName : ''}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontFamily: "'Courier New',monospace", color: 'var(--text2)' }}>{Math.round(h.duration / 60)}분</span>
            <i className="ti ti-chevron-right" style={{ fontSize: 13, color: 'var(--text3)' }} />
          </div>
        </div>
      ))}
    </>
  );
}
