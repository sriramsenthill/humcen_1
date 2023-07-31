const JobOrder = require("../mongoose_schemas/job_order"); // Import the JobOrder model
const Admin = require("../mongoose_schemas/admin"); // Import the Admin model
const Partner = require("../mongoose_schemas/partner"); // Import the Admin model
const User = require("../mongoose_schemas/user"); // Import the User model
const JobFiles = require("../mongoose_schemas/job_files"); // Import Job Files Model
const Unassigned=require("../mongoose_schemas/unassigned");
const Drafting = require("../mongoose_schemas/patent_drafting");
const Filing = require("../mongoose_schemas/patent_filing"); // Import Patent Filing Model
const Search = require("../mongoose_schemas/search"); // Import Patent Search Model
const responseToFER = require("../mongoose_schemas/response_to_fer"); // Import Response to FER Model
const freedomToOperate = require("../mongoose_schemas/freedom_to_operate"); // Import Freedom to Operate Model
const patentLandscape = require("../mongoose_schemas/freedom_to_patent_landscape"); // Import Patent Landscape Model
const patentPortfolioAnalysis = require("../mongoose_schemas/patent_portfolio_analysis"); // Import Patent Portfolio Analysis Model
const patentTranslation = require("../mongoose_schemas/patent_translation_service"); // Import Patent Translation Services Model
const patentIllustration = require("../mongoose_schemas/patent_illustration"); // Import Patent Illustration Model
const patentWatch = require("../mongoose_schemas/patent_watch"); // Import Patent Watch Model
const patentLicense = require("../mongoose_schemas/patent_licensing"); // Import Patent Licensing Model


