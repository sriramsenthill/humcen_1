const mongoose = require('mongoose');

const UnassignedJobOrderSchema = new mongoose.Schema({
    _id : {
        job_no: {
            type: Number,
        }
    }
}, {strict: false});

const UnassignedJobOrder = mongoose.model('UnassignedJobOrder', UnassignedJobOrderSchema, 'unassigned_job_order');

module.exports = UnassignedJobOrder;
