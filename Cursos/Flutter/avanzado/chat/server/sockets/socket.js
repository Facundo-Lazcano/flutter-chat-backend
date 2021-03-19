const { io } = require('../index')

// MENSAJES DE SOCKETS
io.on('connection', client => {
  console.log('Cliente Conectado')
  client.on('disconnect', () => {
    console.log('Cliente desconectado')
  })
})
