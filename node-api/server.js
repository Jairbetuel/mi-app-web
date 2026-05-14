const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// ─── CONEXIÓN MYSQL ─────────────────────────────────────────────

const db = mysql.createConnection({
  host: 'yamanote.proxy.rlwy.net',
  user: 'root',
  password: 'UXswurJQiMGtVRbYMDfYncpvpmwhjxEZ',
  database: 'railway',
  port: 53761
})

db.connect((err) => {

  if (err) {
    console.log("❌ Error conexión MySQL:", err.message)
  } else {
    console.log("✅ Conectado a MySQL")
  }

})

// ─── REGISTRO ───────────────────────────────────────────────────

app.post('/usuarios', (req, res) => {

  const { nombre, correo, password } = req.body

  console.log("REGISTRO:", nombre, correo)

  if (!nombre || !correo || !password) {
    return res.status(400).json({
      ok: false,
      error: "Faltan datos"
    })
  }

  db.query(
    'SELECT id FROM usuarios WHERE correo = ?',
    [correo],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          error: "Error servidor"
        })
      }

      if (result.length > 0) {
        return res.status(409).json({
          ok: false,
          error: "Correo ya registrado"
        })
      }

      db.query(
        'INSERT INTO usuarios(nombre, correo, password) VALUES (?, ?, ?)',
        [nombre, correo, password],
        (err) => {

          if (err) {
            return res.status(500).json({
              ok: false,
              error: err.message
            })
          }

          res.json({
            ok: true,
            mensaje: "Usuario creado"
          })

        }
      )

    }
  )

})

// ─── LOGIN ──────────────────────────────────────────────────────

app.post('/login', (req, res) => {

  const { correo, password } = req.body

  console.log("LOGIN:", correo)

  if (!correo || !password) {
    return res.status(400).json({
      ok: false,
      error: "Faltan datos"
    })
  }

  db.query(
    'SELECT * FROM usuarios WHERE correo = ? AND password = ?',
    [correo, password],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          error: "Error servidor"
        })
      }

      if (result.length > 0) {

        res.json({
          ok: true,
          usuario: {
            id: result[0].id,
            nombre: result[0].nombre,
            correo: result[0].correo
          }
        })

      } else {

        res.status(401).json({
          ok: false,
          error: "Correo o contraseña incorrectos"
        })

      }

    }
  )

})

// ─── LISTAR USUARIOS ────────────────────────────────────────────

app.get('/usuarios', (req, res) => {

  db.query(
    'SELECT id, nombre, correo FROM usuarios',
    (err, result) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          error: err.message
        })
      }

      res.json(result)

    }
  )

})

// ─── RUTA PRINCIPAL ─────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: "API GameStore funcionando 🚀"
  })
})

// ─── SERVIDOR ───────────────────────────────────────────────────

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Servidor corriendo")
})