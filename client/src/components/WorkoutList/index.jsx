import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AddWorkoutModal from '../../Modals/AddWorkout'
import FormData from './FormData'
import './style.css'

const WorkoutList = ({ id, items, groupName, focusId, setFocusId }) => {
  const ROOT_CN = 'workout-list'

  const [expandedItemId, setExpandedItemId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState(null) // new state for image modal

  const rowRefs = useRef({})

  const [exerciseItems, setExerciseItems] = useState(items) // local copy

  const toggleItem = (id) => {
    setExpandedItemId((prev) => (prev === id ? null : id))
  }

  const handleImageUpload = (e, id) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setExerciseItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, image: reader.result } : item
        )
      )
    }
    reader.readAsDataURL(file)
    // TODO: would call async method to upload image from here
  }

  useEffect(() => {
    if (expandedItemId && rowRefs.current[expandedItemId]) {
      rowRefs.current[expandedItemId].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [expandedItemId])

  const deleteGroup = (e) => {
    console.log('delete this group: ', e)
    // TODO: this would not delete any data. It would just mark the group is not active so that I can keep all the logs associated with it and would hide it from UI
  }

  if (focusId && focusId !== id) {
    return <></>
  }

  const inStartMode = focusId === id

  return (
    <div className={ROOT_CN}>
      {/* Group Header */}
      <div className={`${ROOT_CN}__header`}>
        <div onClick={() => {
          if (inStartMode) {
            setFocusId(null)
          } else {
            setFocusId(id)
          }
        }}>{inStartMode ? 'Stop' : 'Start'}</div>
        <div className={`${ROOT_CN}__col ${ROOT_CN}__col--name`}>
          {groupName}
        </div>
        <div onClick={deleteGroup} className={`${ROOT_CN}__trash`}>
          🗑️
        </div>
      </div>

      <div className={`${ROOT_CN}__body`}>
        <div className={`${ROOT_CN}__meta`}>
          <button onClick={() => setModalOpen(true)}>+ Add Exercise</button>
        </div>

        {exerciseItems.map((item) => {
          const isExpanded = expandedItemId === item.id

          return (
            <div
              key={item.id}
              className={`${ROOT_CN}__item-container`}
              ref={(el) => (rowRefs.current[item.id] = el)}
            >
              <AddWorkoutModal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
              />

              {/* Main Row */}
              <div className={`${ROOT_CN}__row`}>
                <div className={`${ROOT_CN}__col ${ROOT_CN}__col--name`}>
                  <span
                    className={`${ROOT_CN}__expand-name`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {item.name}&nbsp;
                    <span className={`${ROOT_CN}__arrow`}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </span>
                </div>

                <div className={`${ROOT_CN}__col ${ROOT_CN}__col--link`}>
                  <Link
                    to={`/exercise/${item.id}`}
                    className={`${ROOT_CN}__view-link`}
                  >
                    View All Progress
                  </Link>
                </div>
                <div className={`${ROOT_CN}__col ${ROOT_CN}__col--thumb`}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt='thumb'
                      className={`${ROOT_CN}__thumb`}
                      onClick={(e) => {
                        e.stopPropagation() // prevent expanding the row
                        setEnlargedImage(item.image)
                      }}
                    />
                  ) : (
                    <>
                      <button
                        className={`${ROOT_CN}__add-thumb-btn`}
                        onClick={(e) => {
                          e.stopPropagation()
                          document
                            .getElementById(`img-input-${item.id}`)
                            .click()
                        }}
                      >
                        +
                      </button>
                      <input
                        id={`img-input-${item.id}`}
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(e, item.id)}
                      />
                    </>
                  )}
                </div>
              </div>

              <FormData
                isExpanded={isExpanded}
                className={ROOT_CN}
                item={item}
              />

              {/* Image Modal */}
              {enlargedImage && (
                <div
                  className={`${ROOT_CN}__image-modal`}
                  onClick={() => setEnlargedImage(null)}
                >
                  <img
                    src={enlargedImage}
                    alt='Enlarged'
                    className={`${ROOT_CN}__image-modal-content`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WorkoutList
