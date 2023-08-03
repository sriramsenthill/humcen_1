const Admin = require("../mongoose_schemas/admin"); // Import the Admin model
const bcrypt = require("bcrypt"); // Import the bcrypt library

const getAdminProfileSettings = async(req, res) => {
    try{
        const adminProfile = await Admin.findOne({_id: "64803aa4b57edc54d6b276cb"});
        if(!adminProfile) {
            console.error("No Admin exists with that ID");
        } else {
            res.json(adminProfile);
        }
    } catch(error) {
        console.error("Error in Fetching Admin Settings : " + error);
    }
}

const updateAdminPersonalProfileSettings = async(req, res) => {
    const details = req.body;
    console.log(details);
    try {
        const adminProfile = await Admin.findOne({_id: "64803aa4b57edc54d6b276cb"});
        if(!adminProfile) {
            console.error("No Admin exists with that ID");
        } else {
            adminProfile.name = details.name;
            adminProfile.surname = details.surname;
            adminProfile.email = details.email;
            adminProfile.phone = details.phone;
            adminProfile.save().then(() => {
                console.log("Admin's Personal Information Updated Successfully");
            }).catch((error) => {
                console.error("Error in Updating Personal Information : " + error);
            });
        }
    } catch(error) {
        console.error("Error in updating Admin's Profile Settings : " + error);
    }

}

const updateAdminBillingDetails = async(req, res) => {
    const billingInfo = req.body;
    try {
        const adminBillingSettings = await Admin.findOne({_id: "64803aa4b57edc54d6b276cb"});
        if(!adminBillingSettings) {
            console.log("No Admin present for that particular ID");
        } else {
            adminBillingSettings.billing = {
                bank_name: billingInfo.bankName,
                account_name: billingInfo.accountName,
                account_number: billingInfo.accountNumber,
                branch: billingInfo.branch,
                ifsc_code: billingInfo.ifscCode,
                address: billingInfo.address,
                town: billingInfo.town,
                postcode: billingInfo.postcode,
                country: billingInfo.country,
            }

            adminBillingSettings.save().then(() => {
                console.log("Admin's Billing Information successfully updated.");
            }).catch((error) => {
                console.error("Error in updating Admin's Billing Information : " + error);
            });
        }
    } catch(error) {
        console.error("Error in Updating Admin's Billing Information : " + error);
    }
}

const updateAdminApplicantDetails = async(req, res) => {
    const applicantDetails = req.body;
    try {
        const adminProfileDetails = await Admin.findOne({_id: "64803aa4b57edc54d6b276cb"});
        if(!adminProfileDetails) {
            console.log("No Admin Found with that particular ID");
        } else {
            adminProfileDetails.applicant_details = applicantDetails;
            adminProfileDetails.save().then(() => {
                console.log("Admin's Applicant Details Settings Successfully Updated .");
            }).catch((error) => {
                console.error("Error in Updating Admin's Applicant Details Settings : " + error);
            });
        }
    } catch(error) {
        console.error("Error in updating Admin's Applicant Details Settings : " + error);
    }
}

const updateAdminEmailNotifDetails = async(req, res) => {
    const emailDetails = req.body;
    try {
        const adminProfileDetails = await Admin.findOne({_id: "64803aa4b57edc54d6b276cb"});
        if(!adminProfileDetails) {
            console.log("No Admin Found with that particular ID");
        } else {
            adminProfileDetails.pref = emailDetails;
            adminProfileDetails.save().then(() => {
                console.log("Admin's Email Notification Details Settings Successfully Updated .");
            }).catch((error) => {
                console.error("Error in Updating Admin's Email Notification Details Settings : " + error);
            });
        }
    } catch(error) {
        console.error("Error in updating Admin's Email Notification Details Settings : " + error);
    }
}

const updateAdminPassword = async (req, res) => {
    try {
        const adminProfileDetails = await Admin.findOne({_id: "64803aa4b57edc54d6b276cb"});
        if (!adminProfileDetails) {
            console.log("No Admin Found with that particular ID");
        } else {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Error creating/updating Partner");
              }
          
              bcrypt.hash(Object.keys(req.body)[0], salt, async (err, hashedPassword) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send("Error creating/updating Partner");
                }
          
                adminProfileDetails.password = hashedPassword;
                adminProfileDetails
                  .save()
                  .then((res) =>
                    console.log("Successfully Updated the Partner's Password")
                  )
                  .catch((error) =>
                    console.error("Error in updating Partner's Password: ", error)
                  );
              });
            });
              }
            }
        catch {
            console.error("Error in Updating Admin's Password : " + error);
        }
        }
        

module.exports = {
    getAdminProfileSettings,
    updateAdminPersonalProfileSettings,
    updateAdminBillingDetails,
    updateAdminApplicantDetails,
    updateAdminEmailNotifDetails,
    updateAdminPassword,
};