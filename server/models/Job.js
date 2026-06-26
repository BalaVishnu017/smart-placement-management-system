const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  },
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  type: {
    type: String,
    enum: ['full-time', 'internship', 'ppo'],
    required: [true, 'Job type is required']
  },
  packageLPA: {
    type: Number,
    required: [true, 'Package is required']
  },
  location: {
    type: String,
    trim: true
  },
  openings: {
    type: Number,
    default: 1
  },
  skills: [{
    type: String,
    trim: true
  }],
  eligibility: {
    branches: [{
      type: String,
      enum: ['CS', 'ECE', 'ME', 'CE', 'EE', 'IT', 'OTHER']
    }],
    minCGPA: {
      type: Number,
      default: 0
    },
    maxBacklogs: {
      type: Number,
      default: 0
    },
    graduationYears: [{
      type: Number
    }]
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
