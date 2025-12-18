export const ExerciseTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  const value = payload[0].value
  const key = payload[0].name
  const currMetaData = payload[0].payload._meta[key]

  return (
    <div className="charts-view__tooltip">
      <div className="charts-view__tooltip-date">{label}</div>

      {value != null && (
        <>
          <div className="charts-view__tooltip-title">
            {payload[0].name}
          </div>

          <div className="charts-view__tooltip-total">
            Total: {value.toLocaleString()} lbs
          </div>

          {currMetaData?.sets?.length > 0 && (
            <div className="charts-view__tooltip-sets">
              {currMetaData.sets.map((s, idx) => (
                <div key={idx} className="charts-view__tooltip-set">
                  <span>Set {idx + 1}</span>
                  <span>{s.reps} × {s.weight} lbs</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
