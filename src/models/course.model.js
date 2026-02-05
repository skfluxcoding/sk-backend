const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * Course model (basic)
 * Fields: title, description, instructor, published
 */
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  published: {
    type: Boolean,
    default: false
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Add pagination plugin
CourseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Course', CourseSchema);
