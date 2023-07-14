const Customer = require("../mongoose_schemas/customer"); // Import the Customer model
const bcrypt = require("bcrypt"); // Import the bcrypt library

const getCustomerProfileImage = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await Customer.findOne({ userID: userId });
    res.json(user.profile_img);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCustomerName = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await Customer.findOne({ userID: userId });
    res.json(user.first_name + " " + user.last_name);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCustomerSettings = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await Customer.findOne({ userID: userId });
    res.json(user);
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCustomerSettings = async (req, res) => {
  const userId = req.userId;
  const user = await Customer.findOne({ userID: userId });
  user.first_name = req.body.data.fName;
  user.last_name = req.body.data.lName;
  user.email = req.body.data.email;
  user.phno = req.body.data.phone;
  user
    .save()
    .then((response) => console.log("Successfully Updated"))
    .catch((error) =>
      console.error("Error in updating Profile Settings: ", error)
    );
};

const updatePreferentialSettings = async (req, res) => {
  const userId = req.userId;
  const user = await Customer.findOne({ userID: userId });
  user.pref.mails = req.body.data.mails;
  user.pref.order_updates = req.body.data.order_updates;
  user.pref.marketing_emails = req.body.data.marketing_emails;
  user.pref.newsletter = req.body.data.newsletter;
  user
    .save()
    .then((response) => console.log("Successfully Updated"))
    .catch((error) =>
      console.error(
        "Error in updating User's Preferential Profile Settings: ",
        error
      )
    );
};

const updateCustomerPassword = async (req, res) => {
  const userId = req.userId;
  const user = await Customer.findOne({ userID: userId });
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error creating/updating customer");
    }

    bcrypt.hash(
      req.body.data.password,
      salt,
      async (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error creating/updating customer");
        }

        user.password = hashedPassword;
        user
          .save()
          .then((response) =>
            console.log("Successfully Updated the Password")
          )
          .catch((error) =>
            console.error("Error in updating User's Password: ", error)
          );
      }
    );
  });
};

module.exports = {
  getCustomerProfileImage,
  getCustomerName,
  getCustomerSettings,
  updateCustomerSettings,
  updatePreferentialSettings,
  updateCustomerPassword
};