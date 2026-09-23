const mongoose = require("mongoose");

function connectToDB() {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected To Database Successfully");
        })
        .catch((error) => {
            console.log("Error in connecting to DB:", error.message);
            process.exit(1);
        });
}

module.exports = connectToDB;