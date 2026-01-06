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
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        background: 'rgba(50, 50, 50, 0.95)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '10px',
        borderRadius: '6px',
        color: 'white',
        zIndex: 9999,
        top: -300,
        left: 0,
        minWidth: '200px',
        maxWidth: '300px',
        wordWrap: 'break-word'
      }}
    >
      <strong>
        {periodStart.format('MMM D, YYYY')} – {periodEnd.format('MMM D, YYYY')}
      </strong>
      <ul style={{ margin: 0, paddingLeft: '15px' }}>
        {payload.sort((a, b) => b.value - a.value).map((p) => (
          <li key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
