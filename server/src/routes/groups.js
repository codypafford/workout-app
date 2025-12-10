// routes/groupRoutes.js
import { Router } from 'express'
import Group from '../models/groups.js'
import Exercise from '../models/exercises.js'
import Log from '../models/logs.js'
const router = Router()

router.get('/', async (req, res) => {
  try {
    const groups = await Group.find({ isActive: true })
      .populate({
        path: 'exerciseIds',
        match: { isActive: true } // only populate active exercises
      })
      .lean()

    const groupIds = groups.map((g) => g._id)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(todayStart.getDate() + 1)

    // Fetch today's logs only
    const todayLogs = await Log.find({
      groupId: { $in: groupIds },
      date: { $gte: todayStart, $lt: tomorrowStart }
    }).lean()

    // Fetch the most recent logs before today per group/exercise
    const lastLogsAggregate = await Log.aggregate([
      { $match: { groupId: { $in: groupIds }, date: { $lt: todayStart } } },
      { $sort: { date: -1 } }, // newest first
      {
        $group: {
          _id: { groupId: '$groupId', exerciseId: '$exerciseId' },
          logs: {
            $push: {
              sets: '$sets',
              reps: '$reps',
              weight: '$weight',
              date: '$date'
            }
          },
          mostRecentDate: { $first: '$date' }
        }
      }
    ])

    // Convert aggregate results into a lookup map for faster access
    const lastLogsMap = new Map()
    lastLogsAggregate.forEach((entry) => {
      lastLogsMap.set(
        `${entry._id.groupId}-${entry._id.exerciseId}`,
        entry.logs.filter(
          (log) =>
            new Date(log.date).setHours(0, 0, 0, 0) ===
            new Date(entry.mostRecentDate).setHours(0, 0, 0, 0)
        )
      )
    })

    // Transform groups and exercises
    const transformed = groups.map((group) => ({
      id: group._id,
      groupName: group.name,
      exercises: group.exerciseIds.map((exercise) => {
        // Today's logs for this exercise
        const todayLogsForExercise = todayLogs
          .filter(
            (log) =>
              log.exerciseId.toString() === exercise._id.toString() &&
              log.groupId.toString() === group._id.toString()
          )
          .map((log) => ({
            sets: log.sets,
            reps: log.reps,
            weight: log.weight,
            logId: log._id
          }))

        // Last logs (combine sets with same reps/weight)
        const lastLogsForExerciseRaw =
          lastLogsMap.get(`${group._id}-${exercise._id}`) || []
        const combinedLastLogsMap = new Map()
        lastLogsForExerciseRaw.forEach((log) => {
          const key = `${log.reps}-${log.weight}`
          combinedLastLogsMap.set(
            key,
            (combinedLastLogsMap.get(key) || 0) + log.sets
          )
        })
        const lastLogsForExercise = Array.from(
          combinedLastLogsMap.entries()
        ).map(([key, sets]) => {
          const [reps, weight] = key.split('-').map(Number)
          return { sets, reps, weight }
        })

        return {
          id: exercise._id,
          name: exercise.name,
          image: exercise.photo || '',
          last: lastLogsForExercise.reverse(), // reverse because we had to order it the wrong way for mostRecentDate
          today: todayLogsForExercise
        }
      })
    }))

    res.json(transformed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' })
    }

    // Create new group with just the name
    const newGroup = new Group({ name })

    const savedGroup = await newGroup.save()

    res.status(201).json(savedGroup)
  } catch (err) {
    console.error('Error creating group:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Find the group first
    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    let result
    if (!group.exerciseIds || group.exerciseIds.length === 0) {
      // No exercises → fully delete
      result = await Group.findByIdAndDelete(id)
      return res.json({ message: 'Group fully deleted', deletedGroup: result })
    } else {
      // Has exercises → soft delete
      group.isActive = false
      result = await group.save()
      return res.json({ message: 'Group marked as inactive', group: result })
    }
  } catch (err) {
    console.error('Error deleting group:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
