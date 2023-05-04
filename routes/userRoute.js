const express = require("express");
const { errorHandler } = require("../middlewares/error");
const User = require("../models/userModel");

const { protect, authorize } = require("../middlewares/protect");
const {advancedResults}=require('../middlewares/advancedResult');

const {
    getUsers,getUser,createUser,updateUser,deleteUser
  } = require("../controllers/userController");
  
  const router = express.Router({ mergeParams: true }); //mergeParams:true is used to get the params
  // from the bootcamp route
  
  //endpoint "/api/v1/users"

  router.use(protect,authorize('admin')); //middleware to protect all the routes below this line
  
  router.route("/")
    .get(advancedResults(User),getUsers)
    .post(createUser);

    router.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


  
  router.use(errorHandler);
  
  module.exports = router;
  
