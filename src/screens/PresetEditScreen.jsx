import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import { DEFAULT_CATS, getCatStyle } from '../data/categories';
import { PRESETS } from '../data/presets';

function ChemSelector({ chemId, onChange }) {
  const { data, saveData } = useApp();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // 신규 케미컬 폼 상태
  const [newBrand, setNewBrand] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newCat, setNewCat] = useState('');
  const [newDr, setNewDr] = useState('1');
  const [newDw, setNewDw] = useState('10');

  const allCats = [...DEFAULT_CATS, ...(data.customCats || [])];
  const chem = data.chemicals.find(c => c.id === chemId);

  const openCreate = () => {
    setNewBrand(''); setNewProduct(''); setNewCat(allCats[0]?.name || '');
    setNewDr('1'); setNewDw('10');
    setCreating(true);
  };

  const saveNewChem = () => {
    if (!newBrand.trim() || !newProduct.trim()) return;
    const obj = {
      id: Date.now(),
      brand: newBrand.trim(),
      product: newProduct.trim(),
      category: newCat,
      memo: '',
      dr: parseInt(newDr) || 1,
      dw: parseInt(newDw) || 10,
    };
    saveData({ ...data, chemicals: [...data.chemicals, obj] });
    onChange(obj.id);
    setCreating(false);
    setOpen(false);
  };

  if (chem) {
    const cat = getCatStyle(chem.category, data.customCats);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: cat.bg, color: cat.text, fontWeight: 600 }}>
          <i className="ti ti-flask" style={{ fontSize: 11, marginRight: 3 }} />
          {chem.brand} · {chem.product}
        </span>
        <button className="btn-icon" style={{ padding: 2 }} onClick={() => onChange(null)}>
          <i className="ti ti-x" style={{ fontSize: 12 }} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => { setOpen(p => !p); setCreating(false); }}
        style={{ fontSize: 12, color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <i className="ti ti-flask" style={{ fontSize: 13 }} />
        케미컬 연결
      </button>

      {open && !creating && (
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', marginTop: 4, overflow: 'hidden' }}>
          {data.chemicals.length === 0 ? (
            <div style={{ padding: '10px 12px', fontSize: 13, color: 'var(--text3)' }}>등록된 케미컬이 없습니다</div>
          ) : data.chemicals.map(c => {
            const cat = getCatStyle(c.category, data.customCats);
            return (
              <div
                key={c.id}
                className="autocomplete-item"
                onMouseDown={() => { onChange(c.id); setOpen(false); }}
              >
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: cat.bg, color: cat.text, marginRight: 7, fontWeight: 600 }}>
                  {c.category}
                </span>
                {c.brand} · {c.product}
                <span style={{ color: 'var(--text3)', fontSize: 11, marginLeft: 6 }}>{c.dr}:{c.dw}</span>
              </div>
            );
          })}
          <div
            className="autocomplete-item"
            style={{ borderTop: '0.5px solid var(--border)', color: 'var(--blue)', fontWeight: 600 }}
            onMouseDown={openCreate}
          >
            <i className="ti ti-plus" style={{ fontSize: 13, marginRight: 5 }} />
            새 케미컬 등록
          </div>
        </div>
      )}

      {creating && (
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', marginTop: 4, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>새 케미컬 등록</div>

          {/* 카테고리 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {allCats.map(cat => {
              const isSel = newCat === cat.name;
              return (
                <div key={cat.name} onClick={() => setNewCat(cat.name)} style={{
                  padding: '4px 9px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
                  background: isSel ? cat.bg : 'transparent',
                  color: isSel ? cat.text : 'var(--text2)',
                  border: isSel ? 'none' : '0.5px solid var(--border2)',
                  fontWeight: isSel ? 600 : 400,
                }}>
                  {cat.name}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <input
              className="input-field"
              placeholder="브랜드"
              value={newBrand}
              onChange={e => setNewBrand(e.target.value)}
              style={{ flex: 1, fontSize: 13, padding: '8px 10px' }}
            />
            <input
              className="input-field"
              placeholder="제품명"
              value={newProduct}
              onChange={e => setNewProduct(e.target.value)}
              style={{ flex: 1, fontSize: 13, padding: '8px 10px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text2)', flexShrink: 0 }}>희석비</span>
            <input className="input-field" type="number" min="1" value={newDr} onChange={e => setNewDr(e.target.value)} style={{ width: 52, textAlign: 'center', padding: '7px 4px', fontSize: 13 }} />
            <span style={{ color: 'var(--text3)' }}>:</span>
            <input className="input-field" type="number" min="0" value={newDw} onChange={e => setNewDw(e.target.value)} style={{ width: 52, textAlign: 'center', padding: '7px 4px', fontSize: 13 }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" style={{ flex: 1, padding: '9px', fontSize: 13 }} onClick={saveNewChem}>저장 후 연결</button>
            <button className="btn-secondary" style={{ flex: 1, padding: '9px', fontSize: 13 }} onClick={() => setCreating(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PresetEditScreen() {
  const { data, saveData, back, presetEditIndex, presetEditBuiltinId } = useApp();
  const isBuiltin = presetEditBuiltinId != null;
  const isEdit = presetEditIndex != null || isBuiltin;
  const existing = isBuiltin
    ? (data.bPresets?.[presetEditBuiltinId]
        ? { ...PRESETS.find(p => p.id === presetEditBuiltinId), ...data.bPresets[presetEditBuiltinId] }
        : PRESETS.find(p => p.id === presetEditBuiltinId))
    : (presetEditIndex != null ? data.cPresets[presetEditIndex] : null);

  const [name, setName] = useState('');
  const [steps, setSteps] = useState([]);
  const [stepName, setStepName] = useState('');
  const [stepMin, setStepMin] = useState('');
  const [stepChem, setStepChem] = useState(null);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setSteps(existing.steps.map(s => ({ ...s })));
    } else {
      setName('');
      setSteps([]);
    }
    setStepName(''); setStepMin(''); setStepChem(null);
  }, [presetEditIndex, presetEditBuiltinId]); // eslint-disable-line

  const addStep = () => {
    const n = stepName.trim();
    const m = parseInt(stepMin) || 10;
    if (!n) return;
    setSteps(prev => [...prev, { name: n, min: m, chemId: stepChem }]);
    setStepName(''); setStepMin(''); setStepChem(null);
  };

  const removeStep = (i) => setSteps(prev => prev.filter((_, idx) => idx !== i));
  const updateStepChem = (i, chemId) => setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, chemId } : s));

  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const dragRef = useRef({ from: null, over: null });
  const rowRefs = useRef([]);

  const onHandlePointerDown = (e, i) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { from: i, over: i };
    setDragIdx(i);
    setOverIdx(i);
  };
  const onHandlePointerMove = (e) => {
    if (dragRef.current.from === null) return;
    const y = e.clientY;
    for (let idx = 0; idx < rowRefs.current.length; idx++) {
      const el = rowRefs.current[idx];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (y >= rect.top && y <= rect.bottom) {
        if (dragRef.current.over !== idx) { dragRef.current.over = idx; setOverIdx(idx); }
        break;
      }
    }
  };
  const onHandlePointerUp = () => {
    const { from, over } = dragRef.current;
    dragRef.current = { from: null, over: null };
    if (from !== null && over !== null && from !== over) {
      setSteps(prev => {
        const s = [...prev];
        const [moved] = s.splice(from, 1);
        s.splice(over, 0, moved);
        return s;
      });
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  const save = () => {
    if (!name.trim() || steps.length === 0) return;
    if (isBuiltin) {
      const bPresets = { ...(data.bPresets || {}), [presetEditBuiltinId]: { name: name.trim(), steps: [...steps] } };
      saveData({ ...data, bPresets });
    } else {
      const preset = {
        name: name.trim(),
        emoji: existing?.emoji || '⚙️',
        color: existing?.color || '#F1EFE8',
        steps: [...steps],
      };
      const cPresets = isEdit
        ? data.cPresets.map((p, i) => i === presetEditIndex ? preset : p)
        : [...data.cPresets, preset];
      saveData({ ...data, cPresets });
    }
    back();
  };

  return (
    <>
      <TopBar title={isBuiltin ? '기본 프리셋 편집' : isEdit ? '프리셋 편집' : '커스텀 프리셋'} left="back" />
      <div className="content">
        <div className="input-wrap">
          <div className="input-label">프리셋 이름</div>
          <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="예: 내 루틴" />
        </div>

        <div className="section-title" style={{ marginTop: 4 }}>단계 추가</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 6 }}>
          <div style={{ flex: 2 }}>
            <div className="input-label">단계명</div>
            <input className="input-field" value={stepName} onChange={e => setStepName(e.target.value)} placeholder="예: 미트 세차" />
          </div>
          <div style={{ width: 64 }}>
            <div className="input-label">분</div>
            <input className="input-field" type="number" min="1" value={stepMin} onChange={e => setStepMin(e.target.value)} placeholder="10" style={{ textAlign: 'center' }} />
          </div>
          <button className="btn-icon" style={{ border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', padding: 9, height: 38, flexShrink: 0 }} onClick={addStep}>
            <i className="ti ti-plus" />
          </button>
        </div>
        <div style={{ marginBottom: 10 }}>
          <ChemSelector chemId={stepChem} onChange={setStepChem} />
        </div>

        <div style={{ marginBottom: 16 }}>
          {steps.map((s, i) => (
            <div
              key={i}
              ref={el => rowRefs.current[i] = el}
              className="card"
              style={{
                padding: '10px 12px', marginBottom: 8,
                opacity: dragIdx === i ? 0.4 : 1,
                border: overIdx === i && dragIdx !== i ? '1.5px solid var(--blue)' : undefined,
                transition: 'opacity 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{ cursor: 'grab', touchAction: 'none', padding: '2px 4px', color: 'var(--text3)', flexShrink: 0 }}
                  onPointerDown={e => onHandlePointerDown(e, i)}
                  onPointerMove={onHandlePointerMove}
                  onPointerUp={onHandlePointerUp}
                  onPointerCancel={onHandlePointerUp}
                >
                  <i className="ti ti-grip-vertical" style={{ fontSize: 16 }} />
                </div>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', flexShrink: 0 }}>{s.min}분</div>
                <button className="btn-icon" onClick={() => removeStep(i)}>
                  <i className="ti ti-trash" style={{ fontSize: 15, color: 'var(--red)' }} />
                </button>
              </div>
              <div style={{ marginLeft: 32 }}>
                <ChemSelector chemId={s.chemId} onChange={(chemId) => updateStepChem(i, chemId)} />
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={save}>{isEdit ? '저장' : '프리셋 저장'}</button>
      </div>
    </>
  );
}
