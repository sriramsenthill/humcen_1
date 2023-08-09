const mongoose = require('mongoose');

const bulkOrderFilesSchema = new mongoose.Schema({
  _id: {
    job_no: { type: Number }
  },
  user_ID: {
    type: Number,
  },
  bulk_order_files: {
    type: Object,
  },
});

const BulkOrderFiles = mongoose.model('BulkOrderFiles', bulkOrderFilesSchema, 'bulk_order_files');

module.exports = BulkOrderFiles;
