const express = require("express");
const Search = require("./search"); // Import the Patent Search Model
const mongoose = require("mongoose");
const servList = require("./Works");
const patentPortfolioAnalysis = require("./patent_portfolio_analysis"); // Import Patent Portfolio Analysis Model
const patentTranslation = require("./patent_translation_service"); // Import Patent Translation Services Mode
const patentLicense = require("./patent_licensing"); // Import Patent Licensing and Commercialization Services Model
const patentLandscape = require("./freedom_to_patent_landscape"); // Import Freedom to Patent Landscape Model
const patentWatch = require("./patent_watch"); // Import Patent Watch Model
const responseToFer = require("./response_to_fer"); // Import Response To FER Model
const freedomToOperate = require("./freedom_to_operate"); // Import the Freedom To Operate Search Model
const JobOrder = require("./job_order"); // Import the JobOrder model
const Admin = require("./admin"); // Import the Admin model
const Partner = require("./partner"); // Import the Partner model
const User = require("./user"); // Import the User model
const Customer = require("./customer"); // Import the Customer model
const bcrypt = require("bcrypt"); // Import the bcrypt library
const cors = require("cors");
const jwt = require("jsonwebtoken");
const patentIllustration = require("./patent_illustration"); // Import Patent Illustration Model
const Consultation = require("./consultation");
const verifyToken = require("./verifyToken");
const { ObjectId } = require("mongoose");
const verifyAdmin = require("../server/verifyAdmin");
const verifyPartner = require("../server/verifyPartner");
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

// Connect to your MongoDB database
mongoose
  .connect(
    "mongodb+srv://sriram:password12345@humcen.iaiznbp.mongodb.net/humcen?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// NEW USER ID CREATION FROM CUSTOMER TABLE FOR USERS
const generateUserID = async () => {
  try {
    const latestUser = await Customer.findOne()
      .sort({ userID: -1 })
      .limit(1)
      .exec();

    const lastUserID = latestUser ? parseInt(latestUser.userID) : 0;
    const newUserID = (lastUserID + 1).toString();

    return newUserID;
  } catch (error) {
    console.error("Error generating userID:", error);
    throw error;
  }
};

//this is exclusively for the USER HUMCEN

// Define API endpoint for fetching customer profile image
app.get("/api/user/img", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    // Find the customer with the given userId
    const user = await Customer.findOne({ userID: userId });

    res.json(user.profile_img);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint for fetching customer's first name
app.get("/api/user/name", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    // Find the customer with the given userId
    const user = await Customer.findOne({ userID: userId });

    res.json(user.first_name + " " + user.last_name);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint for fetching Customer's Settings
app.get("/api/user/settings", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    // Find the customer with the given userId
    const user = await Customer.findOne({ userID: userId });
    res.json(user);
    console.log(user);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint for updating Customer's Settings
app.put("/api/user/settings", verifyToken, async (req, res) => {
  const userId = req.userId;
  const user = await Customer.findOne({ userID: userId });
  user.first_name = req.body.data.fName;
  user.last_name = req.body.data.lName;
  user.email = req.body.data.email;
  user.phno = req.body.data.phone;
  user
    .save()
    .then((res) => console.log("Successfully Updated"))
    .catch((error) =>
      console.error("Error in updating Profile Settings: ", error)
    );
});

// API endpoint for updating Customer's Preferential Settings
app.put("/api/user/pref-settings", verifyToken, async (req, res) => {
  const userId = req.userId;
  const user = await Customer.findOne({ userID: userId });
  user.pref.mails = req.body.data.mails;
  user.pref.order_updates = req.body.data.order_updates;
  user.pref.marketing_emails = req.body.data.marketing_emails;
  user.pref.newsletter = req.body.data.newsletter;
  user
    .save()
    .then((res) => console.log("Successfully Updated"))
    .catch((error) =>
      console.error(
        "Error in updating User's Preferential Profile Settings: ",
        error
      )
    );
});

// API endpoint for updating Customer's Password
app.put("/api/user/password", verifyToken, async (req, res) => {
  const userId = req.userId;
  const user = await Customer.findOne({ userID: userId });
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error creating/updating customer");
    }

    bcrypt.hash(req.body.data.password, salt, async (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error creating/updating customer");
      }

      user.password = hashedPassword;
      user
        .save()
        .then((res) => console.log("Successfully Updated the Password"))
        .catch((error) =>
          console.error("Error in updating User's Password: ", error)
        );
    });
  });
});

