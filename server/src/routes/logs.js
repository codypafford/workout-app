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

// GET /api/logs/overview
router.get('/overview', async (req, res) => {
  try {
    const logs = await Log.find().sort({ date: 1 }).lean(); // get all logs sorted by date

    // Reduce logs into the desired format
    const overviewMap = {};

    logs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!overviewMap[dateKey]) {
        overviewMap[dateKey] = {};
      }

      const groupName = log.groupNameSnapshot || 'Unknown Group';

      if (!overviewMap[dateKey][groupName]) {
        overviewMap[dateKey][groupName] = [];
      }

      overviewMap[dateKey][groupName].push(log.exerciseNameSnapshot || 'Unknown Exercise');
    });

    const overview = Object.entries(overviewMap).map(([date, groupsObj]) => {
      const groups = Object.entries(groupsObj).map(([name, workouts]) => ({
        name,
        workouts
      }));

      return { date, groups };
    });

    res.json(overview);
  } catch (err) {
    console.error('Error fetching overview:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/logs/charts?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/charts', async (req, res) => {
  try {
    console.log('get charts')
    const { startDate, endDate } = req.query;

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const start = startDate ? new Date(startDate) : oneYearAgo;
    const end = endDate ? new Date(endDate) : now;

    // Fetch logs in the date range
    const logs = await Log.find({
      date: { $gte: start, $lte: end },
    }).lean();

    // Aggregate by date and exercise
    const chartMap = {};

    logs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0]; // YYYY-MM-DD
      const exercise = log.exerciseNameSnapshot || 'Unknown Exercise';

      if (!chartMap[dateKey]) {
        chartMap[dateKey] = {};
      }

      if (!chartMap[dateKey][exercise]) {
        chartMap[dateKey][exercise] = 0;
      }

      chartMap[dateKey][exercise] += log.sets * log.reps * log.weight;
    });

    // Convert to sorted array with exercises as keys
    const chartData = Object.entries(chartMap)
      .map(([date, exercises]) => ({ date, ...exercises }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(chartData);
  } catch (err) {
    console.error('Error fetching chart data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/logs/:date
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params; // e.g., "2025-12-09"

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    // Match logs where date in YYYY-MM-DD format equals the param
    const logs = await Log.find({
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          date
        ]
      }
    }).sort({ groupNameSnapshot: 1 }).lean();

    // Group by groupNameSnapshot
    const overviewMap = {};
    logs.forEach(log => {
      const groupName = log.groupNameSnapshot || 'Unknown Group';
      if (!overviewMap[groupName]) overviewMap[groupName] = [];

      overviewMap[groupName].push({
        logId: log._id,
        name: log.exerciseNameSnapshot || 'Unknown Exercise',
        sets: log.sets,
        reps: log.reps,
        weight: log.weight,
        notes: log.notes || ''
      });
    });

    const groups = Object.entries(overviewMap).map(([name, workouts]) => ({
      name,
      workouts
    }));

    res.json([
      {
        date,
        groups
      }
    ]);
  } catch (err) {
    console.error('Error fetching logs by date:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE /api/logs/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Log ID is required' });
    }

    const deletedLog = await Log.findByIdAndDelete(id);

    if (!deletedLog) {
      return res.status(404).json({ message: 'Log not found' });
    }

    res.json({ message: 'Log deleted successfully', log: deletedLog });
  } catch (err) {
    console.error('Error deleting log:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router
