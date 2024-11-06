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
app.use(express.static(path.join(__dirname, "public")));
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
    let { name, address, phoneNo, treatmentName } = req.body;
    const treatments = treatmentName.map((name) => ({
      name,
    }));
    const createDetails = await hospitalModel.create({
      name,
      phoneNo,
      address,
      treatment: treatments,
      profile: req.file ? req.file.buffer : undefined,
    });
    res.redirect("/inputDetails");
  } catch (error) {
    console.error("Error creating hospital:", error);
    res.status(500).send("Failed to create hospital.");
  }
});

app.post("/search", async (req, res) => {
  const treatmentName = req.body.treatment.toLowerCase();
  
  try {
    const hospitals = await hospitalModel.find({
      "treatment.name": treatmentName,
    });
    res.render("hospitals", { hospitals, treatment: treatmentName });
  } catch (error) {
    console.error("Error searching for hospitals:", error);
    res.status(500).send("Error searching for hospitals");
  }
});

const port = process.env.PORT;
app.listen(port, (error) => {
  try {
    console.log(`Your app is running on the port http://localhost:${port}`);
  } catch (error) {
    throw error;
  }
});
