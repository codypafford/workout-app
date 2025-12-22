import { useState, useEffect } from 'react'
import { addLog } from '../../../proxies'
import { STRATEGIES } from './strategyHelpers'
import './style.css'

const EMPTY_SET = { reps: '', weight: '' }

const FormData = ({
  isExpanded,
  className,
  item,
  groupId,
  groupName,
  refresh,
  markAsDone
}) => {
  const [sets, setSets] = useState([
    { ...EMPTY_SET },
    { ...EMPTY_SET },
    { ...EMPTY_SET }
  ])
  const [highlightLogIds, setHighlightLogIds] = useState([])
  const [done, setDone] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState('pyramid')

  useEffect(() => {
    if (!isExpanded) return
    if (item.last?.length && item.last[item.last.length - 1].selectedStrategy) {
      setSelectedStrategy(selectedStrategy)
    }
    const strategy = STRATEGIES[selectedStrategy]
    if (!strategy) return

    const suggestedSets = strategy.generate(item.last)

    if (suggestedSets.length) {
      setSets(suggestedSets)
    }
  }, [isExpanded, item.last, selectedStrategy])

  const updateSet = (index, key, value) => {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    )
  }

  const handleMarkDone = () => {
    setDone(true)
    markAsDone(item.id)
  }

  const handleSaveLog = async () => {
    const completedSets = sets.filter((s) => s.reps && s.weight)
    if (!completedSets.length) {
      alert('Enter at least one set')
      return
    }

    const ok = window.confirm(`Save ${completedSets.length} set(s)?`)
    if (!ok) return

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
          weight: parseFloat(completedSets[i].weight),
          selectedStrategy
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

  const increase = () => {
    const strategy = STRATEGIES[selectedStrategy]
    if (!strategy?.increase) return

    setSets((prevSets) =>
      strategy.increase({
        prevSets,
        lastSets: item.last
      })
    )
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
        <div className={`${className}__strategy`}>
          Suggested Sets |{' '}
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
          >
            {Object.entries(STRATEGIES).map(([key, strat]) => (
              <option key={key} value={key}>
                {strat.label}
              </option>
            ))}
          </select>
        </div>

        {item.last?.length ? (
          <div className={`${className}__increase-btn`} onClick={increase}>
            Lift More
          </div>
        ) : (
          ''
        )}
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
              <option value=''>Reps</option>
              {[...Array(50)].map((_, n) => (
                <option key={n + 1} value={n + 1}>
                  {n + 1}
                </option>
              ))}
            </select>

            <select
              value={set.weight}
              onChange={(e) => updateSet(i, 'weight', e.target.value)}
            >
              <option value=''>lbs</option>
              <option value={1}>No Equipment</option>
              {[...Array(250)].map((_, n) => {
                const v = (n + 1) * 5
                return (
                  <option key={v} value={v}>
                    {v}
                  </option>
                )
              })}
            </select>
          </div>
        ))}
      </div>

      <div className={`${className}__meta`}>
        <button className={`${className}__save`} onClick={handleSaveLog}>
          Save Log
        </button>
        {!done && (
          <button
            className={`${className}__mark-done`}
            onClick={handleMarkDone}
            style={{ marginLeft: '0.5rem' }}
          >
            Mark Done
          </button>
        )}

        {done && (
          <span className={`${className}__done-label`}>✅ Exercise done</span>
        )}
      </div>
    </div>
  )
}

export default FormData
