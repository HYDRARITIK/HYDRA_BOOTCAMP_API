const User = require("../models/userModel");

const { asyncHandler } = require("../middlewares/async");
const errorResp = require("../utils/errorResponse");



//@desc     Get all users
//@route    GET /api/v1/users
//@access   Private/Admin

module.exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
    }

);

//@desc     Get single user
//@route    GET /api/v1/users/:id
//@access   Private/Admin

module.exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
});

//@desc     Create user
//@route    POST /api/v1/users
//@access   Private/Admin


module.exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(200).json({ success: true, data: user });
}

);

//@desc     Update user
//@route    PATCH /api/v1/users/:id
//@access   Private/Admin

module.exports.updateUser = asyncHandler(async (req, res, next) => {
    const data_to_update = req.body;
    const ID=req.params.id;
    const user=await User.findByIdAndUpdate(ID,data_to_update,{
        new:true,
        runValidators:true
    });

    res.status(200).json({ success: true, data: user });
});



//@desc     Delete user
//@route    DELETE /api/v1/users/:id
//@access   Private/Admin

module.exports.deleteUser = asyncHandler(async (req, res, next) => {
    const ID=req.params.id;
    await User.findByIdAndDelete(ID);
    res.status(200).json({ success: true, data: {} });
});


