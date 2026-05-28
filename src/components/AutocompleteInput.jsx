import React, { useState } from 'react';

export default function AutocompleteInput({ label, value, onChange, placeholder, suggestions, onSelect }) {
  const [open, setOpen] = useState(false);

  const filtered = suggestions.filter(s =>
    s.label.toLowerCase().includes(value.toLowerCase())
  );

  const handleChange = (e) => {
    onChange(e.target.value);
    setOpen(!!e.target.value && filtered.length > 0);
  };

  const handleSelect = (item) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <div className="input-wrap">
      {label && <div className="input-label">{label}</div>}
      <input
        className="input-field"
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
      />
      {open && filtered.length > 0 && (
        <div className="autocomplete-list">
          {filtered.map((item, i) => (
            <div key={i} className="autocomplete-item" onMouseDown={() => handleSelect(item)}>
              {item.label}
              {item.sub && <span style={{ color: 'var(--text3)', fontSize: 11, marginLeft: 6 }}>{item.sub}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
