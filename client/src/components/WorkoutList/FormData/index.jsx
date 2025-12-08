import { useState } from 'react'
import { addLog } from '../../../proxies' // create this function to call /api/logs
import './style.css'

const FormData = ({
  isExpanded,
  className,
  item,
  groupId,
  groupName,
  refresh
}) => {
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')

  const handleSaveLog = async () => {
    console.log(item)
    if (!sets || !reps || !weight) {
      alert('Please select sets, reps, and weight')
      return
    }

    try {
      const logPayload = {
        exerciseId: item.id,
        exerciseNameSnapshot: item.name,
        groupId: groupId,
        groupNameSnapshot: groupName,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
        notes: notes || ''
      }

      await addLog(logPayload)

      // Optionally reset inputs after saving
      setSets('')
      setReps('')
      setWeight('')
      setNotes('')

      // Optionally refresh parent data if needed
      await refresh()
    } catch (err) {
      console.error('Failed to save log:', err)
    }
  }

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
            <select
              className={`${className}__input`}
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            >
              <option value='' disabled>
                Sets
              </option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <br />

            <select
              className={`${className}__input`}
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            >
              <option value='' disabled>
                Reps
              </option>
              {[...Array(20)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <br />

            <select
              className={`${className}__input`}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            >
              <option value='' disabled>
                Weight (lbs)
              </option>
              {Array.from({ length: 250 }, (_, i) => i + 1).map((n) => (
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={`${className}__meta`}>
          <button className={`${className}__save`} onClick={handleSaveLog}>
            Save Log
          </button>
        </div>
      </div>
    )
  )
}

export default FormData
