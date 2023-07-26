const mongoose = require('mongoose');

const UnassignedJobOrderSchema = new mongoose.Schema({}, {strict: false});

const UnassignedJobOrder = mongoose.model('UnassignedJobOrder', UnassignedJobOrderSchema, 'unassigned_job_order');

module.exports = UnassignedJobOrder;
