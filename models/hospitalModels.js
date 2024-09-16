const mongoose = require("mongoose");

const hospitalSchema = mongoose.Schema({
  name: {
    type: String,
  },
  phoneNo: {
    type: Number,
  },
  address: {
    type: String,
  },
  treatment: {
    type: String,
  },
  profile: {
    type: Buffer,
  },
});

module.exports = mongoose.model("Hospital", hospitalSchema);
