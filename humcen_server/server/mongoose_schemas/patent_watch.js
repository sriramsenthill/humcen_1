const mongoose = require('mongoose');

const patentWatchSchema = new mongoose.Schema({
  _id: {
    job_no: {
      type: Number,
    }
  },
  field: {
    type: String,
  },
  industry_focus: {
    type: String,
  },
  competitor_information: {
    type: String,
  },
  geographic_scope: {
    type: String,
  },
  keywords: {
    type: [String],
  },
  monitoring_duration: {
    type: String,
  },
  userID: {
    type: Number,
  },
  country: {
    type: String,
  },
});

const patentWatchModel = mongoose.model('PatentWatch', patentWatchSchema, "patent_watch");

module.exports = patentWatchModel;
