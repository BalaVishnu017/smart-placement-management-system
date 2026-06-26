const mongoose = require('mongoose');

const companyResourceSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  },
  type: {
    type: String,
    enum: ['pyq', 'coding', 'aptitude', 'technical_interview', 'hr_interview', 'recruitment_process', 'tech_stack', 'company_overview'],
    required: [true, 'Resource type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  year: {
    type: Number
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries by company and type
companyResourceSchema.index({ company: 1, type: 1 });

module.exports = mongoose.model('CompanyResource', companyResourceSchema);
