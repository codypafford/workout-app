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

  const applyTabFilter = (
    tab,
    groups = allGroupData,
    plannedIds = plannedExerciseIds
  ) => {
    if (!groups) return

    if (tab === 'planned') {
      const filteredGroups = groups
        .map((group) => ({
          ...group,
          exercises: group.exercises.filter((ex) => plannedIds.includes(ex.id))
        }))
        .filter((group) => group.exercises.length > 0)

      setGroupData(filteredGroups)
    } else {
      setGroupData(groups)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    applyTabFilter(tab)
    localStorage.setItem('workoutActiveTab', tab) // store current tab
  }

  // Initial load
  useEffect(() => {
    const savedTab = localStorage.getItem('workoutActiveTab') || 'all'
    setActiveTab(savedTab)

    const loadData = async () => {
      const groups = await getGroups()
      const sortedGroups = groups
        .sort((a, b) => a.groupName.localeCompare(b.groupName))
        .map((group) => ({
          ...group,
          exercises: group.exercises.sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        }))
      setAllGroupData(sortedGroups)

      const plannedWorkout = await getPlannedWorkouts()
      const ids = plannedWorkout?.exerciseIds ?? []
      setPlannedExerciseIds(ids)

      // Now we can safely filter with both groups and planned IDs
      applyTabFilter(savedTab, sortedGroups, ids)
    }

    loadData()
  }, [])

  if (groupData == null) return <div>Loading...</div>

  return (
    <div className={`${ROOT_CN}__container`}>
      💪
      <div className={`${ROOT_CN}__header`}>
        <div className={`${ROOT_CN}__title`}>Workout Groups&nbsp;</div>
        {activeTab == 'all' && (
          <button onClick={() => setModalOpen(true)}>
            <span className={`${ROOT_CN}__add-icon`}>+</span>
          </button>
        )}
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
      {/* TODO: the below component really should eb called GroupData */}
      {groupData.map((group) => (
        <ExerciseRow
          focusId={focusId}
          setFocusId={setFocusId}
          id={group.id}
          items={group.exercises}
          key={group.id}
          groupName={group.groupName}
          groupType={group.groupType}
          refresh={fetchGroups}
          plannedExerciseIds={plannedExerciseIds}
          isPlanned={activeTab == 'planned'}
        />
      ))}
    </div>
  )
}

export default WorkoutView
