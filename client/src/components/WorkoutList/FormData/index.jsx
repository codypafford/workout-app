import { useState } from 'react'
import { addLog } from '../../../proxies'
import './style.css'

const FormData = ({
  isExpanded,
  className,
  item,
  groupId,
  groupName,
  refresh
}) => {
  const [sets, setSets] = useState('1')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [highlightLogId, setHighlightLogId] = useState(null)

  const handleSaveLog = async () => {
    if (!sets || !reps || !weight) {
      alert('Please select sets, reps, and weight')
      return
    }

    try {
      const logPayload = {
        exerciseId: item.id,
        exerciseNameSnapshot: item.name,
        groupId,
        groupNameSnapshot: groupName,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
        notes: notes || ''
      }

      const savedLog = await addLog(logPayload)
      const savedLogId = savedLog._id
      setHighlightLogId(savedLogId)
      console.log('savedLog', savedLog)

      setSets('1')
      setReps('')
      setWeight('')
      setNotes('')
      setShowNotes(false)

      await refresh()

      setTimeout(() => {
        setHighlightLogId(null)
      }, 3000)
    } catch (err) {
      console.error('Failed to save log:', err)
    }
  }

  if (!isExpanded) return null

  return (
    <div className={`${className}__extra`}>
      {/* History */}
      <div className={`${className}__history`}>
        {/* Last Time */}
        <div className={`${className}__extra-last`}>
          <label className={`${className}__label`}>Last Time:</label>
          <hr />
          <div className={`${className}__value`}>
            {item.last?.length
              ? item.last.map((entry, index) => (
                  <div key={index}>
                    {entry.sets} x {entry.reps} @ {entry.weight} lbs
                  </div>
                ))
              : 'No history yet'}
          </div>
        </div>

        {/* Today */}
        <div className={`${className}__extra-last`}>
          <label className={`${className}__label`}>Today:</label>
          <hr />
          <div className={`${className}__value`}>
            {item.today?.length
              ? item.today.map((entry) => (
                  <div
                    key={entry.logId}
                    className={
                      entry.logId === highlightLogId
                        ? `${className}__entry ${className}__entry--highlight`
                        : `${className}__entry`
                    }
                  >
                    {entry.sets} x {entry.reps} @ {entry.weight} lbs
                  </div>
                ))
              : 'No history yet'}
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className={`${className}__extra-today`}>
        <div className={`${className}__inputs`}>
          <span className={`${className}__input-label`}>Sets</span>
          <select
            className={`${className}__input`}
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <br />

          <span className={`${className}__input-label`}>Reps</span>
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

          <span className={`${className}__input-label`}>Weight</span>
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

      {/* Notes toggle */}
      <div className={`${className}__notes-toggle`}>
        <button
          type='button'
          className={`${className}__notes-btn`}
          onClick={() => setShowNotes((prev) => !prev)}
        >
          {showNotes ? '− Notes' : '+ Notes'}
        </button>
      </div>

      {/* Notes */}
      {showNotes && (
        <div className={`${className}__extra-notes`}>
          <textarea
            className={`${className}__textarea`}
            placeholder='Optional notes...'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      )}

      {/* Save */}
      <div className={`${className}__meta`}>
        <button className={`${className}__save`} onClick={handleSaveLog}>
          Save Log
        </button>
      </div>
    </div>
  )
}

export default FormData