// Define your API route for fetching job order data
app.get("/api/job_order/:id", verifyToken, async (req, res) => {
  // Retrieve the job order data based on the provided id
  const { id } = req.params;
  const userID = req.userId; // Assuming you have a userId available after verifying the token

  try {
    // Perform database query to fetch the job order data for the specific user
    const specificJob = await JobOrder.findOne({ "_id.job_no": id, userID });

    if (specificJob) {
      // Return the specific job order data as the response
      res.json(specificJob);
    } else {
      // Return an error message if no job order found with the provided id or for the specific user
      res
        .status(404)
        .json({
          error: "No job found with the provided id or unauthorized access",
        });
    }
  } catch (error) {
    console.error("Error fetching job order data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//JOB_ORDER TABLE FOR SPECIFIC USER
app.get("/api/job_order", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const jobOrders = await JobOrder.find({ userID: userId });

    res.json({ jobOrders });
  } catch (error) {
    console.error("Error fetching job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// NEW JOB_ORDER CREATION FOR PATENT DRAFTING

app.post("/api/job_order", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const jobOrderData = req.body;

    // Set default values
    jobOrderData.userID = userId;
    jobOrderData.service = "Patent Drafting";
    jobOrderData.start_date = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // Add 7 days
    jobOrderData.end_date = endDate;
    jobOrderData.status = "In Progress";

    // Fetch the latest job_no from the database
    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    jobOrderData._id = { job_no: newJobNo };

    // Create a new JobOrder instance using the received data
    const jobOrder = new JobOrder(jobOrderData);

    // Save the job order to the database
    const savedJobOrder = await jobOrder.save();

    // Finding Free Partners and Assigning Patent Drafting to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);

    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;
    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Drafting Task to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Drafting Task to the Partner");
      });

    res.status(200).json(savedJobOrder);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
});

// NEW MEETING CREATION FOR PATENT CONSULTATION

app.post("/api/consultation", verifyToken, async (req, res) => {
  try {
    const { service, email, meeting_date_time } = req.body;
    const userId = req.userId; // Access the userId from the token

    // Store the data in MongoDB
    const consultation = await Consultation.create({
      userID: userId,
      service,
      email,
      meeting_date_time,
    });

    res.status(201).json(consultation);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to schedule consultation." });
  }
});

// NEW JOB_ORDER CREATION FOR PATENT FILLING

app.post("/api/patent_filing", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const jobOrderData = req.body;

    // Set default values
    jobOrderData.userID = userId;
    jobOrderData.service = "Patent Filing";
    jobOrderData.start_date = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // Add 7 days
    jobOrderData.end_date = endDate;
    jobOrderData.status = "In Progress";
    jobOrderData.budget = req.body.budget;
    jobOrderData.country = req.body.country;

    // Fetch the latest job_no from the database
    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    jobOrderData._id = { job_no: newJobNo };

    // Create a new JobOrder instance using the received data
    const jobOrder = new JobOrder(jobOrderData);

    // Save the job order to the database
    const savedJobOrder = await jobOrder.save();
    // Finding Free Partners and Assigning Task to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;
    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Filing to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Filing to the Partner");
      });

    res.status(200).json(savedJobOrder);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
});

// API route which saves the data obtained from Patent Search Form
app.post("/api/patent_search", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const searchData = req.body;

    // Set default values
    searchData.userID = userId;

    // Fetch the latest job_no from the database
    // ...

    // Fetch the latest job_no from the database
    const latestSearchOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newSearchNo = latestSearchOrder
      ? latestSearchOrder._id.job_no + 1
      : 1000;

    // Create a new JobOrder instance using the received data
    const searchOrder = new Search(searchData);

    // Assign the new job_no to the _id field
    searchOrder._id = { job_no: newSearchNo };

    // Save the job order to the database
    const savedSearch = await searchOrder.save();

    // Finding Free Partners and Assigning Patent Drafting to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);

    findPartner.jobs.push(savedSearch._id.job_no);
    findPartner.is_free = false;
    const newJobOrder = new JobOrder({
      _id: {
        job_no: newSearchNo,
      },
      service: "Patent Search",
      userID: userId,
      partnerID: findPartner.userID,
      start_date: new Date(),
      end_date: endDate,
      budget: "To be Allocated",
      country: "NA",
      domain: req.body.field,
    }).save();
    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Search Task to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Search Task to the Partner");
      });

    res.status(200).json(savedSearch);
  } catch (error) {
    console.error("Error creating Search Order:", error);
    res.status(500).send("Error creating Search Order");
  }
});

