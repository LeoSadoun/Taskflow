const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); // bcrypt for password hashing
const jwt = require('jsonwebtoken'); // JWT for token generation
const sendEmail = require('../utils/sendEmail'); // email verification

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'; // store in .env for security

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { name, email, password, currentPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const emailChanged = email && email !== user.email;

    if (name) user.name = name;
    if (email) user.email = email;

    // Require currentPassword to change password
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password.' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect current password.' });
      }

      user.password = password;
    }

    await user.save();

    // Optional: send email on change
    if (emailChanged) {
      try {
        await sendEmail(email, 'Your TaskFlow email was updated', 'This is a confirmation of your recent update.');
        console.log(`Confirmation email sent to ${email}`);
      } catch (err) {
        console.error('Email failed:', err.message);
      }
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account', error: error.message });
  }
};

