import { Routes, Route, Link } from 'react-router-dom'
import WorkoutView from './views/WorkoutView/WorkoutView'
import ExerciseView from './views/ExerciseView'
import ExercisesView from './views/ExercisesView'
import LogsOverview from './views/LogsOverview'
import LogsByDate from './views/LogsByDate'
import './App.css'

const App = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/logs">Logs</Link> | <Link to="/exercises">Exercises</Link>
      </nav>

      <Routes>
        <Route path='/' element={<WorkoutView />} />
        <Route path='/exercise/:id' element={<ExerciseView />} />
        <Route path='/exercises' element={<ExercisesView />} />
        <Route path='/logs' element={<LogsOverview />} />
        <Route path='/logs/:date' element={<LogsByDate />} />
      </Routes>
    </div>
  )
}

export default App
