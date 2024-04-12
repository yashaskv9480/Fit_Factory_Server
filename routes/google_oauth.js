const express = require('express')
const router = express.Router();
const google_controller = require('../controllers/google_oauth_controller')
router.use(express.json())

router.get('/consent',google_controller.google_consent);
router.get('/callback',google_controller.google_callback);

module.exports = router;