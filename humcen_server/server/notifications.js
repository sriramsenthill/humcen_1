const Notification = require( "./mongoose_schemas/notification");
const NotificationAdmin = require("./mongoose_schemas/notification_admin");
const NotificationPartner = require("./mongoose_schemas/notification_partner");


const sendToUser = async(id, message) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const notificationHub = await Notification.findOne({user_Id: id});
    if (!notificationHub) {
      const newNotificationDoc = new Notification({
        user_Id: id,
        notifications: [
          {
            notifNum: 1,
            notifText: message,
            notifDate: formattedDate,
            seen: false,
          }
        ]
      })
      newNotificationDoc.save().then(() => {
        console.log("User Notification sent Successfully");
      }).catch((err) => {
        console.error("Error in sending Notification : " + err);
      })
    } else {
      const newNotification = {
        notifNum: notificationHub.notifications.length + 1,
        notifText: message,
        notifDate: formattedDate,
        seen: false,
      }
      notificationHub.notifications.push(newNotification);
      notificationHub.save().then(() => {
        console.log("User Notification sent Successfully");
      }).catch((err) => {
        console.error("Error in sending Notification : " + err);
      });

    }
}

const sendToPartner = async(id, message ) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const notificationHub = await NotificationPartner.findOne({partner_Id: id});
    if (!notificationHub) {
      const newNotificationDoc = new NotificationPartner({
        partner_Id: id,
        notifications: [
          {
            notifNum: 1,
            notifText: message,
            notifDate: formattedDate,
            seen: false,
          }
        ]
      })
      newNotificationDoc.save().then(() => {
        console.log("Partner Notification sent Successfully");
      }).catch((err) => {
        console.error("Error in sending Notification : " + err);
      })
    } else {
      const newNotification = {
        notifNum: notificationHub.notifications.length + 1,
        notifText: message,
        notifDate: formattedDate,
        seen: false,
      }
      notificationHub.notifications.push(newNotification);
      notificationHub.save().then(() => {
        console.log("Partner Notification sent Successfully");
      }).catch((err) => {
        console.error("Error in sending Notification : " + err);
      });

    }
}

const sendToAdmin = async(message) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date().toLocaleDateString(undefined, options);

    const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
    if (!notificationAdminHub) {
      const newNotificationAdminDoc = new NotificationAdmin({
        admin_Id: 1,
        notifications: [
          {
            notifNum: 1,
            notifText: message,
            notifDate: formattedDate,
            seen: false,
          }
        ]
      })
      newNotificationAdminDoc.save().then(() => {
        console.log("Admin Notification sent Successfully");
      }).catch((err) => {
        console.error("Error in sending Notification : " + err);
      })
    } else {
      const newNotificationAdmin = {
        notifNum: notificationAdminHub.notifications.length + 1,
        notifText: message,
        notifDate: formattedDate,
        seen: false,
      }
      notificationAdminHub.notifications.push(newNotificationAdmin);
      notificationAdminHub.save().then(() => {
        console.log("Admin Notification sent Successfully");
      }).catch((err) => {
        console.error("Error in sending Notification : " + err);
      });
    }
}


module.exports = {
    sendToUser,
    sendToPartner,
    sendToAdmin,
};