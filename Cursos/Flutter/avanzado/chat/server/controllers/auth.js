const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res) => {
  const { email, password } = req.body

  try {
    const existeEmail = await Usuario.findOne({ email })
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya esta registrado'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin de la bd'
    })
  }
  const usuario = new Usuario(req.body)

  // Encriptar contraseña
  const salt = bcrypt.genSaltSync()
  usuario.password = bcrypt.hashSync(password, salt)

  try {
    await usuario.save()
  } catch (error) {
    console.log(error)
  }

  // Generar JWT
  const token = generarJWT(usuario.uid)

  res.json({
    ok: true,
    usuario,
    token
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const usuarioDB = await Usuario.findOne({ email })
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Email no encontrado en la Bd'
      })
    }

    const validarPassword = bcrypt.compareSync(password, usuarioDB.password)
    if (!validarPassword) {
      return res.status(404).json({
        ok: false,
        msg: 'Contraseña erronea'
      })
    }

    const token = await generarJWT(usuarioDB.id)

    res.json({
      ok: true,
      usuarioDB,
      token
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    })
  }

  return res.json
}

const renewToken = async (req, res) => {
  const { uid } = req

  const token = await generarJWT(uid)

  const usuario = await Usuario.findById(uid)

  res.json({
    ok: true,
    usuario,
    token
  })
}

module.exports = {
  crearUsuario,
  login,
  renewToken
}
