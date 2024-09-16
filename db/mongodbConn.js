const mongoose = require("mongoose");
const dbname = require("../constant");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${dbname}`)
    console.log(`Db connected`);
  } catch (error) {
    throw error;
  }
};


module.exports = connectDb;