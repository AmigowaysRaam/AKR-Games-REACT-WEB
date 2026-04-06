const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

const generateReferralCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

const getUniqueReferralCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = generateReferralCode();

    const result = await pool.query(
      "SELECT id FROM users WHERE referral_code=$1",
      [code],
    );

    exists = result.rows.length > 0;
  }

  return code;
};
router.post('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1 AS ping');
    return res.json({
      status: 'OK',
      db: process.env.DB_NAME,
      env: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      error: 'DB connection failed',
      details: err.message,
    });
  }
});

router.post("/check-phone", async (req, res) => {
  const { phone } = req.body;

  try {
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const result = await pool.query("SELECT id FROM users WHERE phone=$1", [
      phone,
    ]);

    res.json({
      exists: result.rows.length > 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  try {
    if (!phone) return res.status(400).json({ message: "Phone required" });

    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = "1234"
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    const existing = await pool.query("SELECT * FROM users WHERE phone=$1", [
      phone,
    ]);

    if (existing.rows.length > 0) {
      await pool.query(
        "UPDATE users SET otp=$1, otp_expiry=$2 WHERE phone=$3",
        [hashedOtp, expiry, phone],
      );
    } else {
      await pool.query(
        "INSERT INTO users(phone, otp, otp_expiry) VALUES($1,$2,$3)",
        [phone, hashedOtp, expiry],
      );
    }

    console.log("OTP:", otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { phone, otp, referral_code, is_18plus, allow_notifications } =
    req.body;

  try {
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone & OTP required" });

    const result = await pool.query("SELECT * FROM users WHERE phone=$1", [
      phone,
    ]);

    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.otp) return res.status(400).json({ message: "OTP not found" });

    if (new Date() > user.otp_expiry)
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    if (!is_18plus)
      return res.status(400).json({ message: "Must confirm 18+" });

    const newReferralCode = await getUniqueReferralCode();

    let referrerId = null;

    if (referral_code) {
      const refUser = await pool.query(
        "SELECT id FROM users WHERE referral_code=$1",
        [referral_code],
      );

      if (refUser.rows.length === 0) {
        return res.status(400).json({ message: "Invalid referral code" });
      }

      referrerId = refUser.rows[0].id;
    }

    await pool.query(
      `UPDATE users SET 
        is_verified=true,
        referral_code=$1,
        referred_by=$2,
        allow_notifications=$3,
        otp=NULL,
        otp_expiry=NULL
    WHERE phone=$4`,
      [
        newReferralCode,
        referral_code || null,
        allow_notifications || false,
        phone,
      ],
    );

    const REFERRER_BONUS = 50;
    const NEW_USER_BONUS = 20;

    // give bonus to referrer
    if (referrerId) {
      await pool.query("UPDATE users SET wallet = wallet + $1 WHERE id=$2", [
        REFERRER_BONUS,
        referrerId,
      ]);
    }

    // give bonus to new user
    await pool.query("UPDATE users SET wallet = wallet + $1 WHERE phone=$2", [
      NEW_USER_BONUS,
      phone,
    ]);

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ message: "Registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    if (!phone || !password)
      return res.status(400).json({ message: "Phone & password required" });

    const result = await pool.query("SELECT * FROM users WHERE phone=$1", [
      phone,
    ]);

    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.password)
      return res.status(400).json({ message: "Set password first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    if (user.is_blocked)
      return res.status(403).json({ message: "User blocked" });

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

   res.json({
      message: "Login success",
      token,
      user: {
        id: user.id,
        username: user.username || `User${user.id}`,
        phone: user.phone,
        wallet: user.wallet,
        role: user.role,
        profile_image: user.profile_image
          ? `${req.protocol}://${req.get("host")}/uploads/${user.profile_image}`
          : null
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/set-password", async (req, res) => {
  const { phone, password, confirmPassword } = req.body;

  try {
    if (!phone || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords mismatch" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query("UPDATE users SET password=$1 WHERE phone=$2", [
      hashed,
      phone,
    ]);

    res.json({ message: "Password set successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/otp-login", async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE phone=$1", [
      phone,
    ]);

    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() > user.otp_expiry)
      return res.status(400).json({ message: "OTP expired" });

    await pool.query(
      "UPDATE users SET otp=NULL, otp_expiry=NULL WHERE phone=$1",
      [phone],
    );

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

  res.json({
  message: "OTP login success",
  token,
  user: {
    id: user.id,
    phone: user.phone,
    username: user.username || `User${user.id}`,
    wallet: user.wallet,
    role: user.role,
    profile_image: user.profile_image
      ? `${req.protocol}://${req.get("host")}/uploads/${user.profile_image}`
      : null
  }
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/delete-account", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [req.user.id]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/profile", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, phone, username, profile_image FROM users WHERE id=$1",
      [req.user.id],
    );

    const user = result.rows[0];

    res.json({
      user_id: user.id,
      username: user.username || `Player***${user.phone.slice(-3)}`,
      phone: user.phone.slice(0, 3) + "****" + user.phone.slice(-3),
      profile_image: user.profile_image
        ? `${req.protocol}://${req.get("host")}/uploads/${user.profile_image}`
        : null,
      level: "V0",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/update-username", auth, async (req, res) => {
  const { username } = req.body;

  try {
    if (!username)
      return res.status(400).json({ message: "Username required" });

    await pool.query("UPDATE users SET username=$1 WHERE id=$2", [
      username,
      req.user.id,
    ]);

    res.json({ message: "Username updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/change-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "All fields required" });

    const result = await pool.query("SELECT password FROM users WHERE id=$1", [
      req.user.id,
    ]);

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [
      hashed,
      req.user.id,
    ]);

    res.json({ message: "Password changed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/block-user", auth, admin, async (req, res) => {
  const { id } = req.body;

  const user = await pool.query("SELECT is_blocked FROM users WHERE id=$1", [
    id,
  ]);

  const newStatus = !user.rows[0].is_blocked;

  await pool.query("UPDATE users SET is_blocked=$1 WHERE id=$2", [
    newStatus,
    id,
  ]);

  res.json({ message: newStatus ? "Blocked" : "Unblocked" });
});

router.post("/delete-user", auth, admin, async (req, res) => {
  const { id } = req.body;

  await pool.query("DELETE FROM users WHERE id=$1", [id]);
  res.json({ message: "User deleted" });
});

router.post("/stats", auth, admin, async (req, res) => {
  const users = await pool.query("SELECT COUNT(*) FROM users");
  const verified = await pool.query(
    "SELECT COUNT(*) FROM users WHERE is_verified=true",
  );
  const blocked = await pool.query(
    "SELECT COUNT(*) FROM users WHERE is_blocked=true",
  );

  res.json({
    total: users.rows[0].count,
    verified: verified.rows[0].count,
    blocked: blocked.rows[0].count,
  });
});

router.post("/edit-profile-image", auth, upload.single("image"), async (req, res) => {
  try {
    const { phone } = req.user;
    
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    const newFileName = `profile-${Date.now()}.jpg`;
    const outputPath = path.join("uploads", newFileName);
    
    // Copy file (no sharp resize)
    fs.copyFileSync(req.file.path, outputPath);
    fs.unlinkSync(req.file.path);
    
    await pool.query("UPDATE users SET profile_image=$1 WHERE phone=$2", [newFileName, phone]);
    
    res.json({
      message: "Profile image updated",
      image: `${req.protocol}://${req.get("host")}/uploads/${newFileName}`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/delete-profile-image", auth, async (req, res) => {
  try {
    const { phone } = req.user;

    const result = await pool.query(
      "SELECT profile_image FROM users WHERE phone=$1",
      [phone],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const image = result.rows[0].profile_image;

    if (!image) {
      return res.status(400).json({ message: "No profile image found" });
    }

    const imagePath = path.join("uploads", image);

    if (fs.existsSync(imagePath)) {
      await fs.promises.unlink(imagePath);
    }

    await pool.query("UPDATE users SET profile_image=NULL WHERE phone=$1", [
      phone,
    ]);

    res.json({ message: "Profile image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/upload-profile",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.user;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // check user
      const result = await pool.query(
        "SELECT profile_image FROM users WHERE id=$1",
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const oldImage = result.rows[0].profile_image;

      const newFileName = `profile-${id}-${Date.now()}.jpg`;
      const outputPath = path.join("uploads", newFileName);

      await sharp(req.file.path)
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      // delete temp file
      await fs.promises.unlink(req.file.path);

      // delete old image
      if (oldImage) {
        const oldPath = path.join("uploads", oldImage);
        if (fs.existsSync(oldPath)) {
          await fs.promises.unlink(oldPath);
        }
      }

      await pool.query("UPDATE users SET profile_image=$1 WHERE id=$2", [
        newFileName,
        id,
      ]);

      res.json({
        message: "Profile uploaded",
        image: `${req.protocol}://${req.get("host")}/uploads/${newFileName}`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
);

router.post("/get-user", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        username,
        phone,
        email,
        wallet,
        role,
        is_verified,
        referral_code,
        profile_image
       FROM users 
       WHERE id=$1`,
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username || `User${user.id}`,
        email: user.email || null,
        phone: user.phone
          ? user.phone.slice(0, 3) + "****" + user.phone.slice(-3)
          : null,
        wallet: user.wallet,
        role: user.role,
        is_verified: user.is_verified,
        referral_code: user.referral_code,
        profile_image: user.profile_image
          ? `${req.protocol}://${req.get("host")}/uploads/${user.profile_image}`
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/get-all-users", auth, admin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = ""
    } = req.body;

    const offset = (page - 1) * limit;

    let where = [];
    let values = [];
    let index = 1;

    // 🔍 Search
    if (search) {
      where.push(`(
        username ILIKE $${index} OR 
        email ILIKE $${index} OR 
        phone ILIKE $${index}
      )`);
      values.push(`%${search}%`);
      index++;
    }

    // 🚦 Status filter
    if (status === "active") {
      where.push(`is_blocked = false`);
    } else if (status === "blocked") {
      where.push(`is_blocked = true`);
    }

    const whereQuery = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // 🔢 TOTAL USERS (no filter)
    const totalUsersRes = await pool.query(
      "SELECT COUNT(*) FROM users"
    );

    // 🔢 FILTERED COUNT
    const filteredCountRes = await pool.query(
      `SELECT COUNT(*) FROM users ${whereQuery}`,
      values
    );

    // 📄 USER LIST
    const result = await pool.query(
      `SELECT 
        id,
        username,
        email,
        phone,
        wallet,
        role,
        is_blocked,
        created_at
       FROM users
       ${whereQuery}
       ORDER BY id DESC
       LIMIT $${index} OFFSET $${index + 1}`,
      [...values, limit, offset]
    );

    const users = result.rows.map((user) => ({
      id: user.id,
      username: user.username || `User${user.id}`,
      email: user.email || null,
      phone: user.phone
        ? user.phone.slice(0, 3) + "****" + user.phone.slice(-3)
        : null,
      wallet: user.wallet,
      role: user.role,
      status: user.is_blocked ? "blocked" : "active",
      created_at: user.created_at,
    }));

    res.json({
      total_users: Number(totalUsersRes.rows[0].count),   // 🔥 ALL USERS
      filtered_users: Number(filteredCountRes.rows[0].count), // 🔥 AFTER FILTER
      page,
      limit,
      users,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/total-users", auth, admin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM users"
    );

    res.json({
      total_users: Number(result.rows[0].count)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
