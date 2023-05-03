const express = require("express");
const { errorHandler } = require("../middlewares/error");

const {protect,authorize,checkBootcampOwnership}=require('../middlewares/protect');

const courseRoute = require("./courseRoute");
const { advancedResults } = require("../middlewares/advancedResult");

const { bootcamp } = require("../models/bootcampModel");
// const {course}=require('../models/courseModel');
const populate = {
  path: "courses",
  select: "title description",
};

const {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadPhoto,
} = require("../controllers/bootcampsController");

const router = express.Router();

//re-route into other resource routers
router.use("/:bootcampId/courses", courseRoute);

// router.route('/:bootcampId/courses')

//endpoint "/api/v1/bootcamps"

router.route("/").get(protect,getAllBootcamps).post(protect, authorize('publisher','admin'),createBootcamp);

router
  .route("/:id")
  .get(getSingleBootcamp)
  .patch(protect,authorize('publisher','admin'),checkBootcampOwnership , updateBootcamp)
  .delete(protect,authorize('publisher','admin'),checkBootcampOwnership ,deleteBootcamp);

router.route("/:id/photo").patch(protect,authorize('publisher','admin'),checkBootcampOwnership ,
  uploadPhoto);

router.use(errorHandler);

module.exports = router;
