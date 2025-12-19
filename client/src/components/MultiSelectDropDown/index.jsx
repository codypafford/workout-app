import { useState, useEffect, useRef } from 'react';

const MultiSelectDropdown = ({ options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    onChange(selected.includes(option)
      ? selected.filter(o => o !== option)
      : [...selected, option]
    );
  };

  return (
    <div className="multi-select-dropdown" ref={ref} style={{ position: 'relative', width: '200px' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: 'left' }}
      >
        {selected.length === 0 ? 'Select Exercises' : selected.join(', ')}
      </button>
      {open && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            border: '1px solid #ccc',
            maxHeight: '200px',
            overflowY: 'auto',
            background: 'white',
            zIndex: 10,
          }}
        >
          {options.map(option => (
            <label key={option} style={{ display: 'block', padding: '4px 8px' }}>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
