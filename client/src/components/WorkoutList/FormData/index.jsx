import { useState } from 'react'
import { addLog } from '../../../proxies'
import './style.css'

const FormData = ({
  isExpanded,
  className,
  item,
  groupId,
  groupName,
  refresh
}) => {
  const [notes, setNotes] = useState('')
  const [highlight, setHighlight] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!isExpanded) return null

  const handleSaveLog = async () => {
    if (!notes.trim()) return // optional: don't save empty notes
    setSaving(true)
    try {
      const logPayload = {
        exerciseId: item.id,
        exerciseNameSnapshot: item.name,
        groupId,
        groupNameSnapshot: groupName,
        notes
      }

      await addLog(logPayload)

      // trigger highlight
      setHighlight(true)
      setTimeout(() => setHighlight(false), 2000)

      setNotes('')
      refresh() // reload data if needed
    } catch (err) {
      console.error('Failed to save log:', err)
      alert('Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`${className}__extra ${highlight ? `${className}__entry--highlight` : ''}`}>
      <div className={`${className}__meta`}>
        <textarea
          className={`${className}__notes-input`}
          placeholder='Add notes...'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          className={`${className}__save-btn`}
          onClick={handleSaveLog}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default FormData
