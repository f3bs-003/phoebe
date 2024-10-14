const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to handle errors
const handleError = (res, error) => {
  console.error(error); // Log the error for debugging
  res.status(500).json({ error: 'An unexpected error occurred.' });
};

const getCourses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT course_id, course_code, course_name, user_id, dept_id, created_at, updated_at FROM courses');
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT course_id, course_code, course_name, user_id, dept_id, created_at, updated_at FROM courses WHERE course_id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    handleError(res, error);
  }
};

const createCourse = async (req, res) => {
  const { course_code, course_name, user_id, dept_id } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO courses (course_code, course_name, user_id, dept_id) VALUES (?, ?, ?, ?)', [course_code, course_name, user_id, dept_id]);
    res.status(201).json({ id: result.insertId, course_code, course_name, user_id, dept_id });
  } catch (error) {
    handleError(res, error);
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course_code, course_name, user_id, dept_id } = req.body;

  try {
    const [result] = await pool.query('UPDATE courses SET course_code = ?, course_name = ?, user_id = ?, dept_id = ? WHERE course_id = ?', [course_code, course_name, user_id, dept_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Change of course saved.' });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM courses WHERE course_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course has been removed.' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };