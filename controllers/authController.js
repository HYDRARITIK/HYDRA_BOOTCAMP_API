const User = require("../models/userModel");

const { asyncHandler } = require("../middlewares/async");
const errorResp = require("../utils/errorResponse");
const { sendmail } = require("../utils/sendEmail");
const crypto = require("crypto");

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public

module.exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  //we have to send signed jwt token to the user
  sendTokenResponse(user, 200, res);
});

//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public

module.exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new errorResp("Please provide an email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password"); //we have to select password field as it is
  //  not selected by default in user model
  if (!user) {
    return next(new errorResp("Invalid credentials", 401));
  }

  //now we have to match the password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new errorResp("Invalid credentials", 401));
  }

  //we have to send signed jwt token to the user
  sendTokenResponse(user, 200, res);
});

//@desc     forgot password
//@route    POST /api/v1/auth/forgotpassword
//@access   Public

module.exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new errorResp("There is no user with that email", 404));
  }

  //get reset token
  const resetToken = user.getResetPasswordToken();

  //   console.log("resetToken", resetToken);

  //since we changed the resetpasswordToken we have to save the user
  await user.save({ validateBeforeSave: false });

  //create reset url

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  console.log("resetUrl", resetUrl);

  try {
    await sendmail({
      email: user.email,
      resetUrl,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    return next(new errorResp("Email could not be sent", 500));
  }
});

//@desc    reset password
//@route    Patch /api/v1/auth/resetpassword/:resettoken
//@access   Public

module.exports.resetPassword = asyncHandler(async (req, res, next) => {
  const token = req.params.resettoken;
  const hashed_token = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed_token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new errorResp("Invalid token", 400));
  }

    //set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
});

//function to send token inside cookie

const sendTokenResponse = (user, statusCode, res) => {
  const jwt = user.getSignedJWT();

  //now we have to send the token to the user inside a cookie

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", jwt, options)
    .json({ success: true, msg: jwt });
};
