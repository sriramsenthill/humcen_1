const mongoose = require('mongoose');

const NotificationPartnerSchema = new mongoose.Schema({
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

const NotificationPartnerModel = mongoose.model('NotificationPartner', NotificationPartnerSchema, 'notification_partner');

module.exports = NotificationPartnerModel;
