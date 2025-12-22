export const STRATEGIES = {
  /**
   * Pyramid strategy
   *
   * Rules:
   * - Uses data from `last`
   * - Sorts by reps DESC
   * - Set 1 = highest reps
   * - Set 2 = 2nd highest reps
   * - Set 3 = lowest reps (max weight set)
   *
   * Returns exactly 3 sets when possible
   */
  pyramid: {
    label: 'Pyramid Strategy',
    generate: (lastSets = []) => {
      if (!Array.isArray(lastSets) || lastSets.length === 0) {
        return [
          { reps: '', weight: '' },
          { reps: '', weight: '' },
          { reps: '', weight: '' }
        ]
      }

      // Normalize & sort by reps descending
      const sorted = [...lastSets]
        .map((l) => ({
          reps: Number(l.reps),
          weight: Number(l.weight)
        }))
        .filter((l) => l.reps && l.weight)
        .sort((a, b) => b.reps - a.reps)

      if (!sorted.length) {
        return [
          { reps: '', weight: '' },
          { reps: '', weight: '' },
          { reps: '', weight: '' }
        ]
      }

      const first = sorted[0]
      const second = sorted[1] ?? first
      const third = sorted[sorted.length - 1]

      return [
        { reps: first.reps, weight: first.weight },
        { reps: second.reps, weight: second.weight },
        { reps: third.reps, weight: third.weight }
      ]
    },
    increase: ({ prevSets, lastSets }) => {
      if (!lastSets?.length) return prevSets

      const targetReps = [16, 12, 8]

      const firstRun = prevSets.some((s, i) => Number(s.reps) !== targetReps[i])

      if (firstRun) {
        return targetReps.map((target) => {
          const closest = lastSets.reduce((prev, curr) =>
            Math.abs(curr.reps - target) < Math.abs(prev.reps - target)
              ? curr
              : prev
          )

          let weight = Number(closest.weight)
          if (closest.reps >= target) weight += 10

          return { reps: target, weight }
        })
      }

      // subsequent clicks
      return prevSets.map((s) => ({
        reps: Number(s.reps),
        weight: Number(s.weight) + 10
      }))
    }
  },
  straight: {
    label: 'Straight Sets',

    generate: (lastSets = []) => {
      if (!Array.isArray(lastSets) || lastSets.length === 0) {
        return [
          { reps: '', weight: '' },
          { reps: '', weight: '' },
          { reps: '', weight: '' }
        ]
      }

      const normalized = lastSets
        .map((l) => ({
          reps: Number(l.reps),
          weight: Number(l.weight)
        }))
        .filter((l) => l.reps && l.weight)

      if (!normalized.length) {
        return [
          { reps: '', weight: '' },
          { reps: '', weight: '' },
          { reps: '', weight: '' }
        ]
      }

      // --- reps = mode (most common), fallback to first ---
      const repsFrequency = normalized.reduce((acc, s) => {
        acc[s.reps] = (acc[s.reps] || 0) + 1
        return acc
      }, {})

      console.log('repsFreq', repsFrequency)
      const reps = Number(
        Object.entries(repsFrequency).sort((a, b) => b[1] - a[1])[0][0]
      )

      // --- weight = average ---
      const avgWeight =
        normalized.reduce((sum, s) => sum + s.weight, 0) / normalized.length

      const weight = Math.round(avgWeight / 5) * 5 // snap to plates

      return Array.from({ length: 3 }, () => ({
        reps,
        weight
      }))
    },

    increase: ({ prevSets }) => {
      if (!prevSets?.length) return prevSets

      return prevSets.map((s) => ({
        reps: Number(s.reps),
        weight: Number(s.weight) + 5
      }))
    }
  },
  reversePyramid: {
    label: 'Reverse Pyramid',
    generate: (lastSets = []) => {
      if (!Array.isArray(lastSets) || lastSets.length === 0) {
        return [
          { reps: '', weight: '' },
          { reps: '', weight: '' },
          { reps: '', weight: '' }
        ]
      }

      // Normalize & sort by reps ascending (heaviest first)
      const sorted = [...lastSets]
        .map((l) => ({ reps: Number(l.reps), weight: Number(l.weight) }))
        .filter((l) => l.reps && l.weight)
        .sort((a, b) => a.reps - b.reps) // low reps first

      if (!sorted.length) {
        return [
          { reps: '', weight: '' },
          { reps: '', weight: '' },
          { reps: '', weight: '' }
        ]
      }

      const first = sorted[0]
      const second = sorted[1] ?? first
      const third = sorted[sorted.length - 1]

      return [
        { reps: first.reps, weight: first.weight },
        { reps: second.reps, weight: second.weight },
        { reps: third.reps, weight: third.weight }
      ]
    },
    increase: ({ prevSets, lastSets }) => {
      if (!lastSets?.length) return prevSets

      const targetReps = [8, 10, 12] // fewer reps first, then increase

      const firstRun = prevSets.some((s, i) => Number(s.reps) !== targetReps[i])

      if (firstRun) {
        return targetReps.map((target) => {
          const closest = lastSets.reduce((prev, curr) =>
            Math.abs(curr.reps - target) < Math.abs(prev.reps - target)
              ? curr
              : prev
          )

          let weight = Number(closest.weight)
          if (closest.reps >= target) weight += 10

          return { reps: target, weight }
        })
      }

      // subsequent clicks: add +5 lbs per set
      return prevSets.map((s) => ({
        reps: Number(s.reps),
        weight: Number(s.weight) + 5
      }))
    }
  }
}
