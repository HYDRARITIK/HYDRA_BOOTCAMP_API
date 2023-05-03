const errorResp = require('../utils/errorResponse');


module.exports.errorHandler = (err, req, res, next) => {
    // console.log(err.stack.red);
    var error = { ...err };
    error.message = err.message;

    console.log("eroror->",err);
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new errorResp(message, 404);
    }
    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map(val=>val.message);//extract message from the object
        error=new errorResp(message,400);
    }

    if(err.code===11000){
        const message="please add unique values";//extract message from the object
        error=new errorResp(message,400);
    }



    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })



}