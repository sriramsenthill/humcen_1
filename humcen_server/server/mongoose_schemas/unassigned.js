const mongoose = require('mongoose');

const UnassignedJobOrderSchema = new mongoose.Schema({
  _id: {
    job_no: { type: Number }
  },
  service: { type: String },
  country: { type: String },
});

const UnassignedJobOrder = mongoose.model('UnassignedJobOrder', UnassignedJobOrderSchema, 'unassigned_job_order');

module.exports = UnassignedJobOrder;
