const express = require('express')
const router = express.Router();
const user_controller = require('../controllers/userController')
router.use(express.json())

router.get('/viewusers',user_controller.viewusers);

module.exports = router;
