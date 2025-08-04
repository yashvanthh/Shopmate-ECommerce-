const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products - Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

module.exports = router;
