const express = require("express");
const path = require("path");
const connectDb = require("./db/mongodbConn");
const app = express();
const hospitalModel = require("./models/hospitalModels");
const dotenv = require("dotenv").config({ path: "./.env" });
const multer = require("multer");

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/inputdetails", (req, res) => {
  res.render("inputDetails");
});

app.get("/hospitals", (req, res) => {
  res.render("hospitals");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/create", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      phoneNo,
      address,
      treatmentName,
      treatmentPrice,
      mapLocation,
      link,
    } = req.body;

    // Create treatment array with name and price
    const treatments = treatmentName.map((name, index) => ({
      name,
      price: treatmentPrice[index],
    }));

    // Create hospital record in the database
    const createDetails = await hospitalModel.create({
      name,
      phoneNo,
      address,
      treatment: treatments,
      mapLocation, // Added mapLocation field
      link, // Added link field
      profile: req.file ? req.file.buffer : undefined, // Profile image
    });

    res.redirect("/inputdetails");
  } catch (error) {
    console.error("Error creating hospital:", error);
    res.status(500).send("Failed to create hospital.");
  }
});

app.post("/search", async (req, res) => {
  const treatmentName = req.body.treatment.toLowerCase();

  try {
    const hospitals = await hospitalModel.find({
      "treatment.name": { $regex: new RegExp(treatmentName, "i") },
    });

    res.render("hospitals", { hospitals, treatment: treatmentName }); 
  } catch (error) {
    console.error("Error searching for hospitals:", error);
    res.status(500).send("Error searching for hospitals");
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Your app is running on the port http://localhost:${port}`);
});
