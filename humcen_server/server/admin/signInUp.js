const Admin = require("../mongoose_schemas/admin"); // Import the Admin model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
      // User not found, return an error response
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if the entered password matches the password stored in the database
    if (!isPasswordValid) {
      // Incorrect password, return an error response
      return res.status(401).json({ message: "Invalid password" });
    }

    // Authentication successful, sign and send the JWT token
    const token = jwt.sign({ email: user.email }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Failed to sign in:", error);
    res.status(500).json({ message: "Failed to sign in" });
  }
};

const verifyAdminToken = async (req, res) => {
  try {
    const email = req.email;
    const user = await Admin.findOne({ email });

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
  adminSignIn,
  verifyAdminToken
};