const Course = require("../models/courseModel");
const errorResp = require("../utils/errorResponse");
const { asyncHandler } = require("../middlewares/async");
const bootCamp = require("../models/bootcampModel");

//@desc Get all courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
//@access Public

module.exports.getAllCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

//@desc Get single course
//@route GET /api/v1/courses/:id
//@access Public

module.exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const Id = req.params.id;
  const course = await Course.findById(Id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if(!course){
    return next(new errorResp(`No course with the id of ${req.params.id}`),404);
  }

    res.status(200).json({ success: true, msg: course });
});


//@desc Add course
//@route POST /api/v1/bootcamps/:bootcampId/courses
//@access Private

module.exports.addCourse = asyncHandler(async (req, res, next) => {

    const bootcamp_id=req.params.bootcampId;
    req.body.bootcamp=bootcamp_id;
    req.body.user=req.user.id;
    const single_bootcamp=await bootCamp.findById(bootcamp_id);
    if(!single_bootcamp){
        return next(new errorResp(`No bootcamp with the id of ${req.params.bootcampId}`),404);
    }
    //req.body has the bootcamp id

    const course=await Course.create(req.body);
    res.status(200).json({ success: true, msg: course });
});



//@desc Update course
//@route PUT /api/v1/courses/:id
//@access Private

module.exports.updateCourse = asyncHandler(async (req, res, next) => {
    const course_id=req.params.id;
    let course=await Course.findByIdAndUpdate(course_id,req.body,{
        new:true,
        runValidators:true
    });

    res.status(200).json({ success: true, msg: course });



});



//@desc Delete course
//@route DELETE /api/v1/courses/:id
//@access Private

module.exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course_id=req.params.id;
    let course=await Course.findByIdAndDelete(course_id);

    // await course.remove();

    res.status(200).json({ success: true, msg: {} });

});
