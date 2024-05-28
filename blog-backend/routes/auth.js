const express = require('express');
const router = express.Router();
const { register, login, getAllUsers,getUserProfile,updateUserProfile} = require('../controllers/authController');
const { registerValidation, loginValidation ,updateValidation} = require('../validation/auth');
const auth = require('../middleware/Auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET api/auth/users
// @desc    Get all users
// @access  Private
router.get('/users',  auth, getAllUsers);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getUserProfile);

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [auth, updateValidation], updateUserProfile);

module.exports = router;
