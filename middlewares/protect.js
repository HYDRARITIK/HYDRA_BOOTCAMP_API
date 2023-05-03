const {asyncHandler}=require('./async');
const errorResp=require('../utils/errorResponse');
const User=require('../models/userModel');
const Course=require('../models/courseModel');
const Bootcamp=require('../models/bootcampModel');

const jwt=require('jsonwebtoken');


module.exports.protect=asyncHandler(async(req,res,next)=>{
    //we have to check if the user is logged in or not in cookie

    let token;

    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    //     token=req.headers.authorization.split(' ')[1];
    // }

    if(req.cookies.token){
        token=req.cookies.token;
    }
    //make sure token exists
    if(!token){
        // console.log('No token');
        return next(new errorResp('Not authorized to access this route',401));
    }

    //now we have to verify the token
    try{
        console.log('token is ',token);
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        console.log('decode is ',decode);
        const user=await User.findById(decode.id);
        if(!user){
            return next(new errorResp('Not authorized to access this route',404));
        }

        req.user=user;
        next();
    }
    catch(err){
        return next(new errorResp('Not authorized to access this route',401));
    }
});








//authoize route to specific users

module.exports.authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new errorResp(`User with role of ${req.user.role} is not authorized to access this route`,403));
        }
        next();
    }
}


//checkc ownership of the bootcamp

module.exports.checkBootcampOwnership=asyncHandler(async(req,res,next)=>{
    const bootcamp=await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new errorResp(`Bootcamp with id ${req.params.id} not found`,404));
    }
    if(bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new errorResp(`User with id ${req.user.id} is not authorized to update this bootcamp`,401));
    }
    next();
})

//checkc ownership of the course

module.exports.checkCourseOwnership=asyncHandler(async(req,res,next)=>{
    const course=await Course.findById(req.params.id);
    if(!course){
        return next(new errorResp(`Course with id ${req.params.id} not found`,404));
    }
    if(course.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new errorResp(`User with id ${req.user.id} is not authorized to update this course`,401));
    }
    next();
})
