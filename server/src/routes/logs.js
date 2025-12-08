import { Router } from 'express'
import Group from '../models/groups.js'
import Exercise from '../models/exercises.js'
import Log from '../models/logs.js'
const router = Router()
// POST /api/logs
router.post('/', async (req, res) => {
  try {
    const { exerciseId, exerciseNameSnapshot, groupId, groupNameSnapshot, sets, reps, weight, date } = req.body;

    if (!exerciseId || !groupId || !sets || !reps || !weight) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const log = new Log({
      exerciseId,
      exerciseNameSnapshot,
      groupId,
      groupNameSnapshot,
      sets,
      reps,
      weight,
      date: date ? new Date(date) : new Date(),
    });

    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (err) {
    console.error('Error creating log:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router
