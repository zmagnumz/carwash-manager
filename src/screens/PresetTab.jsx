import React from 'react';
import { useApp } from '../context/AppContext';
import { PRESETS } from '../data/presets';

export default function PresetTab() {
  const { data, saveData, go, setPresetEditIndex, setPresetEditBuiltinId } = useApp();
  const defId = data.defaultPreset;

  const toggleDefault = (id) => {
    saveData({ ...data, defaultPreset: data.defaultPreset === id ? null : id });
  };

  const deleteCustom = (i) => {
    if (!window.confirm('프리셋을 삭제할까요?')) return;
    const cPresets = data.cPresets.filter((_, idx) => idx !== i);
    const newDef = data.defaultPreset === 'c' + i ? null : data.defaultPreset;
    saveData({ ...data, cPresets, defaultPreset: newDef });
  };

  const openEdit = (i) => {
    setPresetEditBuiltinId(null);
    setPresetEditIndex(i);
    go('sc-preset-edit');
  };

  const openNew = () => {
    setPresetEditBuiltinId(null);
    setPresetEditIndex(null);
    go('sc-preset-edit');
  };

  const openEditBuiltin = (id) => {
    setPresetEditIndex(null);
    setPresetEditBuiltinId(id);
    go('sc-preset-edit');
  };

  const resetBuiltin = (id) => {
    if (!window.confirm('기본 프리셋을 원래대로 되돌릴까요?')) return;
    const bPresets = { ...(data.bPresets || {}) };
    delete bPresets[id];
    saveData({ ...data, bPresets });
  };

  const renderCard = ({ p, id, isBuiltin, customIdx, isModified }) => {
    const isDef = defId === id;
    return (
      <div key={id} className="card" style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="preset-icon" style={{ background: p.color || '#F1EFE8' }}>{p.emoji || '⚙️'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
              {isDef && <span className="badge badge-blue">기본</span>}
              {isBuiltin && <span className="badge badge-gray">기본제공</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              {p.steps.map(s => s.name).join(' → ')}
            </div>
            {p.steps.some(s => s.chemId) && (
              <div style={{ fontSize: 11, color: 'var(--blue-dark)', marginTop: 3 }}>
                <i className="ti ti-flask" style={{ fontSize: 11, marginRight: 3 }} />
                케미컬 {p.steps.filter(s => s.chemId).length}개 연결됨
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button className="btn-icon" style={{ padding: 6 }} onClick={() => toggleDefault(id)}>
              <i className="ti ti-star" style={{ fontSize: 18, color: isDef ? 'var(--amber)' : 'var(--text3)' }} />
            </button>
            {isBuiltin ? (
              <>
                <button className="btn-icon" style={{ padding: 6 }} onClick={() => openEditBuiltin(id)}>
                  <i className="ti ti-edit" style={{ fontSize: 16 }} />
                </button>
                {isModified && (
                  <button className="btn-icon" style={{ padding: 6 }} onClick={() => resetBuiltin(id)}>
                    <i className="ti ti-restore" style={{ fontSize: 16, color: 'var(--text3)' }} />
                  </button>
                )}
              </>
            ) : (
              <>
                <button className="btn-icon" style={{ padding: 6 }} onClick={() => openEdit(customIdx)}>
                  <i className="ti ti-edit" style={{ fontSize: 16 }} />
                </button>
                <button className="btn-icon" style={{ padding: 6 }} onClick={() => deleteCustom(customIdx)}>
                  <i className="ti ti-trash" style={{ fontSize: 16, color: 'var(--red)' }} />
                </button>
              </>
            )}
          </div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {p.steps.map((s, i) => (
            <div key={i} style={{ fontSize: 11, background: 'var(--bg2)', borderRadius: 6, padding: '4px 8px', color: 'var(--text2)' }}>
              {s.name} · {s.min}분
            </div>
          ))}
        </div>
        <div style={{ marginTop: 7, fontSize: 11, color: 'var(--blue-dark)', fontWeight: 600 }}>
          <i className="ti ti-clock" style={{ fontSize: 11, marginRight: 3 }} />
          {(() => { const t = p.steps.reduce((a, s) => a + s.min, 0); return t >= 60 ? `${Math.floor(t/60)}시간 ${t%60 > 0 ? t%60+'분 ' : ''}` : `${t}분 `; })()}
          · {p.steps.length}단계
        </div>
      </div>
    );
  };

  return (
    <>
      {PRESETS.length > 0 && (
        <>
          <div className="section-title">기본 제공</div>
          {PRESETS.map(p => {
          const override = data.bPresets?.[p.id];
          return renderCard({ p: override ? { ...p, ...override } : p, id: p.id, isBuiltin: true, isModified: !!override });
        })}
        </>
      )}
      <div className="section-title" style={{ marginTop: 4 }}>커스텀 프리셋</div>
      {data.cPresets.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--text3)', padding: '10px 0' }}>커스텀 프리셋이 없습니다</div>
      ) : (
        data.cPresets.map((p, i) =>
          renderCard({ p, id: 'c' + i, isBuiltin: false, customIdx: i })
        )
      )}
      <div className="add-btn-dashed" style={{ marginTop: 4 }} onClick={openNew}>
        <i className="ti ti-plus" style={{ fontSize: 18 }} />
        새 프리셋 만들기
      </div>
    </>
  );
}
