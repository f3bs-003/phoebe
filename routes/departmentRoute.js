const express = require('express');
const { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment  } = require('../controllers/departmentController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// department Routes
router.get('/', authenticateToken, getDepartments);
router.get('/:id', authenticateToken, getDepartmentById);
router.post('/', authenticateToken, createDepartment);
router.put('/:id', authenticateToken, updateDepartment);
router.delete('/:id', authenticateToken, deleteDepartment);

module.exports = router;