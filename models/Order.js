const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
