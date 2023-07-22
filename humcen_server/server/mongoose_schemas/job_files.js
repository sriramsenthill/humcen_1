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
  }
});

const JobFiles = mongoose.model('JobFiles', jobFilesSchema, 'job_files');

module.exports = JobFiles;
