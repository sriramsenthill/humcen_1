const mongoose = require('mongoose');

const filing = new mongoose.Schema({
  _id: {
    job_no: { type: Number }
  },
  country: { type: String },
  budget: { type: String   },
  userID: { type: Number },
  job_title: { type: String },
  keywords: { type: String },
  service: {type: String},
  start_date: { type: Date },
  end_date: { type: Date },
  status: { type: String },
  Accepted: {
    type: Boolean,
    default: false,
  },
  service_specific_files: {
    application_type: { type: String },
    details: { type: Object },
    applicants: { type: Object },
    investors: { type: Object }
  },
  domain: { type: String },
  time_of_delivery: { type: String },
});

const Filing = mongoose.model('filing', filing, 'patent_filing');

module.exports = Filing;