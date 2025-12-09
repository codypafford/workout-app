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
      console.log('setting log data: ', data)
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
      // Refresh the logs after deletion
      await loadLogs()
    } catch (err) {
      console.error(err)
      alert('Failed to delete workout')
    }
  }

  if (loading) return <p className="logs-by-date__loading">Loading...</p>
  if (error) return <p className="logs-by-date__error">{error}</p>
  if (!log) return (
    <div className="logs-by-date">
      <div className="logs-by-date__breadcrumb">
        <Link to="/logs" className="logs-by-date__breadcrumb-link">
          &larr; Back to Logs Overview
        </Link>
      </div>
      <p className="logs-by-date__empty">No logs for this date</p>
    </div>
  )

  const hasWorkouts = log.groups.some(group => group.workouts.length > 0)

  return (
    <div className="logs-by-date">
      <div className="logs-by-date__breadcrumb">
        <Link to="/logs" className="logs-by-date__breadcrumb-link">
          &larr; Back to Logs Overview
        </Link>
      </div>

      <h2 className="logs-by-date__title">Logs for {date}</h2>

      {hasWorkouts ? (
        log.groups.map((group) => (
          <div key={group.name} className="logs-by-date__group">
            <h3 className="logs-by-date__group-title">{group.name}</h3>
            <hr />
            {group.workouts.length === 0 ? (
              <p className="logs-by-date__no-workouts">No workouts logged</p>
            ) : (
              <ul className="logs-by-date__workouts-list">
                {group.workouts.map((w) => (
                  <li key={w.logId} className="logs-by-date__workout">
                    <span className="logs-by-date__workout-name">{w.name}</span><br/>
                    <span className="logs-by-date__workout-info">{w.sets} sets x {w.reps} reps @ {w.weight} lbs</span>
                    {w.notes && <p className="logs-by-date__workout-notes">Notes: {w.notes}</p>}
                    &nbsp;&nbsp;&nbsp;
                    <span
                      className="logs-by-date__delete-btn"
                      onClick={() => handleDelete(w.logId)}
                    >
                      🗑️
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p className="logs-by-date__empty">No logs for this date</p>
      )}
    </div>
  )
}

export default LogsByDate
