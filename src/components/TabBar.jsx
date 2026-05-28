import React from 'react';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'home',    icon: 'ti-home',         label: '홈' },
  { id: 'history', icon: 'ti-calendar',      label: '기록' },
  { id: 'preset',  icon: 'ti-list-details',  label: '프리셋' },
  { id: 'chem',    icon: 'ti-flask',         label: '케미컬' },
  { id: 'stat',    icon: 'ti-chart-bar',     label: '통계' },
];

export default function TabBar() {
  const { currentTab, setCurrentTab } = useApp();
  return (
    <div className="tab-bar">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`tab-item${currentTab === t.id ? ' active' : ''}`}
          onClick={() => setCurrentTab(t.id)}
        >
          <i className={`ti ${t.icon}`} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
