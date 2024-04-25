const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");

app.use(cors());
app.use(express.json());

mongoose.connect(
  
);
const Product = mongoose.model("product", {
  name: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  color: {
    type: [String],
    required: true,
  },
  size: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type : Number
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: storage,
});

app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    msg: "done",
    image_url: `http://localhost:3000/images/${req.file.filename}`,
  });
});
app.post("/addproduct", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    image : req.body.image,
    color : req.body.color,
    size : req.body.size,
    price: parseInt(req.body.price),
    discount: parseInt(req.body.discount)
  });
  await product.save();

  res.json({
    msg: "added",
    prd : product
  });
});
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({
    _id: req.body.id,
  });
  res.json({
    status : true,
  });
});
app.get("/allproduct", async (req, res) => {
  let product = await Product.find({});
  res.json(product);
});

app.listen(3000, () => {
  console.log("app is running at port : 3000");
});
