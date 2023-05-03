const express = require("express");
const { errorHandler } = require("../middlewares/error");

const { registerUser,loginUser,forgotPassword,resetPassword} = require("../controllers/authController");

const router = express.Router({ mergeParams: true }); //mergeParams:true is used to get the params

//endpoint "/api/v1/auth"
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword/:resettoken").patch(resetPassword);

router.use(errorHandler);

module.exports = router;
