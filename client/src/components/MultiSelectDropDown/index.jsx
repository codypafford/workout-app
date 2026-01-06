import { useState, useEffect, useRef } from 'react'
import './style.css'

const MAX_SELECTION = 8

const MultiSelectDropdown = ({ options, selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option))
    } else if (selected.length < MAX_SELECTION) {
      onChange([...selected, option])
    }
  }

  const handleRandomSelect = () => {
    const shuffled = [...options].sort(() => 0.5 - Math.random())
    onChange(shuffled.slice(0, MAX_SELECTION))
  }

  return (
    <div className='multi-select-dropdown' ref={ref}>
      <div className='multi-select-dropdown__controls'>
        <button
          type='button'
          className='multi-select-dropdown__random-btn'
          onClick={handleRandomSelect}
          disabled={options.length === 0}
        >
          Random 8
        </button>

        <button
          type='button'
          className='multi-select-dropdown__button'
          onClick={() => setOpen(!open)}
        >
          {selected.length === 0
            ? 'Select Exercises'
            : `${selected.length} selected`}
          <span className='multi-select-dropdown__arrow'>
            {open ? '▲' : '▼'}
          </span>
        </button>
      </div>

      {open && (
        <div className='multi-select-dropdown__menu'>
          {options.map((option) => (
            <label key={option} className='multi-select-dropdown__option'>
              <input
                type='checkbox'
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className='multi-select-dropdown__checkbox'
              />
              <span className='multi-select-dropdown__option-label'>
                {option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown
