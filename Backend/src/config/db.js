const mongoDB = require('mongoose');

async function connectDB() {
    try{
        await mongoDB.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfuly");
    }catch(err){
        console.error("Database Error",err);
    }
}

module.exports = connectDB;