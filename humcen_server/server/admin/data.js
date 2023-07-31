const JobOrder = require("../mongoose_schemas/job_order"); // Import the JobOrder model
const Admin = require("../mongoose_schemas/admin"); // Import the Admin model
const Partner = require("../mongoose_schemas/partner"); // Import the Admin model
const User = require("../mongoose_schemas/user"); // Import the User model
const JobFiles = require("../mongoose_schemas/job_files"); // Import Job Files Model
const Unassigned=require("../mongoose_schemas/unassigned");
const Drafting = require("../mongoose_schemas/patent_drafting");
const Customer=require("../mongoose_schemas/customer");
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getCustomers = async (req, res) => {
  try {
    const users = await Customer.find({});
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({});
    res.send(partners);
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUnassignedJobOrders = async (req, res) => {
  try {
    // Assuming you have a MongoDB model named "JobOrder"
    const unassignedJobOrders = await Unassigned.find({ });
    res.send(unassignedJobOrders);
  } catch (error) {
    console.error("Error fetching unassigned job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





const getPartnersData= async  (req, res) => {
  try {
    const { country, services} = req.params; // Assuming you have fields named "country" and "known_fields" in your Partner schema
    console.log("Here " + country + services);
    const partners = await Partner.find({
      country: country,
      ["known_fields." + services]: true,

    });
    console.log(partners);
    res.json(partners);
  } catch (error) {
    console.error("Error finding partners:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    console.log(admins);
    res.send(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getJobOrders = async (req, res) => {
  try {
    const jobOrders = await JobOrder.find({});
    res.send(jobOrders);
  } catch (error) {
    console.error("Error fetching job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getJobFiles = async (req, res) => {
  const jobID = req.params.jobID;
  console.log(jobID);
  try {
    const jobFile = await JobFiles.findOne({"_id.job_no": jobID});
    if(! jobFile) {
      console.log("No Job Files Present under Job No " + jobID);
    } else {
      if (!jobFile || !jobFile.job_files ) {
        return res.status(404).json({ error: "File not found" });
      }
      const JFile = jobFile.job_files[0];

      if (!JFile.base64) {
        return res.status(404).json({ error: "File not found" });
      }
      let fileNames = new Array(JFile.name);
      let fileContents = new Array(JFile.base64);
      let fileMimes = new Array(JFile.type);
      fileNames.forEach((file) => {
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${file}`,
          });
      });
      res.json({ fileData: fileContents, fileName: fileNames, fileMIME: fileMimes });
    }
  } catch(err) {
    console.error("Job FIle Not Found", err);
  }
}

const updateJobFilesDetails = async (req, res) => {
  const jobID = req.params.jobID;
  try {
    const jobFile = await JobFiles.findOne({"_id.job_no": jobID});
    if(! jobFile) {
      console.log("No Job Files Present under Job No " + jobID);
    } else {
      console.log(req.body);
      jobFile.access_provided = req.body.accessProvided;
      jobFile.verification = req.body.verification;
      jobFile.job_files = req.body.file ? {} : jobFile.job_files;
      jobFile.user_decided = req.body.userDeci;
      jobFile.decided = req.body.decision;
      if(req.body.reduction) {
        const workedPartner = await Partner.findOne( { jobs: {$in: [parseInt(jobID)]}} ); // Finding Partner based on the Job ID
        if(workedPartner) {
          console.log(workedPartner.in_progress_jobs);
          const job = await JobOrder.findOne({"_id.job_no": jobID});
          job.steps_done = req.body.steps_done;
          job.steps_done_user = req.body.steps_done_user;
          job.steps_done_activity = req.body.steps_done_activity;
          job.save().then((response) => {
            console.log("Successfully updated the Timeline and Job Status");
          }).catch((err) => {
            console.error("Error in Updating Job Status and Timeline");
          })
          workedPartner.save().then((response) => {
            console.log("Successfully updated in the Partner Schema.")
          }).catch((err) => {
            console.error("Error in Updating Partner Schema: ", err);
          });
        } else {
          res.status(404).json({ error: "Partner Not Found" });
        }
      }
      jobFile.save()
      .then((response) => {
        console.log("Job File status Updated Successfully.")
      }).catch((err) => {
        console.log("Error in saving Job File Status", err);
      });
    }

  } catch(error) {
    console.error("Error in providing Job Files Details: ", error)
  }
}

const getJobFilesDetails = async(req, res) => {
  const jobID = req.params.jobID;
  try{
    const jobFile = await JobFiles.findOne({"_id.job_no": jobID});
    if(! jobFile) {
      console.log("No Job Files Present under Job No " + jobID);
    } else {
      res.json(jobFile);
    }

  } catch(error) {
      console.error("Error in fetching Job Details File.", error);
  }
}

const getJobOrderById = async (req, res) => {
  const jobId = req.params.jobID
  try {
    const jobOrders = await JobOrder.find({"_id.job_no": jobId});
    console.log("jo: " + jobOrders);
    res.json(jobOrders);
  } catch (error) {
    console.error("Error fetching job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUnassignedJobById = async (req, res) => {
  const jobId = req.params.jobID
  console.log(jobId);
  try {
    const jobOrders = await Unassigned.find({"_id.job_no": Number(jobId)});
    console.log("jo: " + jobOrders);
    res.json(jobOrders);
  } catch (error) {
    console.error("Error fetching job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const assignTask = async(req, res) => {
  const unassignedJobID = req.body.uaJobID;
  const partnerID = req.body.partID;
  const patentService = req.body.service;

  // Fetching Data from Unassigned Schema
  if(patentService === "Patent Drafting") {
    const unassignedDraftingData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestDraftingOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newDraftingNo = latestDraftingOrder
      ? latestDraftingOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

    // Creating a new Job Order Document

      const jobOrderDoc = {
      "_id.job_no": newDraftingNo,
      service: patentService,
      country: unassignedDraftingData.country,
      start_date: startDate,
      end_date: endDate,
      budget: unassignedDraftingData.budget,
      status: unassignedDraftingData.status,
      domain: unassignedDraftingData.domain,
      customerName: unassignedDraftingData.customerName,
      partnerName: assignedPartner.first_name,
      rejected_by: [],
      steps_done: 2, 
      steps_done_user: 3,
      steps_done_activity: 4,
      Accepted: true,
      userID: unassignedDraftingData.userID,
    }

    const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
      console.log("Job Order " + newDraftingNo + " saved successfully in Job Order Schema" );
    }).catch((error) => {
      console.error("Error in saving Document inside Job Order Schema : " + error);
    });

      // Creating a new Service Document

      const draftingDoc = {
        "_id.job_no": newDraftingNo,
        country: unassignedDraftingData.country,
        budget: unassignedDraftingData.budget,
        userID: unassignedDraftingData.userID,
        job_title: unassignedDraftingData.job_title,
        keywords: unassignedDraftingData.keywords,
        Accepted: true,
        service_specific_files: unassignedDraftingData.service_specific_files,
        domain: unassignedDraftingData.domain,
        time_of_delivery: unassignedDraftingData.time_of_delivery,
      }

      const draftingSchemaDoc = await new Drafting(draftingDoc).save().then((response) => {
        console.log("Job Order " + newDraftingNo + " saved successfully in Drafting Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Drafting Schema : " + error);
      });

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newDraftingNo);
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newDraftingNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });

    
  }

  // Creating a new Job Order Document

  // Creating a new Service Document

  // Deleting the Old Unassigned Document

  // Pushing the Job Number to Partner's Jobs Array

}

module.exports = {
  getUsers,
  getPartners,
  getAdmins,
  getJobOrders,
  getJobFiles,
  updateJobFilesDetails,
  getJobFilesDetails,
  getJobOrderById,
  getUnassignedJobOrders,
  getUnassignedJobById,
  getPartnersData,
  assignTask,
  getCustomers
};