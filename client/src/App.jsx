import { Routes, Route } from 'react-router-dom'
import WorkoutView from './views/WorkoutView/WorkoutView'
import ExerciseView from './views/ExerciseView'
import LogsOverview from './views/LogsOverview'
import LogsByDate from './views/LogsByDate'
import './App.css'

const App = () => {
  return (
    <div>
      {/* <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/workouts">Workouts</Link>
      </nav> */}

      <Routes>
        <Route path='/' element={<WorkoutView />} />
        <Route path='/exercise/:id' element={<ExerciseView />} />
        <Route path='/logs' element={<LogsOverview />} />
        <Route path='/logs/:date' element={<LogsByDate />} />
      </Routes>
    </div>
  )
}

export default App
