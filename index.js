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


app.get('/assignments', async (req, res) => {
  if (req.query.submitted === 'true') {
    const result = await pool.query(
      'SELECT * FROM assignments WHERE submitted = $1 ORDER BY id DESC',
      [true]
    )
    return res.json(result.rows)
  }
  const result = await pool.query('SELECT * FROM assignments ORDER BY id DESC')
  res.json(result.rows)
})

app.patch('/assignments/:id', async (req, res) => {
  const result = await pool.query(
    'UPDATE assignments SET submitted = true WHERE id = $1 RETURNING *',
    [req.params.id]
  )
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Assignment not found' })
  }
  res.json(result.rows[0])
})

app.delete('/assignments/:id', async (req, res) => {
  const result = await pool.query(
    'DELETE FROM assignments WHERE id = $1 RETURNING *',
    [req.params.id]
  )
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Assignment not found' })
  }
  res.json({
    message: 'Assignment deleted successfully',
    assignment: result.rows[0]
  })
})

app.listen(3000, () => {
  console.log('Server is running')
})