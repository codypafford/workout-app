import { useState, useEffect } from 'react'
import { addLog } from '../../../proxies'
import { pyramidStrategy } from './strategyHelpers'
import './style.css'

const EMPTY_SET = { reps: '', weight: '' }

const FormData = ({
  isExpanded,
  className,
  item,
  groupId,
  groupName,
  refresh
}) => {
  const [sets, setSets] = useState([
    { ...EMPTY_SET },
    { ...EMPTY_SET },
    { ...EMPTY_SET }
  ])
  const [highlightLogIds, setHighlightLogIds] = useState([])

  useEffect(() => {
    if (isExpanded) {
      const suggestedSets = pyramidStrategy(item.last)
      setSets(suggestedSets)
    }
  }, [isExpanded, item.last])

  const updateSet = (index, key, value) => {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    )
  }

  const handleSaveLog = async () => {
    const completedSets = sets.filter((s) => s.reps && s.weight)
    if (!completedSets.length) {
      alert('Enter at least one set')
      return
    }

    try {
      const savedIds = []

      // TODO: should save all logs at once...
      for (let i = 0; i < completedSets.length; i++) {
        const logPayload = {
          exerciseId: item.id,
          exerciseNameSnapshot: item.name,
          groupId,
          groupNameSnapshot: groupName,
          sets: 1,
          reps: parseInt(completedSets[i].reps),
          weight: parseFloat(completedSets[i].weight)
        }

        const savedLog = await addLog(logPayload)
        savedIds.push(savedLog._id)
      }

      setHighlightLogIds(savedIds)

      setSets([{ ...EMPTY_SET }, { ...EMPTY_SET }, { ...EMPTY_SET }])

      await refresh()

      setTimeout(() => setHighlightLogIds([]), 3000)
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
                      highlightLogIds.includes(entry.logId)
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
      <div className={`${className}__set-table`}>
        <div className={`${className}__strategy`}>Suggested Sets | Pyramid Strategy</div>
        <div className={`${className}__set-header`}>
          <span>Set</span>
          <span>Reps</span>
          <span>Weight</span>
        </div>

        {sets.map((set, i) => (
          <div key={i} className={`${className}__set-row`}>
            <span className={`${className}__set-number`}>{i + 1}</span>

            <select
              value={set.reps}
              onChange={(e) => updateSet(i, 'reps', e.target.value)}
            >
              <option value='' disabled>
                Reps
              </option>
              {[...Array(20)].map((_, n) => (
                <option key={n + 1} value={n + 1}>
                  {n + 1}
                </option>
              ))}
            </select>

            <select
              value={set.weight}
              onChange={(e) => updateSet(i, 'weight', e.target.value)}
            >
              <option value='' disabled>
                lbs
              </option>
              {Array.from({ length: 250 }, (_, n) => (
                <option key={n + 1} value={n + 1}>
                  {n + 1}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className={`${className}__meta`}>
        <button className={`${className}__save`} onClick={handleSaveLog}>
          Save Log
        </button>
      </div>
    </div>
  )
}

export default FormData
