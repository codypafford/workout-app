import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import groupRoutes from './routes/groups.js'
import exerciseRoutes from './routes/exercise.js'
import logRoutes from './routes/logs.js'

dotenv.config()

const app = express()

// Middleware
app.use(express.json())

// Connect to Mongo
connectDB()

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Routes
app.use('/api/groups', groupRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use('/api/logs', logRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
