const mongoose = require('mongoose');

const bulkOrderFilesSchema = new mongoose.Schema({
  _id: {
    job_no: { type: Number }
  },
  user_ID: {
    type: Number,
  },
  service: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  country: {
    type: String,
  },
});

const BulkOrderFiles = mongoose.model('BulkOrderFiles', bulkOrderFilesSchema, 'bulk_order_files');

module.exports = BulkOrderFiles;
