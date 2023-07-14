const Partner = require("../mongoose_schemas/partner"); // Import the Partner model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generatePartnerID = async () => {
    try {
      const latestPartner = await Partner.findOne()
        .sort({ userID: -1 })
        .limit(1)
        .exec();
  
      const lastPartnerID = latestPartner ? parseInt(latestPartner.userID) : 0;
      const newPartnerID = (lastPartnerID + 1).toString();
  
      return newPartnerID;
    } catch (error) {
      console.error("Error generating partnerID:", error);
      throw error;
    }
  };
  
  const signUpPartner = async (req, res) => {
    try {
      const partnerData = req.body;
  
      const existingPartner = await Partner.findOne({
        email: partnerData.email,
      });
  
      if (existingPartner) {
        // Email already exists, return an error response
        return res.status(400).json({
          error: "User already exists. Try creating with another email.",
        });
      }
  
      // Generate a new userID
      const userID = await generatePartnerID();
  
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error creating/updating partner");
        }
  
        bcrypt.hash(partnerData.password, salt, async (err, hashedPassword) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error creating/updating partner");
          }
  
          partnerData.userID = userID; // Convert userID to a string
          partnerData.password = hashedPassword;
          partnerData.profile_img =
            "https://api.multiavatar.com/-" + userID + ".png"; // User's Profile Avatar
          partnerData.known_fields = req.body.known_fields;
          const newPartner = new Partner(partnerData);
          partnerData.known_fields.forEach((field) => {
            newPartner.known_fields[field] = true;
          });
          const savedPartner = await newPartner.save();
  
          res.status(201).json(savedPartner);
        });
      });
    } catch (error) {
      console.error("Error creating/updating partner:", error);
      res.status(500).send("Error creating/updating partner");
    }
  };
  
  const signInPartner = async (req, res) => {
    try {
      const { email, password } = req.body;
      const partner = await Partner.findOne({ email });
  
      if (!partner) {
        // User not found, return an error response
        return res.status(404).json({ message: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, partner.password);
  
      if (!isPasswordValid) {
        // Incorrect password, return an error response
        return res.status(401).json({ message: "Invalid password" });
      }
  
      // Authentication successful, sign and send the JWT token
      const token = jwt.sign({ userID: partner.userID }, "your-secret-key", {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      console.error("Failed to sign in:", error);
      res.status(500).json({ message: "Failed to sign in" });
    }
  };

  module.exports = {
    signUpPartner,
    signInPartner
  };