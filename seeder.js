const mongoose = require('mongoose');
const bootcamp = require('./models/bootcampModel');
const Course=require('./models/courseModel');
const User=require('./models/userModel');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const fs = require('fs');


//connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

//read json files

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));
const users=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'));

//import into database
const importData = async () => {

    try {
        await bootcamp.create(bootcamps);
        // await Course.create(courses);
        await User.create(users);
        console.log('Data imported');
        process.exit();

    } catch (error) {

        console.log(error);


    }

}


//delete data

const deleteData = async () => {

    try {
        await bootcamp.deleteMany();
        // await Course.deleteMany();
        await User.deleteMany();
        console.log('Data deleted');
        process.exit();

    } catch (error) {

        console.log(error);
    }
}




if(process.argv[2]==='-import'){
    importData();
}
else if(process.argv[2]==='-delete'){
    deleteData();
}













