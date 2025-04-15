const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// GET all tasks protect with auth middleware
router.get('/', authMiddleware, getTasks);

// POST a new task protect with auth middleware
router.post('/', authMiddleware, createTask);

// PUT update task protect with auth middleware
router.put('/:id', authMiddleware, updateTask);

// DELETE task protect with auth middleware
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
