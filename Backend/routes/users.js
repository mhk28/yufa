const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { sendEmail } = require("../utils/emailService");


// REGISTER ADMIN
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Admin registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// LOGIN ADMIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email, role: "admin" });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/customer/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/customer/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "customer" });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customers", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }

    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/test-email", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }

    const recipient = req.body.email || "admin@yufacollections.com";

    const result = await sendEmail({
      to: [recipient],
      subject: "Yufa Collections email test",
      html: `
        <div style="font-family:Arial,sans-serif;color:#1a0a2e;line-height:1.6">
          <h1 style="font-family:Georgia,serif;color:#2d1155">Email test</h1>
          <p>If you received this, Resend is connected to Yufa successfully.</p>
        </div>
      `,
    });

    res.json({ message: "Test email requested.", result });
  } catch (error) {
    console.log("Test email failed:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
