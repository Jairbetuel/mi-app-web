const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// ─── CONEXIÓN MySQL ────────────────────────────────────────────────────────────
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',          // ← pon tu contraseña de MySQL si tienes
  database: 'gamestore'
})

db.connect(err => {
  if (err) {
    console.error("❌ Error conexión MySQL:", err.message)
  } else {
    console.log("✅ Conectado a MySQL")
  }
})

// ─── REGISTRO ─────────────────────────────────────────────────────────────────
app.post('/usuarios', (req, res) => {
  const { nombre, correo, password } = req.body

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: "Faltan datos" })
  }

  // Verificar si ya existe el correo
  db.query('SELECT id FROM usuarios WHERE correo = ?', [correo], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en servidor" })

    if (result.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" })
    }

    db.query(
      'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
      [nombre, correo, password],
      (err) => {
        if (err) return res.status(500).json({ error: err.message })
        res.status(201).json({ mensaje: "Usuario creado" })
      }
    )
  })
})

// ─── LOGIN ────────────────────────────────────────────────────────────────────
app.post('/login', (req, res) => {
  const { correo, password } = req.body

  if (!correo || !password) {
    return res.status(400).json({ error: "Faltan datos" })
  }

  db.query(
    'SELECT * FROM usuarios WHERE correo = ? AND password = ?',
    [correo, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en servidor" })

      if (result.length > 0) {
        res.json(result[0])
      } else {
        res.status(401).json(null)
      }
    }
  )
})

// ─── LISTAR USUARIOS ──────────────────────────────────────────────────────────
app.get('/usuarios', (req, res) => {
  db.query('SELECT id, nombre, correo FROM usuarios', (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(result)
  })
})

// ─── ARRANCAR ─────────────────────────────────────────────────────────────────
app.listen(3000, '0.0.0.0', () => {
  console.log("🚀 Servidor corriendo en puerto 3000")
})