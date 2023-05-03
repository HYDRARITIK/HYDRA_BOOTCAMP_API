const mongo_url=process.env.MONGO_URI;
const mongoose=require('mongoose');

const connectDB=async()=>{
    const conn=await mongoose.connect(mongo_url,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    console.log(`MongoDB connected:${conn.connection.host}`);
}


module.exports=connectDB;