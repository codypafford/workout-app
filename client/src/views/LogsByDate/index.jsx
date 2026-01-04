import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchLogsByDate, deleteLog } from '../../proxies'
import './style.css'

const LogsByDate = () => {
  const { date } = useParams()
  const [log, setLog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLogsByDate(date)
      setLog(data[0] || null)
    } catch (err) {
      console.error('Failed to fetch logs:', err)
      setError('Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [date])

  const handleDelete = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return
    try {
      await deleteLog(logId)
      await loadLogs()
    } catch (err) {
      console.error(err)
      alert('Failed to delete workout')
    }
  }

  if (loading) return <p className='logs-by-date__loading'>Loading...</p>
  if (error) return <p className='logs-by-date__error'>{error}</p>
  if (!log)
    return (
      <div className='logs-by-date'>
        <div className='logs-by-date__breadcrumb'>
          <Link to='/logs' className='logs-by-date__breadcrumb-link'>
            &larr; Back to Logs Overview
          </Link>
        </div>
        <p className='logs-by-date__empty'>No logs for this date</p>
      </div>
    )

  const hasWorkouts = log.groups.some(
    (group) => group.workouts && group.workouts.length > 0
  )

  return (
    <div className='logs-by-date'>
      <div className='logs-by-date__breadcrumb'>
        <Link to='/logs' className='logs-by-date__breadcrumb-link'>
          &larr; Back to Logs Overview
        </Link>
      </div>

      <h2 className='logs-by-date__title'>Logs for {date}</h2>

      {hasWorkouts ? (
        log.groups.map((group) => {
          // Group workouts by workout.name (use name because there is no id)
          const exercisesByName = group.workouts.reduce((acc, workout) => {
            const key = workout.name ?? 'Unknown Exercise'
            if (!acc[key]) acc[key] = []
            acc[key].push(workout)
            return acc
          }, {})

          return (
            <div key={group.name} className='logs-by-date__group'>
              <h3 className='logs-by-date__group-title'>{group.name}</h3>
              <hr />

              {Object.entries(exercisesByName).map(
                ([exerciseName, workouts]) => (
                  <div
                    key={`${group.name}-${exerciseName}`}
                    className='logs-by-date__exercise-group'
                  >
                    <ul className='logs-by-date__workouts-list'>
                      {workouts.map((w) => (
                        <li key={w.logId} className='logs-by-date__workout'>
                          <div className='logs-by-date__workout-header'>
                            <span className='logs-by-date__workout-name'>
                              {exerciseName}
                            </span>

                            <button
                              className='logs-by-date__delete-btn'
                              onClick={() => handleDelete(w.logId)}
                              aria-label='Delete workout'
                            >
                              🗑️
                            </button>
                          </div>

                          {w.notes && (
                            <p className='logs-by-date__workout-notes'>
                              Notes: {w.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          )
        })
      ) : (
        <p className='logs-by-date__empty'>No logs for this date</p>
      )}
    </div>
  )
}

export default LogsByDate
