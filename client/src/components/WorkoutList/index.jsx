import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AddWorkoutModal from '../../Modals/AddWorkout'
import ConfirmModal from '../../Modals/Confirmation'
import FormData from './FormData'
import { deleteWorkoutGroup, addExercise, addLog } from '../../proxies'
import './style.css'

const WorkoutList = ({
  id,
  items: exerciseItems,
  groupName,
  groupType,
  focusId,
  setFocusId,
  refresh,
  isPlanned = false
}) => {
  const ROOT_CN = 'workout-list'

  const [expandedItemId, setExpandedItemId] = useState(null)
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [doneExercises, setDoneExercises] = useState({})

  const rowRefs = useRef({})

  // Initialize doneExercises from API data
  useEffect(() => {
    const initialDone = {}
    exerciseItems.forEach((item) => {
      // if there are any logs for today, mark it done
      if (item.today && item.today.length > 0) {
        initialDone[item.id] = true
      }
    })
    setDoneExercises(initialDone)
  }, [exerciseItems])

  // Toggle row expand
  const toggleItem = (exerciseId) => {
    setExpandedItemId((prev) => (prev === exerciseId ? null : exerciseId))
  }

  // Handle scrolling to expanded row
  useEffect(() => {
    if (expandedItemId && rowRefs.current[expandedItemId]) {
      const element = rowRefs.current[expandedItemId]
      const bannerOffset = 60
      const elementTop = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementTop - bannerOffset,
        behavior: 'smooth'
      })
    }
  }, [expandedItemId])

  // Backend actions
  const deleteGroup = async () => {
    await deleteWorkoutGroup(id)
    await refresh()
  }

  const onAddExercise = async (exercise) => {
    await addExercise({ ...exercise, groupId: id })
    await refresh()
  }

  const handleMarkDone = async (item) => {
    console.log(item)
    try {
      if (groupType !== 'exercise') {
        setDoneExercises({
          ...doneExercises,
          [item.id]: true
        })
        return
      }
      await addLog({
        exerciseId: item.id,
        exerciseNameSnapshot: item.name,
        groupId: id,
        groupNameSnapshot: groupName
      })
      await refresh()
    } catch (err) {
      console.error('Failed to mark as done', err)
    }
  }

  const openGoogleSearch = (term) => {
    window.open(
      `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(term)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  if (focusId && focusId !== id) return null
  const inStartMode = focusId === id

  return (
    <div className={ROOT_CN}>
      {/* Header */}
      <div className={`${ROOT_CN}__header`}>
        {!isPlanned && (
          <button
            className={`${ROOT_CN}__start-btn ${
              inStartMode ? 'is-active' : ''
            }`}
            onClick={() => setFocusId(inStartMode ? null : id)}
          >
            {inStartMode ? 'Stop' : 'Start'}
          </button>
        )}

        <div className={`${ROOT_CN}__title`}>
          {groupName}
          <span>
            <Link
              to={`/group/${id}`}
              className={`${ROOT_CN}__view-link`}
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '18px' }}
            >
              ⚙
            </Link>
          </span>
        </div>

        {!isPlanned && (
          <button
            className={`${ROOT_CN}__icon-btn danger`}
            onClick={() => setConfirmModalOpen(true)}
            aria-label='Delete workout group'
          >
            🗑️
          </button>
        )}
      </div>

      {/* Meta / Add Exercise */}
      {!isPlanned && (
        <div className={`${ROOT_CN}__meta`}>
          <button onClick={() => setExerciseModalOpen(true)}>
            {`+ Add ${groupType === 'exercise' ? 'Exercise' : 'Stretch'}`}
          </button>
        </div>
      )}

      {/* Modals */}
      <AddWorkoutModal
        show={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        onAdd={onAddExercise}
      />
      <ConfirmModal
        show={confirmModalOpen}
        header='Delete Group?'
        bodyText='This action cannot be undone.'
        onClose={() => setConfirmModalOpen(false)}
        onSubmit={deleteGroup}
      />

      {/* Exercises */}
      <div className={`${ROOT_CN}__body`}>
        {exerciseItems.map((item) => {
          const isExpanded = expandedItemId === item.id
          const isDone = doneExercises[item.id]

          return (
            <div
              key={item.id}
              className={`${ROOT_CN}__item-container`}
              ref={(el) => (rowRefs.current[item.id] = el)}
            >
              {/* Row */}
              <div
                className={`${ROOT_CN}__row`}
                onClick={() => toggleItem(item.id)}
              >
                <div className={`${ROOT_CN}__name`}>
                  <span
                    className={`${ROOT_CN}__expand-name ${
                      isDone ? `${ROOT_CN}__expand-name--done` : ''
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                <div className={`${ROOT_CN}__actions`}>
                  <button
                    className={`${ROOT_CN}__done-btn`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMarkDone(item)
                    }}
                    aria-label='Mark exercise as done'
                  >
                    ✅
                  </button>
                  <button
                    className={`${ROOT_CN}__icon-btn`}
                    onClick={(e) => {
                      e.stopPropagation()
                      openGoogleSearch(item.name)
                    }}
                    aria-label='Search exercise'
                  >
                    🔍
                  </button>
                  {groupType === 'exercise' && (
                    <span
                      className={`${ROOT_CN}__chevron ${
                        isExpanded ? 'is-expanded' : ''
                      }`}
                    >
                      ▶
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {groupType === 'exercise' && (
                <FormData
                  isExpanded={isExpanded}
                  className={ROOT_CN}
                  item={item}
                  groupId={id}
                  groupName={groupName}
                  refresh={refresh}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WorkoutList
