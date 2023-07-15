const JobOrder = require("../mongoose_schemas/job_order"); // Import the JobOrder model
const Customer = require("../mongoose_schemas/customer"); // Import the Customer model
const bcrypt = require("bcrypt"); // Import the bcrypt library
const jwt = require("jsonwebtoken");



const generateUserID = async () => {
  try {
    const latestUser = await Customer.findOne().sort({ userID: -1 }).limit(1).exec();

    const lastUserID = latestUser ? parseInt(latestUser.userID) : 0;
    const newUserID = (lastUserID + 1).toString();

    return newUserID;
  } catch (error) {
    console.error("Error generating userID:", error);
    throw error;
  }
};

const signUpUser = async (req, res) => {
  try {
    const customerData = req.body;

    const existingCustomer = await Customer.findOne({
      email: customerData.email,
    });

    if (existingCustomer) {
      return res.status(400).json({
        error: "User already exists. Try creating with another email.",
      });
    }

    const userID = await generateUserID();

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error creating/updating customer");
      }

      bcrypt.hash(customerData.password, salt, async (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error creating/updating customer");
        }

        customerData.userID = userID;
        customerData.password = hashedPassword;
        customerData.profile_img = "https://api.multiavatar.com/" + userID + ".png";
        const newCustomer = new Customer(customerData);
        const savedCustomer = await newCustomer.save();

        res.status(201).json(savedCustomer);
        console.log(savedCustomer);
      });
    });
  } catch (error) {
    console.error("Error creating/updating customer:", error);
    res.status(500).send("Error creating/updating customer");
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Customer.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.userID }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Failed to sign in:", error);
    res.status(500).json({ message: "Failed to sign in" });
  }
};

const verifyTokenMiddleware = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Customer.findOne({ userID: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobOrders = await JobOrder.find({ userID: userId });

    res.json({ user, jobOrders });
  } catch (error) {
    console.error("Error fetching user specific data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCustomerData = async (req, res) => {
  try {
    const userId = req.userId;
    const customer = await Customer.findOne({ userID: userId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Additional logic if needed
    const {jobs}=customer
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching customer data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};








module.exports = {
  signUpUser,
  signInUser,
  verifyTokenMiddleware,
  getCustomerData
};