/*
path: api/login

*/

const { Router } = require('express')
const { check } = require('express-validator')
const { crearUsuario, login, renewToken } = require('../controllers/auth')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.post(
  '/new',
  [
    check('nombre', 'El nombre es obligatorio')
      .not()
      .isEmpty(),
    check('email', 'Ingrese un email valido').isEmail(),
    check('password', 'El password debe contener 6 caracteres como minimo')
      .not()
      .isEmpty()
      .isLength(6, 24),
    validarCampos
  ],
  crearUsuario
)

router.post(
  '/',
  [
    check('email', 'Ingrese un email valido').isEmail(),
    check('password', 'El password debe contener 6 caracteres como minimo')
      .not()
      .isEmpty(),
    validarCampos
  ],
  login
)
router.get('/renew', validarJWT, renewToken)

module.exports = router
