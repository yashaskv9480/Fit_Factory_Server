const express = require('express')
const router = express.Router();
const login_controller = require('../controllers/loginController')
const signup_controller = require('../controllers/signupController')
const jwtAuthenticator = require('../controllers/jwtAuthenticator')
const userController = require('../controllers/userController')
router.use(express.json())

router.post('/login',login_controller.user_login);
router.post('/signup',signup_controller.user_signup);
router.post('/google/oauth',signup_controller.google_oauth)
router.get('/authenticate',jwtAuthenticator.jwt_verify)
router.post('/getlocationgyms',userController.viewLocationGyms)
router.get('/getsinglegym/:gym_id',userController.viewSingleGyms)


module.exports = router;