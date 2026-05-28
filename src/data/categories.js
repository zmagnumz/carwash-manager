export const DEFAULT_CATS = [
  { name: '프리워시',     bg: '#2196F3', text: '#fff' },
  { name: '카샴푸',      bg: '#00BCD4', text: '#fff' },
  { name: '휠클리너',    bg: '#F44336', text: '#fff' },
  { name: '타이어클리너', bg: '#795548', text: '#fff' },
  { name: '실내클리너',  bg: '#4CAF50', text: '#fff' },
  { name: '가죽클리너',  bg: '#FF9800', text: '#fff' },
  { name: '가죽컨디셔너', bg: '#9C6B4E', text: '#fff' },
  { name: '유리클리너',  bg: '#00BFA5', text: '#fff' },
  { name: '물왁스',      bg: '#8BC34A', text: '#fff' },
  { name: '유리막',      bg: '#E91E63', text: '#fff' },
  { name: '유리발수',    bg: '#673AB7', text: '#fff' },
  { name: '유막제거',    bg: '#FF5722', text: '#fff' },
  { name: '타이어코팅제', bg: '#607D8B', text: '#fff' },
];

const COLOR_POOL = [
  '#26A69A', '#AB47BC', '#5C6BC0', '#26C6DA', '#66BB6A',
  '#FFA726', '#EF5350', '#8D6E63', '#78909C', '#EC407A',
  '#42A5F5', '#FF7043', '#29B6F6', '#9CCC65', '#7E57C2',
];

export function randomCatColor() {
  return COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];
}

export function getCatStyle(name, customCats = []) {
  const all = [...DEFAULT_CATS, ...(customCats || [])];
  return all.find(c => c.name === name) || { bg: '#78909C', text: '#fff' };
}
