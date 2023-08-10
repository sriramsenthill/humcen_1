const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  _id: {
    job_no: { type: Number }
  },
  user_ID: {
    type: Number,
  },
  bulk_order_service: { type: String, default: "" },
  country: { type: String, default: "" },
  partnerID: { type: String, default: "" },
  partnerName: { type: String, default: "" },
  bulk_order_title: {
    type: String,
  },
  bulk_order_files: {
    type: Object,
  },
  Assigned: {
    type: Boolean,
    default: false,
  }
});

const BulkOrder = mongoose.model('BulkOrder', bulkOrderSchema, 'bulk_order');

module.exports = BulkOrder;
