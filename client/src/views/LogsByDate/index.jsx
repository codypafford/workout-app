// src/views/Logs/LogsByDate.jsx
import { useParams, Link } from 'react-router-dom'
import './style.css'

const MOCK_LOGS = [
  {
    date: '2025-12-01',
    groups: [
      { name: 'Upper Body', workouts: [{ name: 'Chest Press', sets: 3, reps: 10, weight: 135, notes: 'Felt strong' }] },
      { name: 'Leg Day', workouts: [] }
    ]
  },
  {
    date: '2025-12-02',
    groups: [
      { name: 'Upper Body', workouts: [{ name: 'Arm Curls', sets: 3, reps: 12, weight: 25, notes: '' }] },
      { name: 'Leg Day', workouts: [{ name: 'Leg Press', sets: 4, reps: 10, weight: 200, notes: 'Good form' }] }
    ]
  }
]

const LogsByDate = () => {
  const { date } = useParams()
  const log = MOCK_LOGS.find((l) => l.date === date)

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

  // Check if any group has workouts
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
            {group.workouts.length === 0 ? (
              <p className="logs-by-date__no-workouts">No workouts logged</p>
            ) : (
              <ul className="logs-by-date__workouts-list">
                {group.workouts.map((w, idx) => (
                  <li key={idx} className="logs-by-date__workout">
                    <span className="logs-by-date__workout-name">{w.name}</span> —{' '}
                    <span className="logs-by-date__workout-info">{w.sets} sets x {w.reps} reps @ {w.weight} lbs</span>
                    {w.notes && <p className="logs-by-date__workout-notes">Notes: {w.notes}</p>}
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
