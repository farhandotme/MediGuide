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
  res.render("inputdetails");
});

app.get("/hospitals", (req, res) => {
  res.render("hospitals");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post("/create", upload.single("image"), async (req, res) => {
  let { name, address, phoneNo, treatment } = req.body;
  const createDetails = await hospitalModel.create({
    name,
    phoneNo,
    address,
    treatment,
    profile: req.file.buffer,
  });
  res.redirect("/inputdetails");
});

app.post("/scarch", async (req, res) => {
  let treatment = req.body.treatment;
  let hospitals = await hospitalModel.find({ treatment });
  res.render("hospitals", { hospitals , treatment});
});

const port = process.env.PORT;
app.listen(port, (error) => {
  try {
    console.log(`Your app is running on the port ${port}`);
  } catch (error) {
    throw error;
  }
});
