const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateUser = (user) => {
  // Implement validation logic for password and ncf_id (length, format etc.)
  // Throw an error with a specific message if validation fails.
};

const register = async (req, res) => {
  try {
    const { fullname, password, ncf_id } = req.body;

    validateUser({ password, ncf_id });

    const hashedncf_id = await bcrypt.hash(ncf_id, 10);
    const [rows] = await pool.query('INSERT INTO users (fullname, password, ncf_id) VALUES (?, ?, ?)', [fullname, password, hashedncf_id]);

    res.status(201).json({ message: 'Registration Complete!' });
  } catch (err) {
    if (err.name === 'ValidationError') { // Example check for validation error
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

const login = async (req, res) => {
  try {
    const { password, ncf_id } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE password = ?', [password]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(ncf_id, user.ncf_id);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid ncf_id' });
    }

    const token = jwt.sign({ user_id: user.user_id, password: user.password }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME });

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };