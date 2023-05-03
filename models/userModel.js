
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'publisher','admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


//hashing password before saving
UserSchema.pre('save', async function (next) {
  if(!this.isModified('password')){
    next();
  }
    this.password=await bcrypt.hash(this.password,10);
});


//create method to get signed jwt token
//this method will be called on the user instance not on the model

UserSchema.methods.getSignedJWT=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
}

//cmethod to match password

UserSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

//generate and hash password token

UserSchema.methods.getResetPasswordToken=function(){

  //generate token
  const resetToken=crypto.randomBytes(20).toString('hex');

  console.log("this",resetToken);

  //hash token and set to resetPasswordToken field
  //saving the hashed token to the database
  this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');

  //set expire
  this.resetPasswordExpire=Date.now()+10*60*1000; //10 minutes

  //sending the unhashed token to the user
  return resetToken;
}







module.exports = mongoose.model('users', UserSchema);

//