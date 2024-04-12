const express = require('express')
const router = express.Router();
const login_controller = require('../controllers/login_controller')
const signup_controller = require('../controllers/signup_controller')
router.use(express.json())
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/signup',upload.single('image'),signup_controller.client_signup);

module.exports = router;