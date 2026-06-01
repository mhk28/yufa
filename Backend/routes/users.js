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
    const setupKey = process.env.ADMIN_SETUP_KEY;
    const providedSetupKey = req.header("x-admin-setup-key");

    if (!setupKey || providedSetupKey !== setupKey) {
      return res.status(403).json({
        message: "Admin registration is disabled.",
      });
    }

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
        <!doctype html>
        <html>
          <body style="margin:0;padding:0;background:#fbf8f3;color:#1a0a2e;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf8f3;">
              <tr>
                <td align="center" style="padding:32px 14px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fffdf9;border:1px solid #eadfca;">
                    <tr>
                      <td style="padding:34px 28px;text-align:center;border-bottom:1px solid #eadfca;">
                        <img src="https://www.yufacollections.sg/images/yufa-logo.png" width="82" height="82" alt="Yufa Collections" style="display:block;margin:0 auto 18px;border:0;object-fit:contain;">
                        <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3.5px;text-transform:uppercase;color:#8b789d;">Yufa Collections</div>
                        <h1 style="margin:10px 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.1;font-weight:400;color:#2d1155;">Email test</h1>
                        <p style="margin:0 auto;max-width:430px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#6f6281;">If you received this, Resend is connected and Yufa's branded email styling is ready.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:26px 28px;">
                        <div style="padding:18px 20px;background:#fff8e6;border-left:3px solid #c9a84c;">
                          <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#8b789d;">Status</div>
                          <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#1a0a2e;">Email delivery is working. The next real order email will use the upgraded receipt design.</p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:24px 28px;text-align:center;background:#1a0a2e;">
                        <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#fffdf9;">Yufa Collections</p>
                        <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#d8cdea;">For enquiries, contact <a href="mailto:admin@yufacollections.com" style="color:#e7c96c;text-decoration:none;">admin@yufacollections.com</a>.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    res.json({ message: "Test email requested.", result });
  } catch (error) {
    console.log("Test email failed:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
