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
// TODO: need BEM styling. things arent even scoped 
const LogsOverview = () => {
  return (
    <div className='logs-overview'>
        {/* TODO: this breadcrumb can be a global style */}
      <div className="exercise-breadcrumb">
        <Link to="/">← Back to Workouts</Link>
      </div>
      <h2>Workout Logs</h2>
      <ul className='logs-overview__list'>
        {MOCK_LOGS.sort((a, b) => new Date(b.date) - new Date(a.date)).map(
          (log) => {
            const activeGroups = log.groups.filter((g) => g.workouts.length > 0)
            if (activeGroups.length === 0) return null

            return (
              <li key={log.date} className='logs-overview__item'>
                <Link to={`/logs/${log.date}`} className='logs-overview__link'>
                  <strong>{log.date}</strong> —{' '}
                  {activeGroups.map((g) => g.name).join(', ')}
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
