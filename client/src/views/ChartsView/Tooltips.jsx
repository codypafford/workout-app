import React from 'react'
import moment from 'moment'

export const ExerciseFreqTooltip = ({ active, payload, label, frequency }) => {
  if (!active || !payload || payload.length === 0) return null

  // Determine period start and end for tooltip
  let periodStart, periodEnd

  if (frequency === '1w') {
    periodStart = moment(label)
    periodEnd = moment(label).add(6, 'days') // week is 7 days total
  } else if (frequency === '3m' || frequency === '6m') {
    periodStart = moment(label).startOf('month')
    periodEnd = moment(label).endOf('month')
  } else {
    periodStart = moment(label)
    periodEnd = moment(label)
  }

  return (
    <div style={{ background: 'white', border: '1px solid #ccc', padding: '10px' }}>
      <strong>
        {periodStart.format('MMM D, YYYY')} – {periodEnd.format('MMM D, YYYY')}
      </strong>
      <ul style={{ margin: 0, paddingLeft: '15px' }}>
        {payload.map((p) => (
          <li key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