// API route which saves the data obtained from Response to FER Form
app.post("/api/response_to_fer", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const responseToFerData = req.body;

    // Set default values
    responseToFerData.userID = userId;

    // Fetch the latest job_no from the database
    // ...

    // Fetch the latest job_no from the database
    const latestResponseToFerOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newResponseToFerNo = latestResponseToFerOrder
      ? latestResponseToFerOrder._id.job_no + 1
      : 1000;

    // Create a new JobOrder instance using the received data
    const responseToFerOrder = new responseToFer(responseToFerData);

    // Assign the new job_no to the _id field
    responseToFerOrder._id = { job_no: newResponseToFerNo };

    // Save the job order to the database
    const savedResponseToFer = await responseToFerOrder.save();

    // Finding Free Partners and Assigning Patent Drafting to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);

    findPartner.jobs.push(savedResponseToFer._id.job_no);
    findPartner.is_free = false;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const newJobOrder = new JobOrder({
      _id: {
        job_no: newResponseToFerNo,
      },
      service: "Response To FER/Office Action",
      userID: userId,
      partnerID: findPartner.userID,
      country: req.body.country,
      start_date: new Date(),
      end_date: endDate,
      status: "In Progress",
      budget: "To be Allocated",
      domain: req.body.field,
    }).save();
    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Response to FER Task to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Response to FER Task to the Partner");
      });

    res.status(200).json(savedResponseToFer);
  } catch (error) {
    console.error("Error creating Response To FER Order:", error);
    res.status(500).send("Error creating Response To FER Order");
  }
});

// API route which saves the data obtained from Freedom To Operate Form
app.post("/api/freedom_to_operate", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const freedomToOperateData = req.body;

    // Set default values
    freedomToOperateData.userID = userId;

    // Fetch the latest job_no from the database
    // ...

    // Fetch the latest job_no from the database
    const latestFTOOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newFTONo = latestFTOOrder ? latestFTOOrder._id.job_no + 1 : 1000;

    freedomToOperateData._id = { job_no: newFTONo };

    // Create a new JobOrder instance using the received data
    const fTOOrder = new freedomToOperate(freedomToOperateData);

    // Assign the new job_no to the _id field
    fTOOrder._id = { job_no: newFTONo };

    // Save the job order to the database
    const savedFTO = await fTOOrder.save();

    // Finding Free Partners and Assigning Patent Drafting to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);

    findPartner.jobs.push(savedFTO._id.job_no);
    findPartner.is_free = false;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const newJobOrder = new JobOrder({
      _id: {
        job_no: newFTONo,
      },
      service: "Freedom To Operate",
      userID: userId,
      partnerID: findPartner.userID,
      country: req.body.country,
      start_date: new Date(),
      end_date: endDate,
      status: "In Progress",
      budget: "To be Allocated",
      domain: req.body.field,
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log(
          "Successfully Assigned Freedom To Operate Task to a Partner"
        );
      })
      .catch((err) => {
        console.log(
          "Error in Assigning Freedom To Operate Task to the Partner"
        );
      });

    res.status(200).send(savedFTO._id);
  } catch (error) {
    console.error("Error creating Freedom To Operate:", error);
    res.status(500).send("Error creating Freedom to Operate");
  }
});

//API endpoint for PATENT_ILLUSTRATION

app.post("/api/patent_illustration", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const illustrationData = req.body;

    // Set default values
    illustrationData.userID = userId;

    // Fetch the latest job_no from the database
    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    illustrationData._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedJobOrder = new patentIllustration(illustrationData);

    // Assign the new job_no to the _id field
    savedJobOrder._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedPatentIllustration = await savedJobOrder.save();

    // Finding Free Partners and Assigning Task to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const newJobOrder = new JobOrder({
      _id: {
        job_no: newJobNo,
      },
      service: "Patent Illustration",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: "NA",
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Illustration to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Illustration to the Partner");
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
});

