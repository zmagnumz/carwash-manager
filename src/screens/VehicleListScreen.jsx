import React from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';

export default function VehicleListScreen() {
  const { data, go, setCurrentVehicle, setCurrentTab } = useApp();

  const select = (i) => {
    setCurrentVehicle(i);
    setCurrentTab('home');
    go('sc-home');
  };

  return (
    <>
      <TopBar
        title="차량"
        left="back"
        right={
          <div style={{ display: 'flex', gap: 2 }}>
            <button className="btn-icon" onClick={() => go('sc-settings')} aria-label="설정">
              <i className="ti ti-settings" />
            </button>
            <button className="btn-icon" onClick={() => go('sc-add-vehicle')} aria-label="추가">
              <i className="ti ti-plus" />
            </button>
          </div>
        }
      />
      <div className="content">
        {data.vehicles.map((v, i) => (
          <div key={i} className="vehicle-card" onClick={() => select(i)}>
            <div className="vehicle-avatar">{v.emoji || '🚗'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{v.nick}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{v.plate}</div>
            </div>
            <i className="ti ti-chevron-right" style={{ fontSize: 16, color: 'var(--text3)' }} />
          </div>
        ))}
        <div className="add-btn-dashed" onClick={() => go('sc-add-vehicle')}>
          <i className="ti ti-plus" style={{ fontSize: 18 }} />
          새 차량 추가
        </div>
      </div>
    </>
  );
}
