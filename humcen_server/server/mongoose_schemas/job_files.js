const mongoose = require('mongoose');

const jobFilesSchema = new mongoose.Schema({
  _id: {
    job_no: { type: Number }
  },
  service: { type: String },
  country: { type: String },
  partnerID: { type: String },
  partnerName: { type: String },
  job_files: {
    type: Object,
  },
  access_provided: {
    type: Boolean,
    default: false,
  },
  verification: {
    type: String,
    default: "In Progress",
  },
  decided: {
    type: Boolean,
    default: false,
  },
  approval_given: {
    type: Boolean,
    default: false,
  },
  user_decided: {
    type: Boolean,
    default: false,
  }
});

const JobFiles = mongoose.model('JobFiles', jobFilesSchema, 'job_files');

module.exports = JobFiles;