// API endpoint to save the Freedom to Patent Landscape Form Data and Assign Tasks
app.post("/api/patent_landscape", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const patentLandscapeData = req.body;

    // Set default values
    patentLandscapeData.userID = userId;

    // Fetch the latest job_no from the database
    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentLandscapeData._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedJobOrder = new patentLandscape(patentLandscapeData);

    // Assign the new job_no to the _id field
    savedJobOrder._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedPatentLandscape = await savedJobOrder.save();

    // Finding Free Partners and Assigning Task to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const newJobOrder = new JobOrder({
      _id: {
        job_no: newJobNo,
      },
      service: "Freedom to Patent Landscape",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Landscape to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Landscape to the Partner");
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
});

// API endpoint to save the Patent Watch Form Data and Assign Tasks
app.post("/api/patent_watch", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const patentWatchData = req.body;

    // Set default values
    patentWatchData.userID = userId;

    // Fetch the latest job_no from the database
    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentWatchData._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedJobOrder = new patentWatch(patentWatchData);

    // Assign the new job_no to the _id field
    savedJobOrder._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedPatentWatch = await savedJobOrder.save();

    // Finding Free Partners and Assigning Task to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const newJobOrder = new JobOrder({
      _id: {
        job_no: newJobNo,
      },
      service: "Patent Watch",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: "NA",
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Watch to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Watch to the Partner");
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
});

// API endpoint to save the Patent Licensing and Commercialization Form Data and Assign Tasks
app.post("/api/patent_licensing", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const patentLicenseData = req.body;

    // Set default values
    patentLicenseData.userID = userId;

    // Fetch the latest job_no from the database
    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentLicenseData._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedJobOrder = new patentLicense(patentLicenseData);

    // Assign the new job_no to the _id field
    savedJobOrder._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedPatentLicense = await savedJobOrder.save();

    // Finding Free Partners and Assigning Task to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const newJobOrder = new JobOrder({
      _id: {
        job_no: newJobNo,
      },
      service: "Patent Licensing and Commercialization Services",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log(
          "Successfully Assigned Patent Licensing and Commercialization Services Task to a Partner"
        );
      })
      .catch((err) => {
        console.log(
          "Error in Assigning Patent Licensing and Commercialization Services Task to the Partner"
        );
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
});

// API endpoint to store data in Freedom to Patent Portfolio Analysis and to assign tasks to Partner
app.post(
  "/api/freedom_to_patent_portfolio_analysis",
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.userId;
      const patentPortfolioData = req.body;

      // Set default values
      patentPortfolioData.userID = userId;

      // Fetch the latest job_no from the database
      const latestJobOrder = await JobOrder.findOne()
        .sort({ "_id.job_no": -1 })
        .limit(1)
        .exec();

      // Increment the job_no and assign it to the new job
      const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
      patentPortfolioData._id = { job_no: newJobNo };

      // Save the job order to the database
      const savedJobOrder = new patentPortfolioAnalysis(patentPortfolioData);

      // Assign the new job_no to the _id field
      savedJobOrder._id = { job_no: newJobNo };

      // Save the job order to the database
      const savedPatentPortfolio = await savedJobOrder.save();

      // Finding Free Partners and Assigning Task to them
      const findPartner = await Partner.findOne({ is_free: true });
      console.log(findPartner);
      findPartner.jobs.push(savedJobOrder._id.job_no);
      findPartner.is_free = false;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      const newJobOrder = new JobOrder({
        _id: {
          job_no: newJobNo,
        },
        service: "Patent Portfolio Analysis",
        userID: userId,
        partnerID: findPartner.userID,
        domain: req.body.field,
        start_date: new Date(),
        end_date: endDate,
        country: req.body.country,
        status: "In Progress",
        budget: "To be Allocated",
      }).save();

      findPartner
        .save()
        .then((response) => {
          console.log(
            "Successfully Assigned Patent Portfolio Analysis Task to a Partner"
          );
        })
        .catch((err) => {
          console.log(
            "Error in Assigning Patent Portfolio Analysis Task to the Partner"
          );
        });

      res.status(200).json(savedJobOrder._id);
    } catch (error) {
      console.error("Error creating job order:", error);
      res.status(500).send("Error creating job order");
    }
  }
);

