const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  project: String, // a one-to-many relationship would have been better!
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to:String,
  open: Boolean, 
  status_text: String
}, {
  timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }
})

module.exports = mongoose.model('Issue', issueSchema)
