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
  treatment: [
    {
      name: { type: String, required: true },
    },
  ],
  profile: {
    type: Buffer,
  },
});

module.exports = mongoose.model("Hospital", hospitalSchema);
