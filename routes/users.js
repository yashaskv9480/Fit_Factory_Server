const express = require('express')
const router = express.Router();
const login_controller = require('../controllers/login_controller')
const signup_controller = require('../controllers/signup_controller')
router.use(express.json())

router.post('/login',login_controller.user_login);
router.post('/signup',signup_controller.user_signup);

module.exports = router;