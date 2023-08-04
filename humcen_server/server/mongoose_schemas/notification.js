const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user_Id: {
        type: Number,
    },
    notifications: [
        {
        notifNum: {
            type: Number,
            default: 0,
        },
        notifText: {
            type: String,
        },
        notifDate: {
            type: Date,
        },
        seen: {
            type: Boolean,
            default: false,
        }
    }
    ]
});

const NotificationModel = mongoose.model('Notification', NotificationSchema, 'notification');

module.exports = NotificationModel;
