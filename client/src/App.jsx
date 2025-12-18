import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import WorkoutView from './views/WorkoutView/WorkoutView'
import ExerciseView from './views/ExerciseView'
import ExercisesView from './views/ExercisesView'
import LogsOverview from './views/LogsOverview'
import LogsByDate from './views/LogsByDate'
import PlanWorkout from './views/PlanWorkout'

import './App.css'

const App = () => {
  const [verified, setVerified] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')

  // Run once on mount — check cookie
  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('verified='))
    if (cookie && cookie.split('=')[1] === 'true') {
      setVerified(true)
    }
  }, [])

  const handleSubmit = () => {
    // Replace with your env var (Vite example below)
    const correctPassword = import.meta.env.VITE_APP_PASSWORD

    if (passwordInput === correctPassword) {
      setVerified(true)

      // Store cookie (expires in 30 days)
      document.cookie = `verified=true; max-age=${60 * 60 * 24 * 30}; path=/`
    } else {
      alert('Wrong password')
    }
  }

  if (!verified) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter Password</h2>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <br />
        <br />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    )
  }

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/logs">Logs</Link> |{' '}
        <Link to="/exercises">Exercises</Link> |{' '}
        <Link to="/plan-workout">Plan Workout</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<WorkoutView />} />
          <Route path="/exercise/:id" element={<ExerciseView />} />
          <Route path="/exercises" element={<ExercisesView />} />
          <Route path="/logs" element={<LogsOverview />} />
          <Route path="/logs/:date" element={<LogsByDate />} />
          <Route path="/plan-workout" element={<PlanWorkout />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
