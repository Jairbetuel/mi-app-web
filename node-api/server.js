const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'gamestore'
})

db.connect(err => {
  if(err){
    console.log("Error conexión:", err)
  }else{
    console.log("Conectado a MySQL")
  }
})

app.post('/usuarios', (req,res)=>{
  const {nombre,correo,password} = req.body

  console.log("DATOS RECIBIDOS:", nombre, correo, password)

  db.query(
    'INSERT INTO usuarios (nombre,correo,password) VALUES (?,?,?)',
    [nombre,correo,password],
    (err)=>{
      if(err) return res.send(err)
      res.send("Usuario creado")
    }
  )
})

app.post('/login',(req,res)=>{
  const {correo,password} = req.body

  db.query(
    'SELECT * FROM usuarios WHERE correo=? AND password=?',
    [correo,password],
    (err,result)=>{
      if(result.length>0){
        res.json(result[0])
      }else{
        res.send(null)
      }
    }
  )
})

app.get('/usuarios',(req,res)=>{
  db.query('SELECT * FROM usuarios',(err,result)=>{
    res.json(result)
  })
})

app.listen(3000, ()=>{
  console.log("Servidor corriendo en puerto 3000")
})