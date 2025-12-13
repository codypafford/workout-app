import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ExerciseRow from '../../components/WorkoutList'
import AddWorkoutGroupModal from '../../Modals/AddWorkoutGroup'
import {
  getGroups,
  addWorkoutGroup,
  getPlannedWorkout as getPlannedWorkouts
} from '../../proxies'
import './style.css'

const WorkoutView = () => {
  const ROOT_CN = 'workout-view'
  const [modalOpen, setModalOpen] = useState(false)
  const [focusId, setFocusId] = useState(null)
  const [groupData, setGroupData] = useState(null)
  const [allGroupData, setAllGroupData] = useState(null) // keep full list
  const [plannedExerciseIds, setPlannedExerciseIds] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  const addWorkoutGroupSubmit = async (name) => {
    await addWorkoutGroup({ name })
    fetchGroups()
  }

  const fetchGroups = async () => {
    const groups = await getGroups()
    const sortedGroups = groups
      .sort((a, b) => a.groupName.localeCompare(b.groupName))
      .map((group) => ({
        ...group,
        exercises: group.exercises.sort((a, b) => a.name.localeCompare(b.name))
      }))

    setAllGroupData(sortedGroups)
    applyTabFilter(activeTab, sortedGroups)
  }

  const fetchPlannedWorkout = async () => {
    const plannedWorkout = await getPlannedWorkouts()
    if (plannedWorkout?.exerciseIds?.length) {
      setPlannedExerciseIds(plannedWorkout.exerciseIds)
    }
  }

  const applyTabFilter = (tab, groups = allGroupData) => {
    if (!groups) return

    if (tab === 'planned') {
      const filteredGroups = groups
        .map((group) => ({
          ...group,
          exercises: group.exercises.filter((ex) =>
            plannedExerciseIds.includes(ex.id)
          )
        }))
        // remove groups with no planned exercises
        .filter((group) => group.exercises.length > 0)

      setGroupData(filteredGroups)
    } else {
      setGroupData(groups)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    applyTabFilter(tab)
  }

  useEffect(() => {
    fetchGroups()
    fetchPlannedWorkout()
  }, [])

  if (groupData == null) return <div>Loading...</div>

  return (
    <div className={`${ROOT_CN}__container`}>
      💪
      <div className={`${ROOT_CN}__header`}>
        <div className={`${ROOT_CN}__title`}>Workout Groups&nbsp;</div>
        <button onClick={() => setModalOpen(true)}>
          <span className={`${ROOT_CN}__add-icon`}>+</span>
        </button>
      </div>
      <div className={`${ROOT_CN}__planned-workout-header`}>
        <span
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => handleTabChange('all')}
        >
          View All
        </span>
        <span className='separator'>|</span>
        <span
          className={activeTab === 'planned' ? 'active' : ''}
          onClick={() => handleTabChange('planned')}
        >
          View Planned Workout
        </span>
      </div>
      <AddWorkoutGroupModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addWorkoutGroupSubmit}
      />
      {groupData.map((group) => (
        <ExerciseRow
          focusId={focusId}
          setFocusId={setFocusId}
          id={group.id}
          items={group.exercises}
          key={group.id}
          groupName={group.groupName}
          refresh={fetchGroups}
          plannedExerciseIds={plannedExerciseIds}
          isPlanned={activeTab == 'planned'}
        />
      ))}
    </div>
  )
}

export default WorkoutView
