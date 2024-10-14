const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to handle errors
const handleError = (res, error) => {
  console.error(error); // Log the error for debugging
  res.status(500).json({ error: 'An unexpected error occurred.' });
};

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, ncf_id, fullname, created_at, updated_at FROM users');
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT user_id, ncf_id, fullname, created_at, updated_at FROM users WHERE user_id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    handleError(res, error);
  }
};

const createUser = async (req, res) => {
  const { fullname, ncf_id, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (fullname, ncf_id, password) VALUES (?, ?, ?)', [fullname, ncf_id, hashedPassword]);
    res.status(201).json({ id: result.insertId, fullname, ncf_id }); // Remove password from response
  } catch (error) {
    handleError(res, error);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, ncf_id, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('UPDATE users SET fullname = ?, ncf_id = ?, password = ? WHERE user_id = ?', [fullname, ncf_id, hashedPassword, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Changes saved.' });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User removed.' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };