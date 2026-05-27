import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search alerts...' }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        onChange('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onChange]);

  return (
    <div className="search-bar-wrapper">
      <Search size={16} className="search-icon" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value ? (
        <button className="search-clear" onClick={() => onChange('')}>
          <X size={14} />
        </button>
      ) : (
        <span className="search-kbd">Ctrl+K</span>
      )}
    </div>
  );
};

export default SearchBar;
