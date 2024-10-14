const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to handle errors
const handleError = (res, error) => {
  console.error(error); // Log the error for debugging
  res.status(500).json({ error: 'An unexpected error occurred.' });
};

const getDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT dept_id, dept_code, dept_name, user_id, created_at, updated_at FROM departments');
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT dept_id, dept_code, dept_name, user_id, created_at, updated_at FROM departments WHERE dept_id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    handleError(res, error);
  }
};

const createDepartment = async (req, res) => {
  const { dept_code, dept_name, user_id } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO departments (dept_code, dept_name, user_id) VALUES (?, ?, ?)', [dept_code, dept_name, user_id]);
    res.status(201).json({ id: result.insertId, dept_code, dept_name, user_id }); 
  } catch (error) {
    handleError(res, error);
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { dept_code, dept_name, user_id } = req.body;

  try {
    const [result] = await pool.query('UPDATE departments SET dept_code = ?, dept_name = ?, user_id = ? WHERE dept_id = ?', [dept_code, dept_name, user_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Change of department saved.' });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM departments WHERE dept_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department has been removed.' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };