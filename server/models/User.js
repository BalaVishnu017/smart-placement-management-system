const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  rollNo: {
    type: String,
    trim: true
  },
  branch: {
    type: String,
    enum: ['CS', 'ECE', 'ME', 'CE', 'EE', 'IT', 'OTHER'],
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  graduationYear: {
    type: Number
  },
  cgpa: {
    type: Number,
    min: [0, 'CGPA cannot be less than 0'],
    max: [10, 'CGPA cannot be more than 10']
  },
  tenthPercent: {
    type: Number,
    min: [0, 'Percentage cannot be less than 0'],
    max: [100, 'Percentage cannot exceed 100']
  },
  twelfthPercent: {
    type: Number,
    min: [0, 'Percentage cannot be less than 0'],
    max: [100, 'Percentage cannot exceed 100']
  },
  backlogs: {
    type: Number,
    default: 0,
    min: 0
  },
  phone: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  isPlaced: {
    type: Boolean,
    default: false
  },
  placedCompany: {
    type: String,
    trim: true
  },
  placedPackage: {
    type: Number
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
