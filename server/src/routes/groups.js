// routes/groupRoutes.js
import { Router } from 'express'
import moment from 'moment-timezone'
import Group from '../models/groups.js'
import Exercise from '../models/exercises.js'
import Log from '../models/logs.js'
const router = Router()

// GET all active groups with exercises and today's logs
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find({ isActive: true })
      .populate({
        path: 'exerciseIds',
        match: { isActive: true } // only active exercises
      })
      .lean()

    const groupIds = groups.map((g) => g._id)

    // Today's logs
    const easternTodayStart = moment
      .tz('America/New_York')
      .startOf('day')
      .toDate()
    const easternTomorrowStart = moment
      .tz('America/New_York')
      .add(1, 'day')
      .startOf('day')
      .toDate()

    const todayLogs = await Log.find({
      groupId: { $in: groupIds },
      date: { $gte: easternTodayStart, $lt: easternTomorrowStart }
    }).lean()

    const transformed = groups.map((group) => ({
      id: group._id,
      groupName: group.name,
      groupType: group.groupType ?? 'exercise',
      exercises: group.exerciseIds.map((exercise) => {
        const todayLogsForExercise = todayLogs
          .filter(
            (log) =>
              log.exerciseId.toString() === exercise._id.toString() &&
              log.groupId.toString() === group._id.toString()
          )
          .map((log) => ({
            logId: log._id,
            notes: log.notes || '',
            date: log.date
          }))

        return {
          id: exercise._id,
          name: exercise.name,
          image: exercise.photo || '',
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

// GET single group by ID with exercises
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const group = await Group.findOne({ _id: id, isActive: true })
      .populate({ path: 'exerciseIds', match: { isActive: true } })
      .lean()

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const exercises = group.exerciseIds.map((exercise) => ({
      id: exercise._id,
      name: exercise.name,
      image: exercise.photo || ''
    }))

    res.json({
      id: group._id,
      groupName: group.name,
      groupType: group.groupType ?? 'exercise',
      exercises
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/groups/:id/type
router.put('/:id/type', async (req, res) => {
  try {
    const { id } = req.params
    const { groupType } = req.body

    // Validate input
    if (!['exercise', 'stretch'].includes(groupType)) {
      return res.status(400).json({ message: 'Invalid group type' })
    }

    const group = await Group.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: { groupType } },
      { new: true }
    ).lean()

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    res.json({
      id: group._id,
      groupType: group.groupType
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Remove exercise from group
router.post('/:id/remove-exercise', async (req, res) => {
  try {
    const { id } = req.params
    const { exerciseId } = req.body

    const group = await Group.findById(id)
    if (!group) return res.status(404).json({ message: 'Group not found' })

    group.exerciseIds = group.exerciseIds.filter(
      (eId) => eId.toString() !== exerciseId
    )

    const updatedGroup = await group.save()
    res.json({ message: 'Exercise removed from group', group: updatedGroup })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create new group
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    if (!name)
      return res.status(400).json({ message: 'Group name is required' })

    const newGroup = new Group({ name })
    const savedGroup = await newGroup.save()
    res.status(201).json(savedGroup)
  } catch (err) {
    console.error('Error creating group:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete or deactivate group
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const group = await Group.findById(id)
    if (!group) return res.status(404).json({ message: 'Group not found' })

    if (!group.exerciseIds || group.exerciseIds.length === 0) {
      const result = await Group.findByIdAndDelete(id)
      return res.json({ message: 'Group fully deleted', deletedGroup: result })
    } else {
      group.isActive = false
      const result = await group.save()
      return res.json({ message: 'Group marked as inactive', group: result })
    }
  } catch (err) {
    console.error('Error deleting group:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
