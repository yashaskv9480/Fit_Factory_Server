const express = require('express')
const router = express.Router();
const login_controller = require('../controllers/loginController')
const signup_controller = require('../controllers/signupController')
router.use(express.json())
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/signup',upload.single('image'),signup_controller.client_signup);

module.exports = router;