// API endpoint to store Patent Translation Services Form Data and to assign tasks to the Partners
app.post("/api/patent_translation_services", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const patentTranslationData = req.body;

    // Set default values
    patentTranslationData.userID = userId;

    // Fetch the latest job_no from the database
    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    // Increment the job_no and assign it to the new job
    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentTranslationData._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedJobOrder = new patentTranslation(patentTranslationData);

    // Assign the new job_no to the _id field
    savedJobOrder._id = { job_no: newJobNo };

    // Save the job order to the database
    const savedPatentTranslation = await savedJobOrder.save();

    // Finding Free Partners and Assigning Task to them
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const newJobOrder = new JobOrder({
      _id: {
        job_no: newJobNo,
      },
      service: "Patent Translation Services",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: "NA",
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log(
          "Successfully Assigned Patent Translation Services Task to a Partner"
        );
      })
      .catch((err) => {
        console.log(
          "Error in Assigning Patent Translation Services Task to the Partner"
        );
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
});

//SIGNIN & SIGNUP FOR USERS

// SIGN-UP FOR USERS
app.post("/api/customer", async (req, res) => {
  try {
    const customerData = req.body;

    const existingCustomer = await Customer.findOne({
      email: customerData.email,
    });

    if (existingCustomer) {
      // Email already exists, return an error response
      return res.status(400).json({
        error: "User already exists. Try creating with another email.",
      });
    }

    // Generate a new userID
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

        customerData.userID = userID; // Convert userID to a string
        customerData.password = hashedPassword;
        customerData.profile_img =
          "https://api.multiavatar.com/" + userID + ".png"; // User's Profile Avatar
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
});

// SIGN-IN FOR USERS

app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Customer.findOne({ email });

    if (!user) {
      // User not found, return an error response
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Incorrect password, return an error response
      return res.status(401).json({ message: "Invalid password" });
    }

    // Authentication successful, sign and send the JWT token
    const token = jwt.sign({ userId: user.userID }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Failed to sign in:", error);
    res.status(500).json({ message: "Failed to sign in" });
  }
});

