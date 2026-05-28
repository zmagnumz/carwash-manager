export function fmt(s) {
  const abs = Math.abs(Math.round(s));
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const sec = abs % 60;
  if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

export function fmtVol(ml) {
  ml = Math.round(ml);
  if (ml >= 1000) {
    const l = ml / 1000;
    return (Number.isInteger(l) ? l : l.toFixed(1)) + 'L';
  }
  return ml + 'ml';
}
