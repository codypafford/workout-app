import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  getGroupById,
  removeExerciseFromGroup,
  updateGroupType
} from '../../proxies'
import './style.css'

const ModifyGroupView = () => {
  const { id } = useParams()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState({})
  const [savingType, setSavingType] = useState(false)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroupById(id)
        setGroup(data)
      } catch (err) {
        console.error('Failed to fetch group:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [id])

  const handleGroupTypeChange = async (newType) => {
    if (!group || newType === group.groupType) return

    const prevType = group.groupType
    setGroup((g) => ({ ...g, groupType: newType }))
    setSavingType(true)

    try {
      await updateGroupType(group.id, newType)
    } catch (err) {
      console.error('Failed to update group type:', err)
      // rollback
      setGroup((g) => ({ ...g, groupType: prevType }))
    } finally {
      setSavingType(false)
    }
  }

  const handleRemoveExercise = async (exerciseId) => {
    if (!group) return

    setRemoving((prev) => ({ ...prev, [exerciseId]: true }))

    try {
      await removeExerciseFromGroup(group.id, exerciseId)
      setGroup((prev) => ({
        ...prev,
        exercises: prev.exercises.filter((e) => e.id !== exerciseId)
      }))
    } catch (err) {
      console.error('Failed to remove exercise:', err)
    } finally {
      setRemoving((prev) => ({ ...prev, [exerciseId]: false }))
    }
  }

  if (loading)
    return <div className='modify-group__loading'>Loading group...</div>
  if (!group) return <div className='modify-group__error'>Group not found</div>

  return (
    <div className='modify-group'>
      <h2 className='modify-group__title'>{group.groupName}</h2>

      {/* 🔽 NEW: Group Type Selector */}
      <div className='modify-group__type'>
        <label>
          Workout Type:
          <select
            value={group.groupType ?? 'exercise'}
            onChange={(e) => handleGroupTypeChange(e.target.value)}
            disabled={savingType}
            style={{ marginLeft: '8px' }}
          >
            <option value='exercise'>Exercise</option>
            <option value='stretch'>Stretch</option>
          </select>
        </label>
        {savingType && <span className='modify-group__saving'>Saving...</span>}
      </div>

      {group.exercises.length === 0 && (
        <p className='modify-group__empty'>No exercises in this group.</p>
      )}

      <ul className='modify-group__list'>
        {group.exercises.map((exercise) => (
          <li key={exercise.id} className='modify-group__item'>
            <span className='modify-group__name'>{exercise.name}</span>
            <button
              className={`modify-group__remove-btn ${
                removing[exercise.id]
                  ? 'modify-group__remove-btn--disabled'
                  : ''
              }`}
              onClick={() => handleRemoveExercise(exercise.id)}
              disabled={removing[exercise.id]}
            >
              {removing[exercise.id] ? 'Removing...' : 'Remove'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ModifyGroupView
