const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const jwtAuthenticator = require("../controllers/jwtAuthenticator");
router.use(express.json());

router.get("/viewusers", jwtAuthenticator.isAdmin, adminController.viewUsers);
router.get(
  "/viewclients",
  jwtAuthenticator.isAdmin,
  adminController.viewClients,
);
router.get(
  "/viewallbookings",
  jwtAuthenticator.isAdmin,
  adminController.viewAllBookings,
);

module.exports = router;
