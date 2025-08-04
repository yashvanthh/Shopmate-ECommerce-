const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  name: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number },
  image: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
