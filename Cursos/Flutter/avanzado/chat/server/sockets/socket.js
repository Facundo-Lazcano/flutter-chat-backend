const {
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje
} = require('../controllers/socket')
const { comprobarJWT } = require('../helpers/jwt')
const { io } = require('../index')

// MENSAJES DE SOCKETS
io.on('connection', client => {
  console.log('Cliente Conectado')
  const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'])

  // Verificar autenticacion
  if (!valido) {
    return client.disconnect()
  }

  usuarioConectado(uid)

  // Ingresar al usuario a una sala
  // Sala grobal, client.id, uid de usuario
  client.join(uid)

  client.on('mensaje-personal', async payload => {
    await grabarMensaje(payload)
    io.to(payload.para).emit('mensaje-personal', payload)
  })

  client.on('disconnect', () => {
    usuarioDesconectado(uid)
  })
})
