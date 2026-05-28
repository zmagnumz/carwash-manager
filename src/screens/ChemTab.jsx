import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATS, getCatStyle } from '../data/categories';

export default function ChemTab() {
  const { data, go, setChemEditIndex } = useApp();
  const [activeCat, setActiveCat] = useState('전체');

  const allCats = [...DEFAULT_CATS, ...(data.customCats || [])];
  const usedCats = ['전체', ...allCats.map(c => c.name).filter(
    name => data.chemicals.some(ch => ch.category === name)
  )];

  const filtered = activeCat === '전체'
    ? data.chemicals
    : data.chemicals.filter(c => c.category === activeCat);

  const openNew = () => { setChemEditIndex(null); go('sc-chem-edit'); };
  const openEdit = (i) => { setChemEditIndex(i); go('sc-chem-edit'); };

  return (
    <>
      <div className="pill-select">
        {usedCats.map(name => {
          const isSel = activeCat === name;
          if (name === '전체') {
            return (
              <div key="전체" className={`pill${isSel ? ' active' : ''}`} onClick={() => setActiveCat('전체')}>
                전체
              </div>
            );
          }
          const cat = getCatStyle(name, data.customCats);
          return (
            <div
              key={name}
              onClick={() => setActiveCat(name)}
              style={{
                padding: '6px 12px', borderRadius: 20, fontSize: 13,
                cursor: 'pointer', fontWeight: isSel ? 600 : 400,
                background: isSel ? cat.bg : 'transparent',
                color: isSel ? cat.text : 'var(--text2)',
                border: isSel ? 'none' : '0.5px solid var(--border2)',
                transition: 'all 0.15s',
              }}
            >
              {name}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--text3)', padding: '10px 0' }}>케미컬이 없습니다</div>
      ) : filtered.map((c) => {
        const i = data.chemicals.indexOf(c);
        const cat = getCatStyle(c.category, data.customCats);
        return (
          <div key={i} className="card" style={{ cursor: 'pointer' }} onClick={() => openEdit(i)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.brand} · {c.product}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: cat.bg, color: cat.text, fontWeight: 600 }}>
                    {c.category}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>희석 {c.dr}:{c.dw}</span>
                </div>
                {c.memo && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{c.memo}</div>}
              </div>
              <i className="ti ti-chevron-right" style={{ fontSize: 16, color: 'var(--text3)', flexShrink: 0 }} />
            </div>
          </div>
        );
      })}
      <div className="add-btn-dashed" onClick={openNew}>
        <i className="ti ti-plus" style={{ fontSize: 18 }} />
        케미컬 / 도구 추가
      </div>
    </>
  );
}
