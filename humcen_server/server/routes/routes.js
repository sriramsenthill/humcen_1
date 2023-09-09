const express = require("express");
const router = express.Router();
const verifyToken = require("../verify_token/verifyToken");
const forms = require("../user/forms");
const userSettings = require("../user/settings");
const user_auth = require("../user/signInUp");
const data = require("../admin/data");
const adminSettings = require("../admin/settings");
const verifyAdmin = require("../verify_token/verifyAdmin");
const admin_auth = require("../admin/signInUp");
const partnerSetttings = require("../partner/settings");
const verifyPartner = require("../verify_token/verifyPartner");
const partner_auth = require("../partner/signInUp");
const engine = require("../partner/engine");

//USERS_FORMS
router.get("/api/job_order/:id", verifyToken, forms.getJobOrderOnID);

router.get("/api/job_order", verifyToken, forms.getJobOrders);


router.post(
  "/api/consultation",
  verifyToken,
  forms.createPatentConsultation
);

router.post(
  "/api/patent_drafting",
  verifyToken,
  forms.newVersionPatentDrafting
);

// router.post(
//   "/api/job_order",
//   verifyToken,
//   forms.createJobOrderPatentDrafting
// );

router.post(
  "/api/patent_filing",
  verifyToken,
  forms.newVersionPatentFiling
);

router.post(
    "/api/patent_search",
    verifyToken,
    forms.newVersionPatentSearch
);

router.post(
    "/api/response_to_fer",
    verifyToken,
    forms.newVersionFER
);

router.post(
    "/api/freedom_to_operate",
    verifyToken,
    forms.newVersionFTO
);

router.post("/api/patent_illustration", verifyToken, forms.newVersionIllustration);

router.post("/api/patent_landscape", verifyToken, forms.newVersionLandscape);

router.post("/api/patent_watch", verifyToken, forms.newVersionWatch);

router.post("/api/patent_licensing", verifyToken, forms.newVersionLicense);

router.post(
  "/api/freedom_to_patent_portfolio_analysis",
  verifyToken,
  forms.newVersionPortfolioAnalysis
);

router.post(
  "/api/patent_translation_services",
  verifyToken,
  forms.newVersionTranslation
);

router.get("/api/user/job_files_details/:jobID", verifyToken, forms.getJobFilesDetailsForUsers);

router.get("/api/user/job_files/:jobID", verifyToken,forms.getJobFilesForUsers);

router.put("/api/user/job_order/approve/:jobID", verifyToken, forms.approveTheDoneWork); // Approval given by the User

router.put("/api/user/job_order/reject/:jobID", verifyToken, forms.rejectTheDoneWork);

// Users Notifications

router.get("/api/user/get-notifs/:userID", verifyToken, forms.getNotification) // Get Notifications for Customer

router.put("/api/seen-notif/:notifId/:userID", verifyToken, forms.notificationSeen); // Make the notification, a visited one

router.put("/api/delete-notif/:userID", verifyToken, forms.notifcationsDelete); // For deleting the Selected Notifications

router.get("/api/sort-notif/:userID/:days", verifyToken, forms.sortNotifications); // Sorting Notifications on the basis of Time Interval

router.get("/api/clear-notif/:userID", verifyToken, forms.clearRecentNotifs); // Clearing out the Recent Notifications

// Users Bulk Order

router.post("/api/new-bulk-order-request", verifyToken, forms.newBulkOrderRequest); // API for saving up Bulk Order Request

router.post("/api/bulk-order/upload-files", verifyToken, forms.uploadBulkOrderFiles); // API to get User Files uploaded for Bulk Order Generation

router.get("/api/bulk-order/check-request", verifyToken, forms.checkBulkOrderRequest); // API to check whether User had given a Bulk Order Request


//Users_Settings

router.get("/api/user/img", verifyToken, userSettings.getCustomerProfileImage);

router.get("/api/user/name", verifyToken, userSettings.getCustomerName);

router.get("/api/user/settings", verifyToken, userSettings.getCustomerSettings);

router.put("/api/user/settings", verifyToken, userSettings.updateCustomerSettings);

router.put("/api/user/pref-settings", verifyToken, userSettings.updatePreferentialSettings);

router.put("/api/user/password", verifyToken, userSettings.updateCustomerPassword);

//User_SignInUp

router.post("/api/customer", user_auth.signUpUser);

router.post("/api/auth/signin", user_auth.signInUser);

router.get("/api/verify-token", verifyToken, user_auth.verifyTokenMiddleware);

