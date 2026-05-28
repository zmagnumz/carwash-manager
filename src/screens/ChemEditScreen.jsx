import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import AutocompleteInput from '../components/AutocompleteInput';
import { DEFAULT_CATS, randomCatColor } from '../data/categories';

export default function ChemEditScreen() {
  const { data, saveData, back, chemEditIndex } = useApp();
  const isEdit = chemEditIndex != null;
  const existing = isEdit ? data.chemicals[chemEditIndex] : null;

  const allCats = [...DEFAULT_CATS, ...(data.customCats || [])];
  const firstCat = allCats[0]?.name || '';

  const [category, setCategory] = useState(existing?.category || firstCat);
  const [brand, setBrand] = useState(existing?.brand || '');
  const [product, setProduct] = useState(existing?.product || '');
  const [memo, setMemo] = useState(existing?.memo || '');
  const [dr, setDr] = useState(String(existing?.dr ?? 1));
  const [dw, setDw] = useState(String(existing?.dw ?? 10));
  const [calcC, setCalcC] = useState('');
  const [calcW, setCalcW] = useState('');

  // 커스텀 카테고리 추가
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    const cats = [...DEFAULT_CATS, ...(data.customCats || [])];
    if (existing) {
      setCategory(existing.category);
      setBrand(existing.brand);
      setProduct(existing.product);
      setMemo(existing.memo || '');
      setDr(String(existing.dr));
      setDw(String(existing.dw));
    } else {
      setCategory(cats[0]?.name || '');
      setBrand(''); setProduct(''); setMemo(''); setDr('1'); setDw('10');
    }
    setCalcC(''); setCalcW('');
    setAddingCat(false); setNewCatName('');
  }, [chemEditIndex]); // eslint-disable-line

  const drN = parseInt(dr) || 1;
  const dwN = parseInt(dw) || 0;

  const handleCalcC = (v) => {
    setCalcC(v);
    const c = parseFloat(v);
    if (!isNaN(c)) setCalcW(String(Math.round(c * (dwN / drN))));
  };
  const handleCalcW = (v) => {
    setCalcW(v);
    const w = parseFloat(v);
    if (!isNaN(w) && dwN !== 0) setCalcC(String(Math.round(w / (dwN / drN))));
  };

  const calcTotal = () => {
    const c = parseFloat(calcC), w = parseFloat(calcW);
    if (!isNaN(c) && !isNaN(w)) return '총 ' + (c + w) + 'ml';
    return '';
  };

  const saveNewCat = () => {
    const name = newCatName.trim();
    if (!name || allCats.find(c => c.name === name)) return;
    const newCat = { name, bg: randomCatColor(), text: '#fff' };
    saveData({ ...data, customCats: [...(data.customCats || []), newCat] });
    setCategory(name);
    setNewCatName('');
    setAddingCat(false);
  };

  const deleteCustomCat = (e, name) => {
    e.stopPropagation();
    saveData({ ...data, customCats: (data.customCats || []).filter(c => c.name !== name) });
    if (category === name) setCategory(allCats[0]?.name || '');
  };

  const brandSuggestions = [...new Set(data.chemicals.map(c => c.brand))]
    .filter(b => b.toLowerCase().includes(brand.toLowerCase()))
    .map(b => ({ label: b }));

  const productSuggestions = data.chemicals
    .filter(c => (!brand || c.brand === brand) && c.product.toLowerCase().includes(product.toLowerCase()))
    .map(c => ({ label: c.product, sub: c.dr + ':' + c.dw, id: c.id }));

  const selectProduct = (item) => {
    const c = data.chemicals.find(ch => ch.id === item.id);
    if (!c) return;
    setProduct(c.product); setDr(String(c.dr)); setDw(String(c.dw)); setMemo(c.memo || '');
  };

  const save = () => {
    if (!brand.trim() || !product.trim()) return;
    const obj = {
      id: isEdit ? existing.id : Date.now(),
      brand: brand.trim(), product: product.trim(),
      category, memo: memo.trim(), dr: drN, dw: dwN,
    };
    const chemicals = isEdit
      ? data.chemicals.map((c, i) => i === chemEditIndex ? obj : c)
      : [...data.chemicals, obj];
    saveData({ ...data, chemicals });
    back();
  };

  return (
    <>
      <TopBar title={isEdit ? '케미컬 편집' : '케미컬 추가'} left="back" />
      <div className="content">
        <div className="section-title">카테고리</div>
        <div className="pill-select" style={{ marginBottom: 6 }}>
          {allCats.map(cat => {
            const isSel = category === cat.name;
            const isCustom = (data.customCats || []).some(c => c.name === cat.name);
            return (
              <div
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '6px 10px', borderRadius: 20, fontSize: 13,
                  cursor: 'pointer', fontWeight: isSel ? 600 : 400,
                  background: isSel ? cat.bg : 'transparent',
                  color: isSel ? cat.text : 'var(--text2)',
                  border: isSel ? 'none' : '0.5px solid var(--border2)',
                  transition: 'all 0.15s',
                }}
              >
                {cat.name}
                {isCustom && (
                  <span
                    onMouseDown={e => deleteCustomCat(e, cat.name)}
                    style={{ fontSize: 11, opacity: 0.7, lineHeight: 1, cursor: 'pointer' }}
                  >✕</span>
                )}
              </div>
            );
          })}

          {/* 카테고리 추가 버튼 */}
          {!addingCat ? (
            <div
              onClick={() => setAddingCat(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '6px 10px', borderRadius: 20, fontSize: 13,
                cursor: 'pointer', color: 'var(--text3)',
                border: '0.5px dashed var(--border2)',
              }}
            >
              <i className="ti ti-plus" style={{ fontSize: 13 }} /> 추가
            </div>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <input
                autoFocus
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveNewCat(); if (e.key === 'Escape') setAddingCat(false); }}
                placeholder="카테고리명"
                style={{
                  padding: '5px 10px', borderRadius: 20, fontSize: 13,
                  border: '0.5px solid var(--blue)', outline: 'none',
                  background: 'var(--bg)', color: 'var(--text)', width: 100,
                }}
              />
              <button className="btn-icon" style={{ padding: 4 }} onClick={saveNewCat}>
                <i className="ti ti-check" style={{ fontSize: 14, color: 'var(--blue)' }} />
              </button>
              <button className="btn-icon" style={{ padding: 4 }} onClick={() => setAddingCat(false)}>
                <i className="ti ti-x" style={{ fontSize: 14 }} />
              </button>
            </div>
          )}
        </div>

        <AutocompleteInput label="브랜드" value={brand} onChange={setBrand} placeholder="예: Gyeon" suggestions={brandSuggestions} onSelect={item => setBrand(item.label)} />
        <AutocompleteInput label="제품명" value={product} onChange={setProduct} placeholder="예: Foam" suggestions={productSuggestions} onSelect={selectProduct} />
        <div className="input-wrap">
          <div className="input-label">메모 / 제품평</div>
          <input className="input-field" value={memo} onChange={e => setMemo(e.target.value)} placeholder="예: 거품 풍성, 철분 효과 좋음" />
        </div>
        <div className="divider" />
        <div className="section-title">희석비 (케미컬 : 물)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <input className="input-field" type="number" min="1" value={dr} onChange={e => setDr(e.target.value)} style={{ width: 70, textAlign: 'center' }} />
          <span style={{ color: 'var(--text2)', fontSize: 20, fontWeight: 300 }}>:</span>
          <input className="input-field" type="number" min="0" value={dw} onChange={e => setDw(e.target.value)} style={{ width: 70, textAlign: 'center' }} />
        </div>
        <div className="section-title">사용량 계산기</div>
        <div className="dil-calc" style={{ marginBottom: 6 }}>
          <div className="dil-input-wrap">
            <div className="dil-label">케미컬 (ml)</div>
            <input className="dil-input" type="number" placeholder="50" value={calcC} onChange={e => handleCalcC(e.target.value)} />
          </div>
          <div className="dil-input-wrap">
            <div className="dil-label">물 (ml)</div>
            <input className="dil-input" type="number" placeholder="500" value={calcW} onChange={e => handleCalcW(e.target.value)} />
          </div>
        </div>
        <div className="dil-total">{calcTotal()}</div>
        <div style={{ height: 16 }} />
        <button className="btn-primary" onClick={save}>저장</button>
      </div>
    </>
  );
}
