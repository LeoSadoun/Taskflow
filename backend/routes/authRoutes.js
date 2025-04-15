const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser, loginUser, updateProfile, deleteUser } = require('../controllers/authController');

router.post('/register', registerUser); // register
router.post('/login', loginUser); //login
router.put('/profile', authMiddleware, updateProfile); // secure profile update
router.delete('/delete', authMiddleware, deleteUser); // secure delete user

module.exports = router;
