import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ExerciseRow from '../../components/WorkoutList'
import AddWorkoutGroupModal from '../../Modals/AddWorkoutGroup'
import { getGroups, addWorkoutGroup } from '../../proxies'
import './style.css'

const WorkoutView = () => {
  const ROOT_CN = 'workout-view'
  const [modalOpen, setModalOpen] = useState(false) // state for modal
  const [focusId, setFocusId] = useState(null)
  const [groupData, setGroupData] = useState(null)

  const addWorkoutGroupSubmit = async (name) => {
    await addWorkoutGroup({ name })
    fetchGroups()
  }

  const fetchGroups = () => {
    getGroups().then((x) => {
      const sortedGroups = x.sort((a, b) =>
        a.groupName.localeCompare(b.groupName)
      )
      setGroupData(sortedGroups)
      console.log('setting new group data: ', sortedGroups)
    })
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  if (groupData == null) {
    return <div>Loading...</div>
  }
  console.log('pass this downstream: ', groupData)
  return (
    <div className={`${ROOT_CN}__container`}>
      💪
      <div className={`${ROOT_CN}__header`}>
        <div className={`${ROOT_CN}__title`}>Workout Groups&nbsp;</div>

        <button onClick={() => setModalOpen(true)}>
          <span className={`${ROOT_CN}__add-icon`}>+</span>
        </button>
      </div>
      <AddWorkoutGroupModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addWorkoutGroupSubmit}
      />
      {groupData.map((group) => {
        return (
          <ExerciseRow
            focusId={focusId}
            setFocusId={setFocusId}
            id={group.id}
            items={group.exercises}
            key={group.id}
            groupName={group.groupName}
            refresh={fetchGroups}
          />
        )
      })}
    </div>
  )
}

export default WorkoutView