router.get("/", verifyToken, user_auth.getCustomerData);

//ADMIN DATA
router.get("/api/admin/user", data.getUsers);

router.get("/api/admin/partner", data.getPartners);

router.get("/api/admin/customer",data.getCustomers);

router.get("/api/admin/admin", data.getAdmins);

router.get("/api/admin/job_order", data.getJobOrders);

router.get("/api/admin/job_files/:jobID", data.getJobFiles);  // For getting 

router.put("/api/admin/job_files_details/:jobID", data.updateJobFilesDetails); // For giving File access to the User, if Admin accepts Partner's Work, otherwise Admin deletes it

router.get("/api/admin/job_files_details/:jobID", data.getJobFilesDetails); // For getting Partner's Work from Admin Side

router.get("/api/admin/job_order/:jobID", data.getJobOrderById); // For getting Job Details from Admin Side

// ADMIN UNASSIGNED JOBS
router.get("/api/admin/Unassigned",data.getUnassignedJobOrders);

router.get("/api/Unassigned/:jobID", data.getUnassignedJobById); // For getting Job Details from Admin Side

router.get("/api/Unassigned/only-details/:jobID", data.getUnassignedJobDetailsById); // Getting only the Necessary Details

router.get("/api/find-partner/:services/:country", data.getPartnersData); // Fetching out Available Partners to assign the Task

router.post("/api/assign", data.assignTask); // To manually assign Task to a Partner

router.get("/api/admin/user_files/:services/:id", data.getUnassignedJobFilesForAdmin); // To fetch Unassigned User Files for Admin

router.get("/api/cross-assign/find-partner/:services/:country/:partID", data.getPartnersDataForCrossAssign); // Fetching out Available Partners to Cross Assign the Task

router.post("/api/cross_assign", data.crossAssignTask); // To manually assign Task to a Partner

router.get("/api/admin/user_files/:services/:id", data.getUnassignedJobFilesForAdmin); // To fetch Unassigned User Files for Admin

// ADMIN BULK ORDERS
router.get("/api/process-base64-csv/:base", data.getCSVData); // Get CSV data through Python script

router.post("/api/admin/create-bulk-orders",  data.createBulkOrders); // Create Bulk Orders

router.get("/api/get-bulk-orders",  data.getAllBulkOrders); // For Fetching Bulk Orders for Admin

router.get("/api/bulk-order/:id",  data.getBulkOrderById); // Getting details of that particular Bulk Order

router.get("/api/bulk-order-file/:id", data.getBulkOrderFileById); // Getting details of that particular Bulk Order

router.get("/api/admin/bulk-order/partner/:service/:country", data.getPartnersForBulkOrder); // Getting Partner's Details according to the service chosen by Admin

router.post("/api/admin/bulk-order/assign/:id", data.assignBulkOrder); // API for Assigning Bulk Order Task to the Partner

router.get("/api/bulk-order-files", data.getBulkOrderFilesDetails); // Get details of User uploaded Bulk Order Files

router.get("/api/that-bulk-order-file/:fileNo", data.getParticularBulkOrderFileDetails); // This one fetches details from Bulk Order Files schema

router.get("/api/only-that-bulk-order-file/:fileNo", data.getOnlyTheParticularBulkOrderFile); // This one fetches only files from Bulk Order Files schema

router.get("/api/bulk-assign-details/:bulkLists", verifyAdmin, data.getBulkOrderAssignTabDetails); // Bulk Order details for Bulk Assign

router.get("/api/find-partners/bulk-orders/:service/:country/:bulkOrders", verifyAdmin, data.getBulkOrderAssignPartners); // Finding Partner details for Bulk Assign

router.post("/api/bulk-orders/assign/:partnerID/:bulkIDs", verifyAdmin, data.assignBulkOrdersToPartners) // Sending Assign Results for Partner Assign

// ADMIN SETTINGS
router.get("/api/admin/settings", verifyAdmin, adminSettings.getAdminProfileSettings); // For fetching Admin's Profile Settings

router.put("/api/admin/settings", verifyAdmin, adminSettings.updateAdminPersonalProfileSettings); // For Updating Admin's Personal Information Settings

router.put("/api/admin/billing-settings", verifyAdmin, adminSettings.updateAdminBillingDetails); // For Updating Admin's Billing Information Settings

router.put("/api/admin/applicant-settings", verifyAdmin, adminSettings.updateAdminApplicantDetails) // For Updating Admin's Applicant Details Settings

