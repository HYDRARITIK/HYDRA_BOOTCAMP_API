const express = require("express");
const { errorHandler } = require("../middlewares/error");
const { protect } = require("../middlewares/protect");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router({ mergeParams: true }); //mergeParams:true is used to get the params

//endpoint "/api/v1/auth"
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword/:resettoken").patch(resetPassword);

router.route("/updatedetails").patch(protect, updateDetails);

router.route("/updatepassword").patch(protect, updatePassword);

router.use(errorHandler);

module.exports = router;
