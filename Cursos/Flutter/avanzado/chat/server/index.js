const express = require('express')
const path = require('path')
require('dotenv').config()

// DB CONFIG
require('./db/config').dbConnection()

// APP EXPRESS
const app = express()

// LECTURA Y PARSEO DEL BODY
app.use(express.json())

// NODE SERVER
const server = require('http').createServer(app)
module.exports.io = require('socket.io')(server)

require('./sockets/socket')

// Path publico
const publicPath = path.resolve(__dirname, 'public')

// MIS RUTAS

app.use('/api/login', require('./routes/auth'))

app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/mensajes', require('./routes/mensajes'))

app.use(express.static(publicPath))

server.listen(process.env.PORT, e => {
  if (e) throw new Error(e)

  console.log('Servidor en puerto ', process.env.PORT)
})
