const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { executeQuery } = require("../../utils/db/dbUtils");
const { getUTCDateTime } = require("../../utils/date/dateUtils");
const generateToken = require("../../utils/auth/generateToken");

// Get current user details
const getCurrentUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const user = await executeQuery(
      'SELECT user_id, email, full_name, role, status, last_login_at FROM users WHERE user_id = ?',
      [user_id]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user[0]);
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const findUserQuery =
      "SELECT user_id, email, full_name, password_hash, role, status FROM users WHERE email = ? OR user_id = ?";
    const user = await executeQuery(findUserQuery, [userId, userId]);

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if(user[0].status === 'deactivated') {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user[0].password_hash
    );
    console.log('isPasswordValid:', isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const currentDateTime = getUTCDateTime();
    const updateLoginTimeQuery =
      "UPDATE users SET last_login_at = ? WHERE user_id = ?";
    await executeQuery(updateLoginTimeQuery, [
      currentDateTime,
      user[0].user_id,
    ]);

    const token = generateToken(user[0]);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user[0].user_id,
        user_name: user[0].full_name,
        email: user[0].email,
        role: user[0].role,
        status: user[0].status
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Signup function
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const role = "customer";
    const status = "active";

    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    const existingUser = await executeQuery(checkUserQuery, [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const currentDateTime = getUTCDateTime();
    console.log('currentDateTime:', currentDateTime);

    const insertUserQuery = `
      INSERT INTO users 
      (full_name, email, password_hash, role, created_at, last_login_at, status)  
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result = await executeQuery(insertUserQuery, [
      fullName,
      email,
      hashedPassword,
      role,
      currentDateTime,
      currentDateTime,
      status
    ]);

    res.status(201).json({
      message: "User created successfully",
      user_id: result.insertId,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  signup,
  login,
  getCurrentUser
};
