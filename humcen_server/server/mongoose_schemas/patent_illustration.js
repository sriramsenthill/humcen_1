const mongoose = require('mongoose');

const patentIllustrationToOperateSchema = new mongoose.Schema({
    _id: {
      job_no: {
      type: Number,
    },
    },
    field: {
      type: String,
    },
    country: {
      type: String,
    },
    patent_specifications: {
      type: String,
    },
    drawing_requirements: {
      type: String,
    },
    preferred_style: {
      type: Object,
    },
    userID: {
      type: Number,
    },
  });

  const patentIllustration = mongoose.model('patentIllustration', patentIllustrationToOperateSchema, 'patent_illustration');

  module.exports = patentIllustration;