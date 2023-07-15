const Partner = require("../mongoose_schemas/partner"); // Import the Partner model
const JobOrder = require("../mongoose_schemas/job_order"); // Import the JobOrder model
const Search = require("../mongoose_schemas/search"); // Import the Patent Search Model
const patentPortfolioAnalysis = require("../mongoose_schemas/patent_portfolio_analysis"); // Import Patent Portfolio Analysis Model
const patentTranslation = require("../mongoose_schemas/patent_translation_service"); // Import Patent Translation Services Mode
const patentLicense = require("../mongoose_schemas/patent_licensing"); // Import Patent Licensing and Commercialization Services Model
const patentLandscape = require("../mongoose_schemas/freedom_to_patent_landscape"); // Import Freedom to Patent Landscape Model
const patentWatch = require("../mongoose_schemas/patent_watch"); // Import Patent Watch Model
const responseToFer = require("../mongoose_schemas/response_to_fer");
const freedomToOperate = require("../mongoose_schemas/freedom_to_operate"); // Import the Freedom To Operate Search Model
const patentIllustration = require("../mongoose_schemas/patent_illustration"); // Import Patent Illustration Model
const Consultation = require("../mongoose_schemas/consultation");


const getPartnerJobsById = async (req, res) => {
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
};

const getPartnerJobOrders = async (req, res) => {
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
};

const acceptJobOrder = async (req, res) => {
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
};

const rejectJobOrder = async (req, res) => {
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
      return res
        .status(404)
        .json({ error: "Job order not found for the partner" });
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

    res.json({
      message: "Job order rejected successfully and reassigned to another partner",
    });
  } catch (error) {
    console.error("Error rejecting job order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

 //DOWNLOAD BUTTON FOR PARTNER ONGOING PATENTS
const getFilesForPartners = async (req, res) => {
  const jobId = req.params.id;
  try {
    // Retrieve job details from MongoDB using the provided job ID
    const jobDetails = await JobOrder.findOne({ "_id.job_no": jobId });

    // Check if job details exist and have invention details
    if (!jobDetails || !jobDetails.service_specific_files || !jobDetails.service_specific_files.invention_details) {
      return res.status(404).json({ error: "File not found" });
    }

    // Extract the file data from the job details
    const inventionDetails = jobDetails.service_specific_files.invention_details[0];

    // Check if base64 data is present
    if (!inventionDetails.base64) {
      return res.status(404).json({ error: "File not found" });
    }

    const { base64, name } = inventionDetails;

    // Set the appropriate headers for file download
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${name}`,
    });

    // Send the file data as a response to the frontend
    res.json({ fileData: base64, fileName: name });

  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Sends Job Details according to the Services chosen

const getJobDetailsForPartners = async (req, res) => {
  console.log(req.params);
  try {
    const serviceName = req.params.services;
    const jobID = req.params.jobID;
    
    let neededData = {};
    let jobData;
    

    if (serviceName === "Patent Drafting" || serviceName === "Patent Filing") {
      jobData = await JobOrder.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.domain,
        "Country": jobData.country,
        "Title": jobData.job_title,
        "Keywords": jobData.keywords,
        "Budget": jobData.budget,
        "Time of Delivery": jobData.time_of_delivery
      };
    } else if (serviceName === "Patent Search") {
      jobData = await Search.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.field,
        "Description": jobData.invention_description,
        "Keywords": jobData.keywords
      };
    } else if (serviceName === "Response to FER Office Action") {
      console.log("Yes");
      jobData = await responseToFer.findOne({ "_id.job_no": jobID });
      console.log(jobData);
      neededData = {
        "Domain": jobData.field,
        "Strategy": jobData.response_strategy,
        "Country": jobData.country
      };
    } else if (serviceName === "Freedom To Operate") {
      jobData = await freedomToOperate.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.field,
        "Keywords": jobData.keywords,
        "Country": jobData.country
      };
    } else if (serviceName === "Freedom to Patent Landscape") {
      jobData = await patentLandscape.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.field,
        "Tech Description": jobData.technology_description,
        "Keywords": jobData.keywords,
        "Competitor Info": jobData.competitor_information,
        "Country": jobData.country
      };
    } else if (serviceName === "Patent Portfolio Analysis") {
      jobData = await patentPortfolioAnalysis.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.field,
        "Objectives": jobData.business_objectives,
        "Market Info": jobData.market_and_industry_information,
        "Country": jobData.country
      };
    } else if (serviceName === "Patent Translation Services") {
      jobData = await patentTranslation.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.field,
        "Source Language": jobData.source_language,
        "Target Language": jobData.target_language,
        "Additional Info": jobData.additional_instructions
      };
    } else if (serviceName === "Patent Illustration") {
      jobData = await patentIllustration.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.field,
        "Patent Specifications": jobData.patent_specifications,
        "Drawing Requirements": jobData.drawing_requirements
      };
    } else if (serviceName === "Patent Watch") {
      jobData = await patentWatch.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.field,
        "Tech Focus": jobData.industry_focus,
        "Competitor Info": jobData.competitor_information,
        "Geographic Scope": jobData.geographic_scope,
        "Keywords": jobData.keywords,
        "Monitoring Duration": jobData.monitoring_duration
      };
    } else if (serviceName === "Patent Licensing and Commercialization Services") {
      jobData = await patentLicense.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.field,
        "Patent Info": jobData.patent_information,
        "Goals": jobData.commercialization_goals,
        "Competitive Landscape": jobData.competitive_landscape,
        "Tech Description": jobData.technology_description,
        "Country": jobData.country
      };
    } else {
      jobData = await responseToFer.findOne({ "_id.job_no": jobID });
      console.log(jobData);
      neededData = {
        "Domain": jobData.field,
        "Strategy": jobData.response_strategy,
        "Country": jobData.country
      };
    }

    console.log(jobID);
    console.log(serviceName);
    console.log(neededData);
    res.json(neededData);
  } catch (error) {
    console.log("Error while trying to get Job Data: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
  getPartnerJobsById,
  getPartnerJobOrders,
  acceptJobOrder,
  rejectJobOrder,
  getFilesForPartners,
  getJobDetailsForPartners,
};