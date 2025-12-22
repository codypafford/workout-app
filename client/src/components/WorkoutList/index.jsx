import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AddWorkoutModal from '../../Modals/AddWorkout'
import ConfirmModal from '../../Modals/Confirmation'
import FormData from './FormData'
import { deleteWorkoutGroup, addExercise } from '../../proxies'
import './style.css'

const WorkoutList = ({
  id,
  items: exerciseItems,
  groupName,
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

  const toggleItem = (exerciseId) => {
    setExpandedItemId((prev) => (prev === exerciseId ? null : exerciseId))
  }

  const markAsDone = (exerciseId) => {
    setDoneExercises((prev) => ({ ...prev, [exerciseId]: true }))
  }

  useEffect(() => {
    if (expandedItemId && rowRefs.current[expandedItemId]) {
      const element = rowRefs.current[expandedItemId]
      const bannerOffset = 60 // height of your banner in px

      // get element's position relative to document
      const elementTop = element.getBoundingClientRect().top + window.scrollY

      // scroll to element minus banner height
      window.scrollTo({
        top: elementTop - bannerOffset,
        behavior: 'smooth'
      })
    }
  }, [expandedItemId])

  const deleteGroup = async () => {
    await deleteWorkoutGroup(id)
    await refresh()
  }

  const onAddExercise = async (exercise) => {
    await addExercise({ ...exercise, groupId: id })
    await refresh()
  }

  const openGoogleSearch = (searchTerm) => {
    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
      searchTerm
    )}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (focusId && focusId !== id) {
    return null
  }

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
          {groupName}{' '}
          <span>
            {' '}
            <Link
              style={{ fontSize: '18px' }}
              to={`/group/${id}`}
              className={`${ROOT_CN}__view-link`}
              onClick={(e) => e.stopPropagation()}
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

      {/* Body */}
      <div className={`${ROOT_CN}__body`}>
        {!isPlanned && (
          <div className={`${ROOT_CN}__meta`}>
            <button onClick={() => setExerciseModalOpen(true)}>
              + Add Exercise
            </button>
          </div>
        )}

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

        {exerciseItems.map((item) => {
          const isExpanded = expandedItemId === item.id

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
                      doneExercises[item.id]
                        ? `${ROOT_CN}__expand-name--done`
                        : ''
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                <div className={`${ROOT_CN}__actions`}>
                  <Link
                    to={`/exercise/${item.id}`}
                    className={`${ROOT_CN}__view-link`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Progress
                  </Link>

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

                  <span
                    className={`${ROOT_CN}__chevron ${
                      isExpanded ? 'is-expanded' : ''
                    }`}
                  >
                    ▶
                  </span>
                </div>
              </div>

              {/* Expanded content */}
              <FormData
                isExpanded={isExpanded}
                className={ROOT_CN}
                item={item}
                groupId={id}
                groupName={groupName}
                refresh={refresh}
                markAsDone={markAsDone}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WorkoutList
