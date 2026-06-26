const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Drive title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  driveDate: {
    type: Date,
    required: [true, 'Drive date is required']
  },
  lastDateToApply: {
    type: Date,
    required: [true, 'Last date to apply is required']
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
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
  instructions: {
    type: String,
    trim: true
  },
  venue: {
    type: String,
    trim: true
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

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