// VERIFY JWT TOKEN MIDDLEWARE authVERIFY(frontend)
app.get("/api/verify-token", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Customer.findOne({ userID: userId });

    if (!user) {
      // User not found, return an error response
      return res.status(404).json({ message: "User not found" });
    }

    const jobOrders = await JobOrder.find({ userID: userId });
    // Fetch other user-specific data from respective collections if needed

    res.json({ user, jobOrders });
  } catch (error) {
    console.error("Error fetching user specific data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//this is exclusively for the ADMIN HUMCEN

// USER DATA for admin
app.get("/api/admin/user", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PARTNER DATA for admin
app.get("/api/admin/partner", async (req, res) => {
  try {
    const partners = await Partner.find({});
    res.send(partners);
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ADMIN DATA for admin
app.get("/api/admin/admin", async (req, res) => {
  try {
    const admins = await Admin.find({});
    console.log(admins); // Log the data to the console
    res.send(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// JOB_ORDER DATA for admin
app.get("/api/admin/job_order", async (req, res) => {
  try {
    const jobOrders = await JobOrder.find({});
    res.send(jobOrders);
  } catch (error) {
    console.error("Error fetching job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SIGN-IN FOR ADMIN
app.post("/api/auth/admin/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
      // User not found, return an error response
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the entered password matches the password stored in the database
    if (user.password !== password) {
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
});

// VERIFY JWT TOKEN MIDDLEWARE ADMIN authVERIFY(frontend)
app.get("/api/admin/verify-token", verifyAdmin, async (req, res) => {
  try {
    const email = req.email;
    const user = await Admin.findOne({ email: email });

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
});

//this is exclusively for the PARTNER HUMCEN

// Fetch the Partner's Full Name
app.get("/api/partner/name", verifyPartner, async (req, res) => {
  const userID = req.userID;

  try {
    // Find the customer with the given userId
    const partner = await Partner.findOne({ userID: userID });

    res.json(partner.first_name + " " + partner.last_name);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint for fetching Partner's Profile Image
app.get("/api/partner/img", verifyPartner, async (req, res) => {
  const userID = req.userID;

  try {
    // Find the customer with the given userId
    const partner = await Partner.findOne({ userID: userID });

    res.json(partner.profile_img);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint for fetching Partner's Settings
app.get("/api/partner/settings", verifyPartner, async (req, res) => {
  const userID = req.userID;
  try {
    // Find the customer with the given userId
    const partner = await Partner.findOne({ userID: userID });
    res.json(partner);
    console.log(partner);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint for fetching Partner's Known Fields 
app.get('/api/partner/fields', verifyPartner, async (req, res) => {
  const userID = req.userID;
  try {
    // Find the customer with the given userId
    const partner = await Partner.findOne({ userID: userID });
    res.json(partner.known_fields);
    
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for updating Partner's Settings
app.put("/api/partner/settings", verifyPartner, async (req, res) => {
  const userID = req.userID;
  const partner = await Partner.findOne({ userID: userID });
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
});

// API endpoint for Updating Partner's Bank Details
app.put("/api/partner/bank-settings", verifyPartner, async (req, res) => {
  const userID = req.userID;
  const partner = await Partner.findOne({ userID: userID });
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
});

// API endpoint for updating Partner's Preferential Settings
app.put("/api/partner/pref-settings", verifyPartner, async (req, res) => {
  const serviceList = servList.map(elem => elem.title);
  const userID = req.userID;
  const partner = await Partner.findOne({ userID: userID });
  partner.pref.mails = req.body.data.mails;
  partner.pref.order_updates = req.body.data.order_updates;
  partner.pref.marketing_emails = req.body.data.marketing_emails;
  partner.pref.newsletter = req.body.data.newsletter;
  req.body.data.known_fields.forEach((field) => {
    partner.known_fields[field] = true;
  });
  const remService = serviceList.filter((elem) => !req.body.data.known_fields.includes(elem));
  remService.forEach((service)=> {
    partner.known_fields[service] = false;
  });
  partner
    .save()
    .then((res) => console.log("Partner's Preferentials Successfully Updated"))
    .catch((error) =>
      console.error(
        "Error in updating Partner's Preferential Profile Settings: ",
        error
      )
    );
});

// API endpoint for updating Customer's Password
app.put("/api/partner/password", verifyPartner, async (req, res) => {
  const userID = req.userID;
  const partner = await Partner.findOne({ userID: userID });
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
});

// VERIFY JWT TOKEN MIDDLEWARE PARTNER authVERIFY(frontend)
app.get("/api/partner/verify-token", verifyPartner, async (req, res) => {
  try {
    const userID = req.userID;
    const user = await Partner.findOne({ userID: userID });
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
});

//SIGN UP FOR PARTNERS
app.post("/api/partner", async (req, res) => {
  try {
    const customerData = req.body;

    const existingCustomer = await Partner.findOne({
      email: customerData.email,
    });

    if (existingCustomer) {
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
        return res.status(500).send("Error creating/updating customer");
      }

      bcrypt.hash(customerData.password, salt, async (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error creating/updating customer");
        }

        customerData.userID = userID; // Convert userID to a string
        customerData.password = hashedPassword;
        customerData.profile_img =
          "https://api.multiavatar.com/-" + userID + ".png"; // User's Profile Avatar
        customerData.known_fields = req.body.known_fields;
        const newParnter = new Partner(customerData);
        customerData.known_fields.forEach((field) => {
          newParnter.known_fields[field] = true;
        });
        const savedPartner = await newParnter.save();

        res.status(201).json(savedPartner);
      });
    });
  } catch (error) {
    console.error("Error creating/updating customer:", error);
    res.status(500).send("Error creating/updating customer");
  }
});

// SIGN-IN FOR PARTNER
app.post("/api/auth/partner/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Partner.findOne({ email });

    if (!user) {
      // User not found, return an error response
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Incorrect password, return an error response
      return res.status(401).json({ message: "Invalid password" });
    }

    // Authentication successful, sign and send the JWT token
    const token = jwt.sign({ userID: user.userID }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Failed to sign in:", error);
    res.status(500).json({ message: "Failed to sign in" });
  }
});

app.get("/api/partner/jobs/:id", verifyPartner, async (req, res) => {
  try {
    const userID = req.userID;
    console.log("userID:", userID); // Check the value of userID

    const jobNumber = req.params.id; // Get the job number from the URL parameter
    console.log("jobNumber:", jobNumber); // Check the provided job number

    // Fetch the partner document based on the user ID
    const partner = await Partner.findOne({ userID: userID });
    console.log("partner:", partner); // Check the fetched partner document

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    // Check if the partner has access to the provided job number
    const hasAccess = partner.jobs.includes(jobNumber);
    if (!hasAccess) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Fetch the job order details for the provided job number
    const specificJob = await JobOrder.findOne({ "_id.job_no": jobNumber });
    console.log("specificJob:", specificJob); // Check the fetched specific job order

    if (!specificJob) {
      return res
        .status(404)
        .json({ error: "No job found with the provided job number" });
    }

    res.json(specificJob);
  } catch (error) {
    console.error("Error fetching job order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/partner/job_order", verifyPartner, async (req, res) => {
  try {
    const userID = req.userID;
    console.log("userID:", userID); // Check the value of userID

    // Fetch the partner document based on the user ID
    const partner = await Partner.findOne({ userID: userID });
    // console.log("partner:", partner); // Check the fetched partner document

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    // Get the job order IDs associated with the partner
    const jobOrderIds = partner.jobs;

    // Fetch the job orders using the retrieved IDs
    const jobOrders = await JobOrder.find({
      "_id.job_no": { $in: jobOrderIds },
    });
    // console.log("jobOrders:", jobOrders); // Check the fetched job orders

    res.json({ jobOrders });
  } catch (error) {
    console.error("Error fetching job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//PARTNER ACCEPT BUTTON
app.put("/api/accept/:jobId", verifyPartner, async (req, res) => {
  const { jobId } = req.params;
  const userID = req.userID;

  try {
    // Fetch the partner document based on the user ID
    const partner = await Partner.findOne({ userID });

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    // Update the Accepted field of the specified job ID to true
    const updatedJobOrder = await JobOrder.findOneAndUpdate(
      { "_id.job_no": jobId },
      { Accepted: true },
      { new: true }
    );

    if (!updatedJobOrder) {
      return res.status(404).json({ error: "Job order not found" });
    }

    res.json({ message: "Job order accepted successfully" });
  } catch (error) {
    console.error("Error accepting job order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//PARTNER REJECT BUTTON

app.delete("/api/reject/:jobId", verifyPartner, async (req, res) => {
  const { jobId } = req.params;
  const userID = req.userID;

  try {
    // Fetch the partner document based on the user ID
    const partner = await Partner.findOne({ userID });

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    // Check if the job ID exists in the partner's jobs array
    if (!partner.jobs.includes(jobId)) {
      return res.status(404).json({ error: "Job order not found for the partner" });
    }

    // Find the index of the job ID in the partner's jobs array
    const jobIndex = partner.jobs.indexOf(jobId);

    // Remove the job ID from the partner's jobs array
    partner.jobs.splice(jobIndex, 1);

    // Set the partner's is_free to true if there are no remaining jobs
    if (partner.jobs.length === 0) {
      partner.is_free = true;
    }

    // Save the updated partner document
    await partner.save();

    // Find a partner with is_free set to true to assign the rejected job
    const findPartner = await Partner.findOne({ is_free: true });

    if (!findPartner) {
      return res.status(404).json({ error: "No available partner found" });
    }

    // Assign the rejected job to the new partner
    findPartner.jobs.push(jobId);
    findPartner.is_free = false;

    // Save the updated new partner document
    await findPartner.save();

    res.json({ message: "Job order rejected successfully and reassigned to another partner" });
  } catch (error) {
    console.error("Error rejecting job order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// NEW USER ID CREATION FROM PARTNER TABLE FOR USERS
const generatePartnerID = async () => {
  try {
    const latestUser = await Partner.findOne()
      .sort({ userID: -1 })
      .limit(1)
      .exec();

    const lastUserID = latestUser ? parseInt(latestUser.userID) : 0;
    const newUserID = (lastUserID + 1).toString();

    return newUserID;
  } catch (error) {
    console.error("Error generating userID:", error);
    throw error;
  }
};

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
