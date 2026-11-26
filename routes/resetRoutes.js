const express = require('express')

const router = express.Router()

const { forgot_pass, reset_pass, forgot_pass_get, reset_pass_get, reset_pass_me } = require('../controllers/reset-pass-controller')

//render pages
router.get('/forgot-password',forgot_pass_get)
router.get('/reset-password',reset_pass_get)

//api's
router.post('/forgot-password',forgot_pass)
router.post('/reset-password',reset_pass)

module.exports = router