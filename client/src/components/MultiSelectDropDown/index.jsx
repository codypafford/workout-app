import { useState, useEffect, useRef } from 'react';
import './style.css';

const MAX_SELECTION = 5;

const MultiSelectDropdown = ({ options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
    console.log('options', options)
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
    if (selected.includes(option)) {
      // Deselect option
      onChange(selected.filter((o) => o !== option));
    } else {
      // Prevent adding more than MAX_SELECTION
      if (selected.length < MAX_SELECTION) {
        onChange([...selected, option]);
      } else {
        alert(`You can select up to ${MAX_SELECTION} exercises.`);
      }
    }
  };

  return (
    <div className="multi-select-dropdown" ref={ref}>
      <button
        type="button"
        className="multi-select-dropdown__button"
        onClick={() => setOpen(!open)}
      >
        {selected.length === 0
          ? 'Select Exercises'
          : selected.join(', ')}
        <span className="multi-select-dropdown__arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="multi-select-dropdown__menu">
          {options.map((option) => (
            <label key={option} className="multi-select-dropdown__option">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="multi-select-dropdown__checkbox"
              />
              <span className="multi-select-dropdown__option-label">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
