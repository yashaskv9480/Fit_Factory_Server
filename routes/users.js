const express = require('express')
const router = express.Router();
const login_controller = require('../controllers/loginController')
const signup_controller = require('../controllers/signupController')
const jwtAuthenticator = require('../controllers/jwtAuthenticator')
router.use(express.json())

router.post('/login',login_controller.user_login);
router.post('/signup',signup_controller.user_signup);
router.post('/google/oauth',signup_controller.google_oauth)
router.get('/verifytoken',jwtAuthenticator.jwt_verify)


module.exports = router;