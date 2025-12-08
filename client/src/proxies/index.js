// GROUPS
export async function getGroups() {
  const res = await fetch('/api/groups');
  return res.json();
}

export async function addWorkoutGroup(groupData) {
  try {
    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json(); // response from your backend
  } catch (err) {
    console.error('Failed to add workout group:', err);
    throw err;
  }
}

export async function deleteWorkoutGroup(groupId) {
    console.log('send this id: ', groupId)
  const res = await fetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete group');
  return res.json();
}

// --------------------
// EXERCISE
export async function fetchExercises() {
  const res = await fetch('/api/exercises');
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

export async function addExercise(exercise) {
  const res = await fetch('/api/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise)
  });
  if (!res.ok) throw new Error('Failed to add exercise');
  return res.json();
}

//-----------------------------
// LOGS
export async function addLog(logData) {
  try {
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save log');
    }

    return response.json(); // returns the saved log
  } catch (err) {
    console.error('Error adding log:', err);
    throw err;
  }
};

