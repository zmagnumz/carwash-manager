import React from 'react';
import { useApp } from '../context/AppContext';

export default function TopBar({ title, left, right }) {
  const { back } = useApp();
  return (
    <div className="topbar">
      {left === 'back' ? (
        <button className="btn-icon" onClick={back} aria-label="뒤로">
          <i className="ti ti-arrow-left" />
        </button>
      ) : left || <div style={{ width: 32 }} />}
      <span className="topbar-title">{title}</span>
      {right || <div style={{ width: 32 }} />}
    </div>
  );
}
