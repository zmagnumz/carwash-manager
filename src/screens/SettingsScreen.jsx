import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';

const ZOOM_OPTIONS = [
  { value: 'md', label: '보통' },
  { value: 'lg', label: '크게' },
  { value: 'xl', label: '더크게' },
];

export default function SettingsScreen() {
  const { data, saveData } = useApp();
  const settings = data.settings || {};

  const [locName, setLocName] = useState(settings.defaultLoc?.name || '');
  const [locAddr, setLocAddr] = useState(settings.defaultLoc?.addr || '');
  const [zoom, setZoom] = useState(settings.zoom || 'md');

  const save = () => {
    saveData({
      ...data,
      settings: { ...settings, zoom, defaultLoc: { name: locName.trim(), addr: locAddr.trim() } },
    });
  };

  return (
    <>
      <TopBar title="설정" left="back" />
      <div className="content">
        <div className="section-title">기본 세차장</div>
        <div className="input-wrap">
          <div className="input-label">세차장 이름</div>
          <input
            className="input-field"
            value={locName}
            onChange={e => setLocName(e.target.value)}
            placeholder="예: 워시존개러지 김포IC"
          />
        </div>
        <div className="input-wrap">
          <div className="input-label">주소</div>
          <input
            className="input-field"
            value={locAddr}
            onChange={e => setLocAddr(e.target.value)}
            placeholder="예: 경기도 김포시 고촌읍 김포대로451번길 10"
          />
        </div>

        <div className="divider" />
        <div className="section-title">텍스트 크기</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {ZOOM_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setZoom(opt.value)}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 'var(--radius-lg)',
                border: zoom === opt.value ? '2px solid var(--blue)' : '0.5px solid var(--border2)',
                background: zoom === opt.value ? 'var(--blue-light)' : 'var(--bg)',
                color: zoom === opt.value ? 'var(--blue-dark)' : 'var(--text2)',
                fontWeight: zoom === opt.value ? 700 : 400,
                fontSize: opt.value === 'md' ? 14 : opt.value === 'lg' ? 16 : 18,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 24 }}>
          변경 즉시 전체 화면에 적용됩니다.
        </div>

        <button className="btn-primary" onClick={save}>저장</button>
      </div>
    </>
  );
}
