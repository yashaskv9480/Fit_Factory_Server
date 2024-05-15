const express = require("express");
const router = express.Router();
const login_controller = require("../controllers/loginController");
const signup_controller = require("../controllers/signupController");
const jwtAuthenticator = require("../controllers/jwtAuthenticator");
const userController = require("../controllers/userController");
router.use(express.json());

router.post("/login", login_controller.user_login);
router.post("/signup", signup_controller.user_signup);
router.post("/google/oauth", signup_controller.google_oauth);
router.get("/authenticate", jwtAuthenticator.jwt_verify);
router.post("/getlocationgyms", userController.viewLocationGyms);
router.get("/getsinglegym/:gym_id", userController.viewSingleGyms);
router.post("/booking", jwtAuthenticator.isUser, userController.bookGym);
router.get(
  "/getpassword",
  jwtAuthenticator.isUser,
  userController.getCurrentPassword
);
router.put(
  "/resetoauthpassword",
  jwtAuthenticator.isUser,
  userController.resetOauthPassword
);
router.put(
  "/resetpassword",
  jwtAuthenticator.isUser,
  userController.resetPassword
);

router.get(
  "/userdetails",
  jwtAuthenticator.isUser,
  userController.viewUserDetails
);
router.put(
  "/updateuserdetails",
  jwtAuthenticator.isUser,
  userController.updateDetails
);

router.post("/addreview", jwtAuthenticator.isUser, userController.addReview);
router.get("/fetchreview/:gym_id", userController.fetchReview);
router.get(
  "/viewuserbookings",
  jwtAuthenticator.isUser,
  userController.userViewBookings
);

router.post(
  "/checkdatebooked",
  jwtAuthenticator.isUser,
  userController.checkDatesBooked
);

router.post(
  "/addwishlist/:gym_id",
  jwtAuthenticator.isUser,
  userController.addwishlist
);

router.get(
  "/viewwishlist",
  jwtAuthenticator.isUser,
  userController.viewWishList
);

router.delete(
  "/deletewishlist/:gym_id",
  jwtAuthenticator.isUser,
  userController.deleteWishList
);

module.exports = router;
