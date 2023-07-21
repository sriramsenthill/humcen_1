const servList = require("../Works");
const Partner = require("../mongoose_schemas/partner"); // Import the Partner model
const bcrypt = require("bcrypt"); // Import the bcrypt library



const fetchPartnerFullName = async (req, res) => {
    const userID = req.userID;
  
    try {
      // Find the partner with the given userID
      const partner = await Partner.findOne({ userID });
  
      res.json(partner.first_name + " " + partner.last_name);
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const fetchPartnerProfileImage = async (req, res) => {
    const userID = req.userID;
  
    try {
      // Find the partner with the given userID
      const partner = await Partner.findOne({ userID });
  
      res.json(partner.profile_img);
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const fetchPartnerSettings = async (req, res) => {
    const userID = req.userID;
    try {
      // Find the partner with the given userID
      const partner = await Partner.findOne({ userID });
      res.json(partner);
      console.log(partner);
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const fetchPartnerKnownFields = async (req, res) => {
    const userID = req.userID;
    try {
      // Find the partner with the given userID
      const partner = await Partner.findOne({ userID });
      res.json(partner.known_fields);
      
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const updatePartnerSettings = async (req, res) => {
    const userID = req.userID;
    const partner = await Partner.findOne({ userID });
    partner.applicant_type = req.body.data.applicant_type;
    partner.business_name = req.body.data.business_name;
    partner.company_id = req.body.data.company_id;
    partner.vat_payer = req.body.data.vat_payer;
    partner.first_name = req.body.data.first_name;
    partner.last_name = req.body.data.last_name;
    partner.email = req.body.data.email;
    partner.phno = req.body.data.phone;
    partner.position = req.body.data.position;
    partner.street = req.body.data.street;
    partner.town = req.body.data.town;
    partner.post_code = req.body.data.post_code;
    partner.country = req.body.data.country;
    partner
      .save()
      .then((res) => console.log("Successfully Updated"))
      .catch((error) =>
        console.error("Error in updating Profile Settings: ", error)
      );
  };
  
  const updatePartnerBankDetails = async (req, res) => {
    const userID = req.userID;
    const partner = await Partner.findOne({ userID });
    partner.bank.bank_name = req.body.data.bankName;
    partner.bank.account_num = req.body.data.accountNum;
    partner.bank.account_name = req.body.data.accountName;
    partner.bank.branch = req.body.data.branch;
    partner.bank.ifsc_code = req.body.data.ifscCode;
    partner.bank.address = req.body.data.address;
    partner.bank.town = req.body.data.town;
    partner.bank.post_code = req.body.data.postCode;
    partner.bank.country = req.body.data.country;
    partner
      .save()
      .then((res) => console.log("Bank Details Successfully Updated"))
      .catch((error) =>
        console.error("Error in updating Profile Settings: ", error)
      );
  };
  
  const updatePartnerPrefSettings = async (req, res) => {
    const userID = req.userID;
    const partner = await Partner.findOne({ userID });
    partner.pref.mails = req.body.data.mails;
    partner.pref.order_updates = req.body.data.order_updates;
    partner.pref.marketing_emails = req.body.data.marketing_emails;
    partner.pref.newsletter = req.body.data.newsletter;
    partner
      .save()
      .then((res) => console.log("Partner's Preferentials Successfully Updated"))
      .catch((error) =>
        console.error(
          "Error in updating Partner's Preferential Profile Settings: ",
          error
        )
      );
  };
  
  const editPartnerServices = async (req, res) => {
    const serviceList = servList.map(elem => elem.title);
    const userID = req.userID;
    const partner = await Partner.findOne({ userID });
    req.body.data.known_fields.forEach((field) => {
      partner.known_fields[field] = true;
    });
    const remService = serviceList.filter((elem) => !req.body.data.known_fields.includes(elem));
    remService.forEach((service)=> {
      partner.known_fields[service] = false;
    });
    partner
      .save()
      .then((res) => console.log("Partner's Service Settings Successfully Updated"))
      .catch((error) =>
        console.error(
          "Error in updating Partner's Service Settings: ",
          error
        )
      );
  }

  const updatePartnerPassword = async (req, res) => {
    const userID = req.userID;
    const partner = await Partner.findOne({ userID });
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error creating/updating Partner");
      }
  
      bcrypt.hash(req.body.data.password, salt, async (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error creating/updating Partner");
        }
  
        partner.password = hashedPassword;
        partner
          .save()
          .then((res) =>
            console.log("Successfully Updated the Partner's Password")
          )
          .catch((error) =>
            console.error("Error in updating Partner's Password: ", error)
          );
      });
    });
  };
  
  const verifyPartnerToken = async (req, res) => {
    try {
      const userID = req.userID;
      const user = await Partner.findOne({ userID });
      console.log(user);
      if (!user) {
        // User not found, return an error response
        return res.status(404).json({ message: "User not found" });
      }
  
      // Fetch other user-specific data from respective collections if needed
  
      res.json({ user });
    } catch (error) {
      console.error("Error fetching user specific data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  module.exports = {
    fetchPartnerFullName,
    fetchPartnerProfileImage,
    fetchPartnerSettings,
    fetchPartnerKnownFields,
    updatePartnerSettings,
    updatePartnerBankDetails,
    updatePartnerPrefSettings,
    updatePartnerPassword,
    editPartnerServices,
    verifyPartnerToken
  };