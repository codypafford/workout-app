import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchLogsOverview } from '../../proxies'
import ChartView from '../ChartsView' // your new chart component
import './style.css'

const LogsOverview = () => {
  const [logs, setLogs] = useState([])
  const [view, setView] = useState('overview') // 'overview' | 'charts'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchLogsOverview()
        setLogs(data)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch logs overview:', err)
      }
    }

    loadLogs()
  }, [])

  if (loading) return <div>Loading Logs...</div>

  return (
    <div className='logs-overview'>
      <div className='logs-overview__breadcrumb'>
        <Link to='/' className='logs-overview__breadcrumb-link'>
          ← Back to Workouts
        </Link>
      </div>

      <div className='logs-overview__header'>
        <h2 className='logs-overview__title'>Workout Logs</h2>

        <div className='logs-overview__toggle'>
          <button
            className={`logs-overview__toggle-btn ${
              view === 'overview' ? 'is-active' : ''
            }`}
            onClick={() => setView('overview')}
          >
            Overview
          </button>
          <button
            className={`logs-overview__toggle-btn ${
              view === 'charts' ? 'is-active' : ''
            }`}
            onClick={() => setView('charts')}
          >
            Charts
          </button>
        </div>
      </div>

      {view === 'overview' ? (
        <ul className='logs-overview__list'>
          {logs
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((log) => {
              const activeGroups = log.groups.filter(
                (g) => g.workouts.length > 0
              )
              if (activeGroups.length === 0) return null

              return (
                <li key={log.date} className='logs-overview__item'>
                  <Link
                    to={`/logs/${log.date}`}
                    className='logs-overview__link'
                  >
                    <strong className='logs-overview__date'>{log.date}</strong>{' '}
                    —{' '}
                    <span className='logs-overview__groups'>
                      {activeGroups.map((g) => g.name).join(', ')}
                    </span>
                  </Link>
                </li>
              )
            })}
        </ul>
      ) : (
        <ChartView />
      )}
    </div>
  )
}

export default LogsOverview
