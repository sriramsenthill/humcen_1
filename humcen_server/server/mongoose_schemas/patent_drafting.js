const mongoose = require('mongoose');

const drafting = new mongoose.Schema({
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
    invention_details: { type: Object },
  },
  domain: { type: String },
});

const Drafting = mongoose.model('drafting', drafting, 'patent_drafting');

module.exports = Drafting;