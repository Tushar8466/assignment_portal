require('dotenv').config()
const express = require('express')
const pg = require('pg')
const app = express()

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
})

app.use(express.json())


app.post('/assignments', async (req, res) => {
  const { title, deadline } = req.body
  const result = await pool.query(
    'INSERT INTO assignments (title, deadline) VALUES ($1, $2) RETURNING *',
    [title, deadline]
  )
  res.status(201).json(result.rows[0])
})


app.listen(3000, () => {
  console.log('Server is running')
})