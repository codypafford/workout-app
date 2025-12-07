// src/views/Logs/LogsOverview.jsx
import { Link } from 'react-router-dom'
import './style.css'

const MOCK_LOGS = [
  {
    date: '2025-12-01',
    groups: [
      { name: 'Upper Body', workouts: ['Chest Press', 'Arm Curls'] },
      { name: 'Leg Day', workouts: [] }
    ]
  },
  {
    date: '2025-12-02',
    groups: [
      { name: 'Upper Body', workouts: ['Arm Curls'] },
      { name: 'Leg Day', workouts: ['Leg Press'] }
    ]
  },
  {
    date: '2025-12-03',
    groups: [
      { name: 'Upper Body', workouts: [] },
      { name: 'Leg Day', workouts: ['Leg Press', 'Calf Press'] }
    ]
  }
]

const LogsOverview = () => {
  return (
    <div className='logs-overview'>
      <div className="logs-overview__breadcrumb">
        <Link to="/" className="logs-overview__breadcrumb-link">← Back to Workouts</Link>
      </div>

      <h2 className='logs-overview__title'>Workout Logs</h2>

      <ul className='logs-overview__list'>
        {MOCK_LOGS.sort((a, b) => new Date(b.date) - new Date(a.date)).map(
          (log) => {
            const activeGroups = log.groups.filter((g) => g.workouts.length > 0)
            if (activeGroups.length === 0) return null

            return (
              <li key={log.date} className='logs-overview__item'>
                <Link to={`/logs/${log.date}`} className='logs-overview__link'>
                  <strong className='logs-overview__date'>{log.date}</strong> —{' '}
                  <span className='logs-overview__groups'>
                    {activeGroups.map((g) => g.name).join(', ')}
                  </span>
                </Link>
              </li>
            )
          }
        )}
      </ul>
    </div>
  )
}

export default LogsOverview
