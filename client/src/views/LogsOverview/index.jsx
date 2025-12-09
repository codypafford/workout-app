import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchLogsOverview } from '../../proxies'
import './style.css'

const LogsOverview = () => {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchLogsOverview()
        setLogs(data)
      } catch (err) {
        console.error('Failed to fetch logs overview:', err)
      }
    }

    loadLogs()
  }, [])

  return (
    <div className='logs-overview'>
      <div className="logs-overview__breadcrumb">
        <Link to="/" className="logs-overview__breadcrumb-link">← Back to Workouts</Link>
      </div>

      <h2 className='logs-overview__title'>Workout Logs</h2>

      <ul className='logs-overview__list'>
        {logs
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((log) => {
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
          })}
      </ul>
    </div>
  )
}

export default LogsOverview
