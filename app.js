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

    const treatments = treatmentName.map((name, index) => ({
      name,
      price: treatmentPrice[index],
    }));

    const createDetails = await hospitalModel.create({
      name,
      phoneNo,
      address,
      treatment: treatments,
      mapLocation,
      link,
      profile: req.file ? req.file.buffer : undefined,
    });

    res.redirect("/inputdetails");
  } catch (error) {
    console.error("Error creating hospital:", error);
    res.status(500).send("Failed to create hospital.");
  }
});

app.post("/search", async (req, res) => {
  const treatmentName = req.body.treatment;

  try {
    const hospitals = await hospitalModel.find(
      { "treatment.name": { $regex: new RegExp(treatmentName, "i") } },
      {
        name: 1,
        address: 1,
        phoneNo: 1,
        profile: 1,
        "treatment.$": 1, 
        link: 1,
        mapLocation: 1,
      }
    );

    if (!hospitals || hospitals.length === 0) {
      return res.render("hospitals", {
        hospitals: [],
        treatment: treatmentName,
        message: `No hospitals found offering treatment: ${treatmentName}`,
      });
    }

    res.render("hospitals", {
      hospitals,
      treatment: treatmentName,
      message: null,
    });
  } catch (error) {
    console.error("Error searching for hospitals:", error.message);

    res.status(500).render("hospitals", {
      hospitals: [],
      treatment: treatmentName,
      message: "An error occurred. Please try again later.",
    });
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Your app is running on the port http://localhost:${port}`);
});
