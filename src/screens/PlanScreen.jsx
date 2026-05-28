import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import AutocompleteInput from '../components/AutocompleteInput';
import { PRESETS } from '../data/presets';

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function PlanScreen() {
  const { data, saveData, currentVehicle, go, setWash } = useApp();

  const now = new Date();
  const end = new Date(now.getTime() + 7200000);

  const [locName, setLocName] = useState(data.settings?.defaultLoc?.name || '');
  const [locAddr, setLocAddr] = useState(data.settings?.defaultLoc?.addr || '');
  const [date, setDate] = useState(todayStr);
  const [startH, setStartH] = useState(now.getHours());
  const [startM, setStartM] = useState(now.getMinutes());
  const [endH, setEndH] = useState(end.getHours());
  const [endM, setEndM] = useState(end.getMinutes());
  const [selectedId, setSelectedId] = useState(null);

  const durMin = (endH * 60 + endM) - (startH * 60 + startM);

  const allPresets = [
    ...PRESETS.map(p => data.bPresets?.[p.id] ? { ...p, ...data.bPresets[p.id] } : p),
    ...data.cPresets.map((p, i) => ({ ...p, id: 'c' + i, isCustom: true })),
  ];
  const defId = data.defaultPreset;
  const sorted = [...allPresets.filter(p => p.id === defId), ...allPresets.filter(p => p.id !== defId)];
  const locSuggestions = data.locations.map(l => ({ label: l.name, sub: l.addr, addr: l.addr }));

  const start = () => {
    if (!selectedId) return;
    const preset = allPresets.find(p => p.id === selectedId);
    if (!preset) return;
    if (locName.trim() && !data.locations.find(l => l.name === locName.trim())) {
      saveData({ ...data, locations: [...data.locations, { name: locName.trim(), addr: locAddr.trim() }] });
    }
    const now = Date.now();
    const scheduledStart = new Date(`${date}T${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')}:00`).getTime();
    const scheduledEnd   = new Date(`${date}T${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}:00`).getTime();
    const startOffset = Math.round((now - scheduledStart) / 1000); // 양수=지각, 음수=일찍
    const garageTotal = Math.max(0, durMin * 60);
    const garageRemain = garageTotal > 0 ? Math.max(0, (scheduledEnd - now) / 1000) : 0;
    setWash({
      vid: currentVehicle,
      preset,
      locName: locName.trim(),
      garageTotal,
      garageRemain,
      startOffset,
      start: now,
      stepT: preset.steps.map((_, i) => ({ elapsed: 0, running: i === 0, over: false, warned1: false, warned2: false })),
      curStep: 0,
      paused: false,
      garageAlarm10: false,
      garageAlarm5: false,
      garageAlarmDone: false,
    });
    go('sc-wash');
  };

  const toggleDefault = (id) => {
    saveData({ ...data, defaultPreset: data.defaultPreset === id ? null : id });
  };

  return (
    <>
      <TopBar title="세차 계획" left="back" />
      <div className="content">
        <div className="section-title">세차장</div>
        <AutocompleteInput
          label="세차장 이름"
          value={locName}
          onChange={setLocName}
          placeholder="예: 워시킹 강남점"
          suggestions={locSuggestions}
          onSelect={item => { setLocName(item.label); setLocAddr(item.addr); }}
        />
        <div className="input-wrap">
          <div className="input-label">주소</div>
          <input className="input-field" value={locAddr} onChange={e => setLocAddr(e.target.value)} placeholder="예: 서울 강남구 테헤란로 123" />
        </div>

        <div className="divider" />
        <div className="section-title">예약 시간</div>

        <div className="input-wrap">
          <div className="input-label">날짜</div>
          <input
            className="input-field"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ textAlign: 'center' }}
          />
        </div>

        <div className="input-wrap">
          <div className="input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>시간</span>
            {durMin > 0 && <span style={{ fontWeight: 400, color: 'var(--text2)' }}>{durMin >= 60 ? Math.floor(durMin / 60) + '시간 ' : ''}{durMin % 60 > 0 ? durMin % 60 + '분' : ''}</span>}
            {durMin < 0 && <span style={{ fontWeight: 400, color: 'var(--red)', fontSize: 11 }}>종료가 시작보다 앞</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              className="input-field"
              type="time"
              value={`${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')}`}
              onChange={e => { const [h,m] = e.target.value.split(':'); setStartH(+h); setStartM(+m); }}
              style={{ flex: 1, textAlign: 'center' }}
            />
            <i className="ti ti-arrow-right" style={{ color: 'var(--text3)', flexShrink: 0, fontSize: 14 }} />
            <input
              className="input-field"
              type="time"
              value={`${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`}
              onChange={e => { const [h,m] = e.target.value.split(':'); setEndH(+h); setEndM(+m); }}
              style={{ flex: 1, textAlign: 'center' }}
            />
          </div>
        </div>

        <div className="divider" />
        <div className="section-title">프리셋 선택</div>
        {sorted.map(p => {
          const isDef = p.id === defId;
          const isSel = selectedId === p.id;
          return (
            <div key={p.id} className={`preset-card${isSel ? ' selected' : ''}${isDef && !isSel ? ' default-card' : ''}`} onClick={() => setSelectedId(p.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="preset-icon" style={{ background: p.color || '#F1EFE8' }}>{p.emoji || '⚙️'}</div>
                <div style={{ flex: 1 }}>
                  {isDef && <><span className="badge badge-blue" style={{ marginBottom: 4, display: 'inline-flex' }}>기본</span><br /></>}
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--blue-dark)', fontWeight: 600, marginTop: 2 }}>
                    {(() => { const t = p.steps.reduce((a, s) => a + s.min, 0); return t >= 60 ? `${Math.floor(t/60)}시간 ${t%60 > 0 ? t%60+'분 ' : ''}` : `${t}분 `; })()}· {p.steps.length}단계
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  {isSel && <i className="ti ti-circle-check" style={{ fontSize: 18, color: 'var(--blue)' }} />}
                  <button className="btn-icon" style={{ fontSize: 14, padding: 4 }} onClick={e => { e.stopPropagation(); toggleDefault(p.id); }}>
                    <i className="ti ti-star" style={{ color: isDef ? 'var(--amber)' : 'var(--text3)', fontSize: 16 }} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>{p.steps.map(s => s.name).join(' → ')}</div>
            </div>
          );
        })}
        <div className="add-btn-dashed" style={{ marginBottom: 16 }} onClick={() => go('sc-preset-edit')}>
          <i className="ti ti-plus" style={{ fontSize: 18 }} />
          커스텀 프리셋 만들기
        </div>
        <button className="btn-primary" disabled={!selectedId} onClick={start}>세차 시작</button>
      </div>
    </>
  );
}
