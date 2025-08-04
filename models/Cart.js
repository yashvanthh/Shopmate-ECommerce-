const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: Number, // Numeric ID from the Product model
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, "Quantity cannot be less than 1"],
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer",
    },
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user has one cart
    },
    items: {
      type: [cartItemSchema],
      default: [],
      validate: {
        validator: function (items) {
          const ids = items.map((item) => item.productId);
          return ids.length === new Set(ids).size;
        },
        message: "Duplicate products in cart are not allowed",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
