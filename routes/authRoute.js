const express = require('express')
const router = express.Router()
const {requireIfAuthenticated} = require('../middleware/middleware')

const { home_get, login_get, signup_get, signup_post,login_post, logout_get} = require("../controllers/authController")
//views
router.get('/',home_get)
router.get('/login',requireIfAuthenticated,login_get)
router.get('/signup',signup_get)

//api's
router.post('/signup',signup_post)
router.post('/login',login_post)
//use router.post && form for production
router.get('/logout',logout_get)

module.exports = router