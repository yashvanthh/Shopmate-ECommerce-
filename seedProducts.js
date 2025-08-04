const mongoose = require("mongoose");
const Product = require("./models/Product");
const all_product = require("./data/all_product_node"); // <-- use your new backend file

const MONGO_URI = "mongodb://127.0.0.1:27017/shopmate_ecommerce";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB ✅");

    await Product.deleteMany(); // Clear old products
    await Product.insertMany(all_product); // Insert new products
    console.log(`🌟 Inserted ${all_product.length} products`);
    process.exit();
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });
