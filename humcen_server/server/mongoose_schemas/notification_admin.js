const mongoose = require('mongoose');

const NotificationAdminSchema = new mongoose.Schema({
    admin_Id: {
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

const NotificationAdminModel = mongoose.model('NotificationAdmin', NotificationAdminSchema, 'notification_admin');

module.exports = NotificationAdminModel;
