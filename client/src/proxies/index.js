const baseUri = import.meta.env.VITE_BASE_URI

// GROUPS
export async function getGroups() {
  const res = await fetch(`${baseUri}/api/groups`)
  return res.json()
}

export async function addWorkoutGroup(groupData) {
  try {
    const response = await fetch(`${baseUri}/api/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groupData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json() // response from your backend
  } catch (err) {
    console.error('Failed to add workout group:', err)
    throw err
  }
}

export async function deleteWorkoutGroup(groupId) {
  const res = await fetch(`${baseUri}/api/groups/${groupId}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete group')
  return res.json()
}

// --------------------
// EXERCISE
export async function fetchExercise(id) {
  const res = await fetch(`${baseUri}/api/exercises/${id}`)
  if (!res.ok) throw new Error('Failed to fetch exercise')
  return res.json()
}

export async function fetchExercises() {
  const res = await fetch(`${baseUri}/api/exercises`)
  if (!res.ok) throw new Error('Failed to fetch exercises')
  return res.json()
}

export async function addExercise(exercise) {
  const res = await fetch(`${baseUri}/api/exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise)
  })
  if (!res.ok) throw new Error('Failed to add exercise')
  return res.json()
}

export async function deleteExercise(id) {
  const res = await fetch(`${baseUri}/api/exercises/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete exercise')
  return res.json()
}

//-----------------------------
// LOGS
export async function addLog(logData) {
  try {
    const response = await fetch(`${baseUri}/api/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to save log')
    }

    return response.json() // returns the saved log
  } catch (err) {
    console.error('Error adding log:', err)
    throw err
  }
}

export async function fetchLogsOverview() {
  const res = await fetch(`${baseUri}/api/logs/overview`)
  if (!res.ok) throw new Error('Failed to fetch logs overview')
  return res.json()
}

export async function fetchLogsByDate(date) {
  const res = await fetch(`${baseUri}/api/logs/${date}`)
  if (!res.ok) throw new Error('Failed to fetch logs by date')
  return res.json()
}

export async function deleteLog(logId) {
  const res = await fetch(`${baseUri}/api/logs/${logId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete log')
  return res.json()
}

// PLANNED WORKOUT
export async function setPlannedWorkout(ids) {
  const res = await fetch(`${baseUri}/api/planned-workout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      exerciseIds: ids
    })
  })
  if (!res.ok) throw new Error('Failed to set a planned workout')
  return res.json()
}

export async function getPlannedWorkout() {
  const res = await fetch(`${baseUri}/api/planned-workout`)
  if (!res.ok) throw new Error('Failed to fetch planned workout')
  return res.json()
}
