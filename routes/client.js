const express = require('express')
const router = express.Router();
const login_controller = require('../controllers/loginController')
const signup_controller = require('../controllers/signupController')
const jwtAuthenticator = require('../controllers/jwtAuthenticator')
const clientController = require('../controllers/clientController')
router.use(express.json())
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/signup',upload.single('image'),signup_controller.client_signup);
router.post('/addgymimage',jwtAuthenticator.jwt_verify,upload.single('image'),clientController.gymAddImage);
router.get('/getgymimages',jwtAuthenticator.jwt_verify,clientController.gymGetImage)

module.exports = router;