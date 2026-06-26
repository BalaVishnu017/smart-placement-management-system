const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  activeGraduationYear: {
    type: Number,
    required: true,
    default: 2026
  }
}, { timestamps: true });

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
