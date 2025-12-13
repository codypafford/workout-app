import { useEffect, useState } from 'react'
import { getGroups, setPlannedWorkout, getPlannedWorkout } from '../../proxies'
import './style.css'

const PlanWorkout = () => {
  const [groupData, setGroupData] = useState(null)
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  const fetchGroups = () => {
    getGroups().then((x) => {
      const sortedGroups = x.sort((a, b) => {
        a.exercises = a.exercises.sort((a, b) => a.name.localeCompare(b.name))
        return a.groupName.localeCompare(b.groupName)
      })
      setGroupData(sortedGroups)
    })
  }

    const fetchPlannedWorkout = async () => {
    const plannedWorkout = await getPlannedWorkout()
    if (plannedWorkout?.exerciseIds?.length) {
      setSelectedExerciseIds(plannedWorkout.exerciseIds)
    }
  }

  const toggleExercise = (exerciseId) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }

  const handleSave = async () => {
    const confirmed = window.confirm(
      `Save this workout with ${selectedExerciseIds.length} exercises?`
    )

    if (!confirmed) return

    try {
      setIsSaving(true)
      await setPlannedWorkout(selectedExerciseIds)
      alert('Workout saved!')
    } catch (err) {
      console.error(err)
      alert('Failed to save workout.')
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    fetchGroups()
    fetchPlannedWorkout()
  }, [])

  if (groupData == null) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className='planned-workout__header'>
        <h2>Plan Your Next Workout</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className='planned-workout__save-btn'
        >
          {isSaving ? 'Saving...' : 'Save Workout'}
        </button>
      </div>

      {groupData.map((group) => (
        <div key={group.groupName}>
          <hr />
          <h3>{group.groupName}</h3>

          {group.exercises.map((e) => {
            const checked = selectedExerciseIds.includes(e.id)

            return (
              <div key={e.id} className='planned-workout__container'>
                <div className='planned-workout__row'>
                  <div className='planned-workout__row-tem'>{e.name}</div>
                  <div className='planned-workout__row-tem'>
                    <input
                      type='checkbox'
                      checked={checked}
                      onChange={() => toggleExercise(e.id)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}

export default PlanWorkout
