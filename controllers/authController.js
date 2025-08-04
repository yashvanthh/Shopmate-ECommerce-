const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "yashuSecretKey",
      { expiresIn: "7d" }
    );

    // Respond with token and user info
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt received");
  console.log("Email:", email);
  console.log("Password:", password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "User not found" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔐 Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🧪 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "yashuSecretKey",
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful");
    res.status(200).json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

module.exports = { signup, login };