const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
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
      partnerID: partnerID,
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
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newDraftingNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });

      // For PATENT FILING
  } else if (patentService === "Patent Filing") {
    const unassignedFilingData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestFilingOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newFilingNo = latestFilingOrder
      ? latestFilingOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newFilingNo,
        service: patentService,
        country: unassignedFilingData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedFilingData.budget,
        status: unassignedFilingData.status,
        domain: unassignedFilingData.domain,
        customerName: unassignedFilingData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedFilingData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newFilingNo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const filingDoc = {
        "_id.job_no": newFilingNo,
        country: unassignedFilingData.country,
        budget: unassignedFilingData.budget,
        userID: unassignedFilingData.userID,
        job_title: unassignedFilingData.job_title,
        Accepted: true,
        service_specific_files: unassignedFilingData.service_specific_files,
        domain: unassignedFilingData.domain,
        time_of_delivery: unassignedFilingData.time_of_delivery,
      }

      const filingSchemaDoc = await new Filing(filingDoc).save().then((response) => {
        console.log("Job Order " + newFilingNo + " saved successfully in Filing Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Filing Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newFilingNo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newFilingNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }

  // For PATENT SEARCH
  else if (patentService === "Patent Search") {
    const unassignedSearchData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestSearchOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newSearchNo = latestSearchOrder
      ? latestSearchOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newSearchNo,
        service: patentService,
        country: unassignedSearchData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedSearchData.budget,
        status: unassignedSearchData.status,
        domain: unassignedSearchData.domain,
        customerName: unassignedSearchData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedSearchData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newSearchNo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const searchDoc = {
        "_id.job_no": newSearchNo,
        country: unassignedSearchData.country,
        userID: unassignedSearchData.userID,
        invention_description: unassignedSearchData.invention_description,
        technical_diagram: unassignedSearchData.technical_diagram,
        field: unassignedSearchData.domain,
        keywords: unassignedSearchData.keywords,
      }

      const searchSchemaDoc = await new Search(searchDoc).save().then((response) => {
        console.log("Job Order " + newSearchNo + " saved successfully in Patent Search Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Patent Search Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newSearchNo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newSearchNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }

  // For RESPONSE TO FER OFFICE ACTION
  else if (patentService === "Response to FER Office Action") {
    const unassignedFERData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestFEROrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newFERNo = latestFEROrder
      ? latestFEROrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newFERNo,
        service: patentService,
        country: unassignedFERData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedFERData.budget,
        status: unassignedFERData.status,
        domain: unassignedFERData.domain,
        customerName: unassignedFERData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedFERData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newFERNo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const FERDoc = {
        "_id.job_no": newFERNo,
        country: unassignedFERData.country,
        userID: unassignedFERData.userID,
        response_strategy: unassignedFERData.response_strategy,
        fer: unassignedFERData.fer,
        complete_specifications: unassignedFERData.complete_specifications,
        field: unassignedFERData.field,
      }

      const FERSchemaDoc = await new responseToFER(FERDoc).save().then((response) => {
        console.log("Job Order " + newFERNo + " saved successfully in Response to FER / Office Action Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Response to FER / Office Action Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newFERNo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newFERNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }


  // For FREEDOM TO OPERATE SEARCH
  else if (patentService === "Freedom To Operate") {
    const unassignedFTOData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestFTOOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newFTONo = latestFTOOrder
      ? latestFTOOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newFTONo,
        service: patentService,
        country: unassignedFTOData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedFTOData.budget,
        status: unassignedFTOData.status,
        domain: unassignedFTOData.domain,
        customerName: unassignedFTOData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedFTOData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newFTONo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const FTODoc = {
        "_id.job_no": newFTONo,
        field: unassignedFTOData.field,
        invention_description: unassignedFTOData.invention_description,
        patent_application_details: unassignedFTOData.patent_application_details,
        keywords: unassignedFTOData.keywords,
        userID: unassignedFTOData.userID,
        country: unassignedFTOData.country,
      }

      const FTOSchemaDoc = await new freedomToOperate(FTODoc).save().then((response) => {
        console.log("Job Order " + newFTONo + " saved successfully in Freedom To Operate Search Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Freedom To Operate Search Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newFTONo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newFTONo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }

  // For FREEDOM TO PATENT LANDSCAPE
  else if (patentService === "Freedom to Patent Landscape") {
    const unassignedLandscapeData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestLandscapeOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newLandscapeNo = latestLandscapeOrder
      ? latestLandscapeOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newLandscapeNo,
        service: patentService,
        country: unassignedLandscapeData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedLandscapeData.budget,
        status: unassignedLandscapeData.status,
        domain: unassignedLandscapeData.domain,
        customerName: unassignedLandscapeData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedLandscapeData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newLandscapeNo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const landscapeDoc = {
        "_id.job_no": newLandscapeNo,
        field: unassignedLandscapeData.field,
        technology_description: unassignedLandscapeData.technology_description,
        keywords: unassignedLandscapeData.keywords,
        competitor_information: unassignedLandscapeData.competitor_information,
        userID: unassignedLandscapeData.userID,
        country: unassignedLandscapeData.country,
      }

      const landscapeSchemaDoc = await new patentLandscape(landscapeDoc).save().then((response) => {
        console.log("Job Order " + newLandscapeNo + " saved successfully in Freedom To Patent Landscape Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Freedom To Patent Landscape Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newLandscapeNo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newLandscapeNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }

  // For PATENT PORTFOLIO ANALYSIS
  else if (patentService === "Patent Portfolio Analysis") {
    const unassignedPortfolioData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestPortfolioOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newPortfolioNo = latestPortfolioOrder
      ? latestPortfolioOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newPortfolioNo,
        service: patentService,
        country: unassignedPortfolioData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedPortfolioData.budget,
        status: unassignedPortfolioData.status,
        domain: unassignedPortfolioData.domain,
        customerName: unassignedPortfolioData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedPortfolioData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newPortfolioNo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const portfolioDoc = {
        "_id.job_no": newPortfolioNo,
        country: unassignedPortfolioData.country,
        market_and_industry_information: unassignedPortfolioData.market_and_industry_information,
        business_objectives: unassignedPortfolioData.business_objectives,
        userID: unassignedPortfolioData.userID,
        service_specific_files: unassignedPortfolioData.service_specific_files,
      }

      const portfolioSchemaDoc = await new patentPortfolioAnalysis(portfolioDoc).save().then((response) => {
        console.log("Job Order " + newPortfolioNo + " saved successfully in Freedom To Patent Portfolio Analysis Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Freedom To Patent Portfolio Analysis Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newPortfolioNo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newPortfolioNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }

  // For PATENT TRANSLATION
  else if (patentService === "Patent Translation Services") {
    const unassignedTranslationData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestTranslationOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newTranslationNo = latestTranslationOrder
      ? latestTranslationOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newTranslationNo,
        service: patentService,
        country: unassignedTranslationData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedTranslationData.budget,
        status: unassignedTranslationData.status,
        domain: unassignedTranslationData.domain,
        customerName: unassignedTranslationData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedTranslationData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newTranslationNo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const translationDoc = {
        "_id.job_no": newTranslationNo,
        source_language: unassignedTranslationData.source_language,
        target_language: unassignedTranslationData.target_language,
        document_details: unassignedTranslationData.document_details,
        userID: unassignedTranslationData.userID,
        additional_instructions: unassignedTranslationData.additional_instructions,
        country: unassignedTranslationData.country,
      }

      const translationSchemaDoc = await new patentTranslation(translationDoc).save().then((response) => {
        console.log("Job Order " + newPortfolioNo + " saved successfully in Patent Translation Services Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Patent Translation Services Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newTranslationNo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newTranslationNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }

  // For PATENT ILLUSTRATION
  else if (patentService === "Patent Illustration") {
    const unassignedIllustrationData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestIllustrationOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newIllustrationNo = latestIllustrationOrder
      ? latestIllustrationOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newIllustrationNo,
        service: patentService,
        country: unassignedIllustrationData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedIllustrationData.budget,
        status: unassignedIllustrationData.status,
        domain: unassignedIllustrationData.domain,
        customerName: unassignedIllustrationData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedIllustrationData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newIllustrationNo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const illustrationDoc = {
        "_id.job_no": newIllustrationNo,
        field: unassignedIllustrationData.field,
        country: unassignedIllustrationData.country,
        patent_specifications: unassignedIllustrationData.patent_specifications,
        drawing_requirements: unassignedIllustrationData.drawing_requirements,
        preferred_style: unassignedIllustrationData.preferred_style,
        userID: unassignedIllustrationData.userID,

      }

      const illustrationSchemaDoc = await new patentIllustration(illustrationDoc).save().then((response) => {
        console.log("Job Order " + newPortfolioNo + " saved successfully in Patent Illustration Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Patent Illustration Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newIllustrationNo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newIllustrationNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }

  // For PATENT WATCH
  else if (patentService === "Patent Watch") {
    const unassignedWatchData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestWatchOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newWatchNo = latestWatchOrder
      ? latestWatchOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newWatchNo,
        service: patentService,
        country: unassignedWatchData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedWatchData.budget,
        status: unassignedWatchData.status,
        domain: unassignedWatchData.domain,
        customerName: unassignedWatchData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedWatchData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newWatchNo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const watchDoc = {
        "_id.job_no": newWatchNo,
        field: unassignedWatchData.field,
        industry_focus: unassignedWatchData.industry_focus,
        competitor_information: unassignedWatchData.competitor_information,
        geographic_scope: unassignedWatchData.geographic_scope,
        keywords: unassignedWatchData.keywords,
        monitoring_duration: unassignedWatchData.monitoring_duration,
        userID: unassignedWatchData.userID,
        country: unassignedWatchData.country,
      }

      const watchSchemaDoc = await new patentWatch(watchDoc).save().then((response) => {
        console.log("Job Order " + newWatchNo + " saved successfully in Patent Watch Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Patent Watch Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newWatchNo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newWatchNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }

  // For PATENT LICENSING
  else if (patentService === "Patent Licensing and Commercialization Services") {
    const unassignedLicenseData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});
    const latestLicenseOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newLicenseNo = latestLicenseOrder
      ? latestLicenseOrder._id.job_no + 1
      : 1000;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newLicenseNo,
        service: patentService,
        country: unassignedLicenseData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedLicenseData.budget,
        status: unassignedLicenseData.status,
        domain: unassignedLicenseData.domain,
        customerName: unassignedLicenseData.customerName,
        partnerName: assignedPartner.first_name,
        rejected_by: [],
        steps_done: 2, 
        steps_done_user: 3,
        steps_done_activity: 4,
        Accepted: true,
        userID: unassignedLicenseData.userID,
        partnerID: partnerID,
      }

      const jobSchemaDoc = await new JobOrder(jobOrderDoc).save().then((response) => {
        console.log("Job Order " + newLicenseNo + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const licenseDoc = {
        "_id.job_no": newLicenseNo,
        field: unassignedLicenseData.field,
        patent_information: unassignedLicenseData.patent_information,
        commercialization_goals: unassignedLicenseData.commercialization_goals,
        competitive_landscape: unassignedLicenseData.competitive_landscape,
        technology_description: unassignedLicenseData.technology_description,
        userID: unassignedLicenseData.userID,
        country: unassignedLicenseData.country,
      }

      const licenseSchemaDoc = await new patentLicense(licenseDoc).save().then((response) => {
        console.log("Job Order " + newWatchNo + " saved successfully in Patent Licensing and Commercialization Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Patent Licensing and Commercialization Schema : " + error);
      });      

      // Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

      // Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newLicenseNo);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newLicenseNo + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      
  }



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
};