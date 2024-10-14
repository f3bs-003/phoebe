const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to handle errors
const handleError = (res, error) => {
  console.error(error); // Log the error for debugging
  res.status(500).json({ error: 'An unexpected error occurred.' });
};

const getStudents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT student_id, lname, fname, mname, user_id, course_id, created_at, updated_at FROM students');
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT student_id, lname, fname, mname, user_id, course_id, created_at, updated_at FROM students WHERE student_id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    handleError(res, error);
  }
};

const createStudent = async (req, res) => {
  const { lname, fname, mname, user_id, course_id } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO students (lname, fname, mname, user_id, course_id) VALUES (?, ?, ?, ?, ?)', [lname, fname, mname, user_id, course_id]);
    res.status(201).json({ id: result.insertId, lname, fname, mname, user_id, course_id });
  } catch (error) {
    handleError(res, error);
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { lname, fname, mname, user_id, course_id } = req.body;

  try {
    const [result] = await pool.query('UPDATE students SET lname = ?, fname = ?, mname = ?, user_id, course_id = ? WHERE student_id = ?', [lname, fname, mname, user_id, course_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Change saved.' });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM students WHERE student_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student has been removed.' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getStudents, getStudentById, createStudent, updateStudent, deleteStudent };