/**
 * User Model
 * 
 * Skema MongoDB untuk menyimpan informasi pengguna,
 * dengan metode untuk hashing password dan validasi.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: true // Include password by default (needed for login)
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

/**
 * Middleware: Hash password before saving to database
 * Only runs when password field is modified
 */
UserSchema.pre('save', async function() {
  // Only hash the password if it's modified
  if (!this.isModified('password')) return;
  
  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare provided password with stored hashed password
 * 
 * @param {string} candidatePassword - Password to check against stored hash
 * @returns {boolean} True if password matches, false otherwise
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema); 