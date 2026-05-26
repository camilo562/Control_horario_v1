require('dotenv').config({ quiet: true })

const cors = require('cors')
const express = require('express')
const pool = require('./db')

const app = express()
const port = process.env.PORT || 3001
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({ origin: frontendUrl }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'control-horario-api' })
})

app.get('/api/registros', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        empleado,
        tipo,
        fecha_hora AS fechaHora
      FROM registros_horarios
      ORDER BY fecha_hora DESC
      LIMIT 20
    `)

    res.json(rows)
  } catch (error) {
    next(error)
  }
})

app.post('/api/registros', async (req, res, next) => {
  try {
    const empleado = String(req.body.empleado || '').trim()
    const tipo = String(req.body.tipo || '').trim()

    if (!empleado || !['entrada', 'salida'].includes(tipo)) {
      return res.status(400).json({
        message: 'Empleado y tipo son obligatorios.',
      })
    }

    const [result] = await pool.query(
      'INSERT INTO registros_horarios (empleado, tipo) VALUES (?, ?)',
      [empleado, tipo],
    )

    const [rows] = await pool.query(
      `
        SELECT
          id,
          empleado,
          tipo,
          fecha_hora AS fechaHora
        FROM registros_horarios
        WHERE id = ?
      `,
      [result.insertId],
    )

    res.status(201).json(rows[0])
  } catch (error) {
    next(error)
  }
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({
    message: 'No se pudo procesar la solicitud.',
    detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
  })
})

app.listen(port, () => {
  console.log(`API lista en http://localhost:${port}`)
})
