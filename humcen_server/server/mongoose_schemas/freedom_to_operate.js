const mongoose = require('mongoose');

const freedomToOperateSchema = new mongoose.Schema({
  _id: {
    job_no: { type: Number }
  },
  field: {
    type: String,
  },
  invention_description: {
    type: Object,
  },
  patent_application_details: {
    type: Object,
  },
  keywords: {
    type: [String],
  },
  userID: {
    type: Number,
  },
  country: {
    type: String,
  },
});

const freedomToOperate = mongoose.model('FreedomToOperate', freedomToOperateSchema, 'freedom_to_operate_search');

module.exports = freedomToOperate;
