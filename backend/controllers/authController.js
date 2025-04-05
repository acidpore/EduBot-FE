/**
 * Authentication Controller
 * 
 * Controller untuk menangani operasi autentikasi:
 * - Pendaftaran pengguna baru
 * - Login pengguna
 * - Validasi kredensial
 */
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for authenticated user
 * 
 * @param {Object} user - User object containing id and name
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Format user response data (removes sensitive fields)
 * 
 * @param {Object} user - Full user object from database
 * @returns {Object} User object with only public fields
 */
const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
};

/**
 * Register a new user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with user data and token
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token and send response
    const token = generateToken(user);
    res.status(201).json({
      user: formatUserResponse(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Login existing user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with user data and token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token and send response
    const token = generateToken(user);
    res.status(200).json({
      user: formatUserResponse(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
}; 