router.put("/api/admin/pref-settings", verifyAdmin, adminSettings.updateAdminEmailNotifDetails) // For Updating Admin's Email Notification Settings

router.put("/api/admin/password", verifyPartner, adminSettings.updateAdminPassword); // For Updating Admin's Password

//ADMIN_NOTIFICATIONS
router.get("/api/admin/get-notifs", data.getAdminNotification) // Get Notifications for Admin

router.put("/api/admin/seen-notif/:notifId", verifyAdmin, data.notificationAdminSeen); // Make the notification, a visited one

router.put("/api/admin/delete-notif", verifyAdmin, data.notifcationsAdminDelete); // For deleting the Selected Notifications

router.get("/api/admin/sort-notif/:days", verifyAdmin, data.sortAdminNotifications); // Sorting Notifications on the basis of Time Interval

router.get("/api/admin/clear-notif", verifyAdmin, data.clearAdminRecentNotifs); // Clearing out the Recent Notifications


//ADMIN_AUTH
router.post("/api/auth/admin/signin", admin_auth.adminSignIn);

router.get("/api/admin/verify-token", verifyAdmin, admin_auth.verifyAdminToken);


//Partner_Settings
router.get("/api/partner/name", verifyPartner, partnerSetttings.fetchPartnerFullName);

router.get("/api/partner/img", verifyPartner, partnerSetttings.fetchPartnerProfileImage);

router.get("/api/partner/settings", verifyPartner, partnerSetttings.fetchPartnerSettings);

router.get("/api/partner/fields", verifyPartner, partnerSetttings.fetchPartnerKnownFields);

router.put("/api/partner/settings", verifyPartner, partnerSetttings.updatePartnerSettings);

router.put("/api/partner/bank-settings", verifyPartner, partnerSetttings.updatePartnerBankDetails);

router.put("/api/partner/pref-settings", verifyPartner, partnerSetttings.updatePartnerPrefSettings);

router.put("/api/partner/service-settings", verifyPartner, partnerSetttings.editPartnerServices);

router.put("/api/partner/password", verifyPartner, partnerSetttings.updatePartnerPassword);

router.get("/api/partner/verify-token", verifyPartner, partnerSetttings.verifyPartnerToken);

//Partner_SignInUp
router.post("/api/partner", partner_auth.signUpPartner);
router.post("/api/auth/partner/signin", partner_auth.signInPartner);

//Partner_engine
router.get("/api/partner/jobs/:id", verifyPartner, engine.getPartnerJobsById);
router.get("/api/partner/job_order", verifyPartner, engine.getPartnerJobOrders);
router.put("/api/accept/:jobId", verifyPartner, engine.acceptJobOrder);
router.put("/api/partner/uploaded", verifyPartner, engine.updateTimelineForUpload);


router.delete("/api/reject/:service/:country/:jobId", verifyPartner, engine.rejectJobOrder);
router.get("/api/partner/job_order/:services/:id", verifyPartner, engine.getFilesForPartners);
router.get("/api/:services/:jobID", verifyPartner, engine.getJobDetailsForPartners);
router.get("/api/partner-details/:services/:id", verifyPartner, engine.findPartnersWithJobNo);
router.put("/api/partner/job-files", verifyPartner, engine.addJobFiles);
router.get("/api/partner/job_files_details/:jobID", verifyPartner, engine.getJobFilesDetailsForPartners);
router.get("/api/partner/get-bulk-order-file/:id", verifyPartner, engine.getAssignedBulkOrderFile);
router.put("/api/idle-job/:partner", verifyPartner, engine.sendIdleJobToUnassigned);

// Partner Notifications

router.get("/api/partner/get-notifs/:userID", verifyPartner, engine.getPartnerNotification) // Get Notifications for Customer

router.put("/api/partner/seen-notif/:notifId/:userID", verifyPartner, engine.notificationPartnerSeen); // Make the notification, a visited one

router.put("/api/partner/delete-notif/:userID", verifyPartner, engine.notifcationsPartnerDelete); // For deleting the Selected Notifications

router.get("/api/partner/sort-notif/:userID/:days", verifyPartner, engine.sortPartnerNotifications); // Sorting Notifications on the basis of Time Interval

router.get("/api/partner/clear-notif/:userID", verifyPartner, engine.clearRecentPartnerNotifs); // Clearing out the Recent Notifications


router.post("/api/find-partner", data.getPartnersData);
module.exports = router;