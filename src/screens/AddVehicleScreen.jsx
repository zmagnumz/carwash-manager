import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';

const EMOJIS = ['🚗', '🚙', '🏎️', '🚐', '🛻', '🚕'];

export default function AddVehicleScreen() {
  const { data, saveData, back, goHome, setCurrentVehicle } = useApp();
  const [emoji, setEmoji] = useState('🚗');
  const [showPicker, setShowPicker] = useState(false);
  const [nick, setNick] = useState('');
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');

  const save = () => {
    if (!nick.trim() || !plate.trim()) return;
    const isFirst = data.vehicles.length === 0;
    saveData({ ...data, vehicles: [...data.vehicles, { nick: nick.trim(), plate: plate.trim(), model: model.trim(), emoji }] });
    setNick(''); setPlate(''); setModel(''); setEmoji('🚗');
    if (isFirst) {
      setCurrentVehicle(0);
      goHome();
    } else {
      back();
    }
  };

  return (
    <>
      <TopBar title="차량 추가" left="back" />
      <div className="content">
        <div style={{ fontSize: 56, textAlign: 'center', marginBottom: 8, cursor: 'pointer' }} onClick={() => setShowPicker(p => !p)}>
          {emoji}
        </div>
        {showPicker && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 16, padding: 12, background: 'var(--bg2)', borderRadius: 'var(--radius-lg)' }}>
            {EMOJIS.map(e => (
              <span key={e} style={{ fontSize: 28, cursor: 'pointer' }} onClick={() => { setEmoji(e); setShowPicker(false); }}>{e}</span>
            ))}
          </div>
        )}
        <div className="input-wrap">
          <div className="input-label">닉네임</div>
          <input className="input-field" value={nick} onChange={e => setNick(e.target.value)} placeholder="예: 내 흰둥이" />
        </div>
        <div className="input-wrap">
          <div className="input-label">차량 번호</div>
          <input className="input-field" value={plate} onChange={e => setPlate(e.target.value)} placeholder="예: 12가 3456" />
        </div>
        <div className="input-wrap">
          <div className="input-label">차종 메모</div>
          <input className="input-field" value={model} onChange={e => setModel(e.target.value)} placeholder="예: 아반떼 N 2023" />
        </div>
        <button className="btn-primary" onClick={save}>저장</button>
      </div>
    </>
  );
}
