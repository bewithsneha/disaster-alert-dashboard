import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Globe size={16} color="var(--text-secondary)" />
      <select 
        className="filter-select" 
        style={{ 
          width: 'auto', 
          padding: '6px 10px', 
          background: 'var(--input-bg)', 
          border: '1px solid var(--border-color)',
          fontSize: '0.82rem',
          borderRadius: 'var(--radius-sm)',
        }}
        value={i18n.language.split('-')[0]}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="bn">বাংলা</option>
        <option value="ta">தமிழ்</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
