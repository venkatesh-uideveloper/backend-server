const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

//   "mongoURI": "mongodb+srv://taskapp:April@2020@cluster0-9xrtd.mongodb.net/devconnect?retryWrites=true&w=majority",

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
    });
    console.log("connected to mongodb");
  } catch (e) {
    console.log(e.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
