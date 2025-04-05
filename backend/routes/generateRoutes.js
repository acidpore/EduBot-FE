/**
 * Generate Routes
 * 
 * Routes yang menangani permintaan ke AI generator
 * untuk menghasilkan respons dari prompt yang diberikan.
 */
const express = require('express');
const router = express.Router();
const { generateResponse } = require('../controllers/generateController');

/**
 * @route   POST /api/generate
 * @desc    Generate AI response based on user prompt
 * @access  Public
 */
router.post('/', generateResponse);

module.exports = router; 