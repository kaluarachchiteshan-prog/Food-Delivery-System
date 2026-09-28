require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoute = require('./routes/auth')

const app = express()
const port = Number(process.env.PORT) || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/auth', authRoute)

app.use((request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/food-delivery'

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error.message))

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend listening on port ${port}`)
})