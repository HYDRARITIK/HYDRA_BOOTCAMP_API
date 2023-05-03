//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public

const bootCamp = require("../models/bootcampModel");
const errorResp = require("../utils/errorResponse");
const { asyncHandler } = require("../middlewares/async");
const course = require("../models/courseModel");
const path = require("path");

// const{advancedQuery}=require('../middlewares/advancedResult');

module.exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await bootCamp.find();
  if (!bootcamps) {
    return next(
      new errorResp(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, msg: bootcamps });
});

//@desc Get single bootcamps
//@route GET /api/v1/bootcamps/:id
//@access Public

module.exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
  const Id = req.params.id;
  const bootcamp = await bootCamp.findById(Id);
  if (!bootcamp) {
    return next(
      new errorResp(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, msg: bootcamp });
});

//@desc Create new bootcamps
//@route POST /api/v1/bootcamps
//@access Private

module.exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //since it is passed through protect middleware we can access user id
  //from req.user.id
  req.body.user = req.user.id;

  //if role is  publisher then he can add only one bootcamp
  //if bootcamp already exists then he can't add another bootcamp
  if (req.user.role === "publisher") {
    const publishedBootcamp = await bootCamp.findOne({ user: req.user.id });
    if (publishedBootcamp) {
      return next(
        new errorResp(
          `The user with id ${req.user.id} has already published a bootcamp`,
          400
        )
      );
    }
  }
  const bootcmp = await bootCamp.create(req.body);
  res.status(200).json({ success: true, msg: bootcmp });
});

//@desc Update bootcamps
//@route PUT /api/v1/bootcamps/:id
//@access Private

module.exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const Id = req.params.id;
  const bootcmp = await bootCamp.findByIdAndUpdate(Id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, msg: bootcmp });
});

//@desc Delete bootcamps
//@route DELETE /api/v1/bootcamps/:id
//@access Private

module.exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const Id = req.params.id;
  const bootcmp = await bootCamp.findByIdAndDelete(Id, req.body, {
    new: true,
    runValidators: true,
  });

  await course.deleteMany({ bootcamp: Id });


  res.status(200).json({ success: true, msg: bootcmp });
});

//@desc upload photo
//@route PUT /api/v1/bootcamps/:id/photo
//@access Private

module.exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp_id = req.params.id;

  var file = req.files.file;
  console.log(file);

  //checking if the bootcamp exists
  const bootcamp = await bootCamp.findById(bootcamp_id);

  if (!bootcamp) {
    next(new errorResp(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  //checking mimetype of file

  if (!file.mimetype.startsWith("image")) {
    next(new errorResp(`Please upload an image file`, 400));
  }

  //checking size of file

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    next(
      new errorResp(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //creating custom file name

  var file_name = `photo_${bootcamp_id}${path.parse(file.name).ext}`;

  console.log(file_name);

  //moving file to path

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file_name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new errorResp(`Problem with file upload`, 500));
    }

    await bootCamp.findByIdAndUpdate(bootcamp_id, { photo: file_name });

    res.status(200).json({ success: true, data: file_name });
  });
});
