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
export const pyramidStrategy = (last = []) => {
  if (!Array.isArray(last) || last.length === 0) {
    return [
      { reps: '', weight: '' },
      { reps: '', weight: '' },
      { reps: '', weight: '' }
    ]
  }

  // Normalize & sort by reps descending
  const sorted = [...last]
    .map(l => ({
      reps: Number(l.reps),
      weight: Number(l.weight)
    }))
    .filter(l => l.reps && l.weight)
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
}
