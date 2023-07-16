const express = require("express");
const router = express.Router();
const verifyToken = require("../verify_token/verifyToken");
const forms = require("../user/forms");
const userSettings = require("../user/settings");
const user_auth = require("../user/signInUp");
const data = require("../admin/data")
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
  "/api/job_order",
  verifyToken,
  forms.createJobOrderPatentDrafting
);

router.post(
  "/api/patent_filing",
  verifyToken,
  forms.createJobOrderPatentFiling
);

router.post(
    "/api/patent_search",
    verifyToken,
    forms.savePatentSearchData
);

router.post(
    "/api/response_to_fer",
    verifyToken,
    forms.saveResponseToFerData
);

router.post(
    "/api/freedom_to_operate",
    verifyToken,
    forms.saveFreedomToOperateData
);

router.post("/api/patent_illustration", verifyToken, forms.savePatentIllustrationData);

router.post("/api/patent_landscape", verifyToken, forms.savePatentLandscapeData);

router.post("/api/patent_watch", verifyToken, forms.savePatentWatchData);

router.post("/api/patent_licensing", verifyToken, forms.savePatentLicenseData);

router.post(
  "/api/freedom_to_patent_portfolio_analysis",
  verifyToken,
  forms.savePatentPortfolioAnalysisData
);

router.post(
  "/api/patent_translation_services",
  verifyToken,
  forms.savePatentTranslationData
);

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

router.get("/api/admin/admin", data.getAdmins);

router.get("/api/admin/job_order", data.getJobOrders);

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

router.put("/api/partner/password", verifyPartner, partnerSetttings.updatePartnerPassword);

router.get("/api/partner/verify-token", verifyPartner, partnerSetttings.verifyPartnerToken);

//Partner_SignInUp
router.post("/api/partner", partner_auth.signUpPartner);
router.post("/api/auth/partner/signin", partner_auth.signInPartner);

//Partner_engine
router.get("/api/partner/jobs/:id", verifyPartner, engine.getPartnerJobsById);
router.get("/api/partner/job_order", verifyPartner, engine.getPartnerJobOrders);
router.put("/api/accept/:jobId", verifyPartner, engine.acceptJobOrder);
router.delete("/api/reject/:jobId", verifyPartner, engine.rejectJobOrder);
router.get("/api/partner/job_order/:id", verifyPartner, engine.getFilesForPartners);
router.get("/api/:services/:jobID", verifyPartner, engine.getJobDetailsForPartners);


module.exports = router;