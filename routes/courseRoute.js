const express = require("express");
const { errorHandler } = require("../middlewares/error");
const { protect, authorize, checkCourseOwnership } = require("../middlewares/protect");

const {
  getAllCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router({ mergeParams: true }); //mergeParams:true is used to get the params
// from the bootcamp route

//endpoint "/api/v1/courses"

router.route("/").get(getAllCourses)
.post(protect,authorize('publisher','admin'), addCourse);

router
  .route("/:id")
  .get(getSingleCourse)
  .patch(protect,authorize('publisher','admin'),checkCourseOwnership ,updateCourse)
  .delete(protect,authorize('publisher','admin'),checkCourseOwnership ,deleteCourse);

router.use(errorHandler);

module.exports = router;
