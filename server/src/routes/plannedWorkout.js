import { Router } from 'express'
import PlannedWorkout from '../models/plannedWorkout.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const plannedWorkout = await PlannedWorkout.findOne({})
    res.json(plannedWorkout)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch planned workout' })
  }
})

router.post('/', async (req, res) => {
  try {
    const ids = req.body.exerciseIds ?? []
    const plannedWorkout = await PlannedWorkout.findOneAndUpdate(
      {}, // match the single doc
      { exerciseIds: ids }, // replace the list
      {
        new: true, // return updated doc
        upsert: true // create if it doesn’t exist
      }
    )

    res.status(200).json(plannedWorkout)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to save planned workout' })
  }
})

export default router
