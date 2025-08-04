const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/cart - Get current user's cart with product details manually joined
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.json({ items: [] });
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ id: { $in: productIds } });

    const enrichedItems = cart.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: product || null,
      };
    });

    return res.json({ items: enrichedItems });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
});

// POST /api/cart - Add or update item quantity in cart
router.post("/", auth, async (req, res) => {
  let { productId, quantity } = req.body;

  productId = Number(productId);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  if (typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const productExists = await Product.exists({ id: productId });
    if (!productExists) {
      return res.status(400).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    return res.json({ items: cart.items });
  } catch (err) {
    console.error("Error updating cart:", err);
    return res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
});

// DELETE /api/cart/:productId - Remove single item from cart
router.delete("/:productId", auth, async (req, res) => {
  const productId = Number(req.params.productId);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();

    return res.json({ items: cart.items });
  } catch (err) {
    console.error("Error removing item from cart:", err);
    return res.status(500).json({ message: "Failed to remove item", error: err.message });
  }
});

// ✅ NEW ROUTE: DELETE /api/cart - Clear entire cart
router.delete("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    return res.json({ message: "Cart cleared", items: [] });
  } catch (err) {
    console.error("Error clearing cart:", err);
    return res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
});

module.exports = router;
