import './style.css';

const FormData = ({ isExpanded, className, item }) => {
  return (
    isExpanded && (
      <div className={`${className}__extra`}>
        <div className={`${className}__extra-last`}>
          <label className={`${className}__label`}>Last Time:</label>
          <div className={`${className}__value`}>
            {item.last && item.last.length > 0
              ? item.last.map((entry, index) => (
                  <div key={index}>
                    {entry.sets} x {entry.reps} @ {entry.weight} lbs
                  </div>
                ))
              : 'No history yet'}
          </div>
        </div>

        <div className={`${className}__extra-last`}>
          <label className={`${className}__label`}>Today:</label>
          <div className={`${className}__value`}>
            {item.today && item.today.length > 0
              ? item.today.map((entry, index) => (
                  <div key={index}>
                    {entry.sets} x {entry.reps} @ {entry.weight} lbs
                  </div>
                ))
              : 'No history yet'}
          </div>
        </div>

        <div className={`${className}__extra-today`}>
          <div className={`${className}__inputs`}>
            <select className={`${className}__input`} defaultValue=''>
              <option value='' disabled>
                Sets
              </option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <br />

            <select className={`${className}__input`} defaultValue=''>
              <option value='' disabled>
                Reps
              </option>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <br />

            <select className={`${className}__input`} defaultValue=''>
              <option value='' disabled>
                Weight (lbs)
              </option>
              {Array.from({ length: 250 }, (_, i) => i * 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${className}__extra-notes`}>
          <label className={`${className}__label`}>Notes:</label>
          <br />
          <textarea
            className={`${className}__textarea`}
            placeholder='Optional notes...'
          />
        </div>

        <div className={`${className}__meta`}>
          <button className={`${className}__save`}>Save Log</button>
        </div>
      </div>
    )
  )
}

export default FormData
