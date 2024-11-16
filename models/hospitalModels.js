const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Treatment name is required."],
  },
  price: {
    type: String,
    required: [true, "Treatment price is required."],
  },
});

const hospitalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required."],
    },
    phoneNo: {
      type: Number,
      required: [true, "Phone number is required."],
      unique: true, // Ensures no two hospitals have the same phone number
    },
    address: {
      type: String,
      required: [true, "Hospital address is required."],
    },
    treatment: [treatmentSchema], // Array of treatment sub-documents
    mapLocation: {
      type: String,
    },
    link: {
      type: String,
    },
    profile: {
      type: Buffer,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields automatically

// Add a method to add a treatment (for better control in backend)
hospitalSchema.methods.addTreatment = async function (
  treatmentName,
  treatmentPrice
) {
  this.treatment.push({ name: treatmentName, price: treatmentPrice });
  await this.save();
};

module.exports = mongoose.model("Hospital", hospitalSchema);
