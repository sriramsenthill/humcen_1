const Partner = require("../mongoose_schemas/partner"); // Import the Partner model
const JobOrder = require("../mongoose_schemas/job_order"); // Import the JobOrder model
const JobFiles = require("../mongoose_schemas/job_files"); // Import Job Files Model
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
const Unassigned = require("../mongoose_schemas/unassigned"); // Import Unassigned Job Model
const Drafting = require("../mongoose_schemas/patent_drafting");
const Filing = require("../mongoose_schemas/patent_filing");


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
    partner.in_progress_jobs = partner.in_progress_jobs + 1;
    partner.save().then((response) => {console.log("Job added to In Progress section of Partner")})
    res.json({ message: "Job order accepted successfully" });
  } catch (error) {
    console.error("Error accepting job order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const rejectJobOrder = async (req, res) => {
  const jobId  = req.params.jobId;
  const service = req.params.service;
  const country = req.params.country;
  const userID = req.userID;

  try {
    // Fetch the partner document based on the user ID
    const partner = await Partner.findOne({ userID });

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    partner.rejected_jobs.push(jobId);
    
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

    const findPartner = await Partner.findOne({ is_free: true, country: country,rejected_jobs: {$nin: [parseInt(jobId)]},['known_fields.' + service]: true  });

    if (!findPartner) {
      return res.status(404).json({ error: "No available partner found. Sending the Job Order to Unassigned Jobs" });
    }
    console.log(findPartner);
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
  const service = req.params.services;
  try {
    // Retrieve job details from MongoDB using the provided job ID
    if (service === "Patent Drafting") {
      const jobDetails = await Drafting.findOne({ "_id.job_no": jobId });

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

      const { base64, name, type } = inventionDetails;

      // Set the appropriate headers for file download
      res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${name}`,
      });

      // Send the file data as a response to the frontend
      res.json({ fileData: [base64], fileName: [name] , fileMIME: [type]});
    } 

    // For Patent Filing
    else if (service === "Patent Filing") {
      const jobDetails = await Filing.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.service_specific_files || !jobDetails.service_specific_files.details || !jobDetails.service_specific_files.applicants || !jobDetails.service_specific_files.investors) {
        return res.status(404).json({ error: "File not found" });
      }
      const inventionDetails = jobDetails.service_specific_files.details[0];
      const applicantsList = jobDetails.service_specific_files.applicants[0];
      const investorsList = jobDetails.service_specific_files.investors[0];

      if (!inventionDetails.base64 || !applicantsList.base64 || !investorsList.base64) {
        return res.status(404).json({ error: "File not found" });
      }
      let fileNames = new Array(inventionDetails.name, applicantsList.name, investorsList.name );
      let fileContents = new Array(inventionDetails.base64, applicantsList.base64, investorsList.base64 );
      let fileMimes = new Array(inventionDetails.type, applicantsList.type, investorsList.type);
      fileNames.forEach((file) => {
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${file}`,
          });
      });
      res.json({ fileData: fileContents, fileName: fileNames, fileMIME: fileMimes });

    }

    // For Patent Search
    else if (service === "Patent Search") {
      const jobDetails = await Search.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.technical_diagram) {
        return res.status(404).json({ error: "File not found" });
      }
      const technicalDiagrams = jobDetails.technical_diagram[0];

      if (!technicalDiagrams.base64) {
        return res.status(404).json({ error: "File not found" });
      }
      let fileNames = new Array(technicalDiagrams.name);
      let fileContents = new Array(technicalDiagrams.base64);
      let fileMimes = new Array(technicalDiagrams.type);
      fileNames.forEach((file) => {
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${file}`,
          });
      });
      res.json({ fileData: fileContents, fileName: fileNames, fileMIME: fileMimes });

    }

    // For Response To FER/ Office Action
    else if (service === "Response To FER Office Action") {
      const jobDetails = await responseToFer.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.fer || !jobDetails.complete_specifications) {
        return res.status(404).json({ error: "File not found" });
      }
      const ferFile = jobDetails.fer[0];
      const specsFile = jobDetails.complete_specifications[0];

      if (!ferFile.base64 || !specsFile.base64) {
        return res.status(404).json({ error: "File not found" });
      }
      let fileNames = new Array(ferFile.name, specsFile.name);
      console.log(fileNames);
      let fileContents = new Array(ferFile.base64, specsFile.base64);
      let fileMimes = new Array(ferFile.type, specsFile.type);
      console.log(ferFile.name, specsFile.name);
      fileNames.forEach((file) => {
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${file}`,
          });
      });
      res.json({ fileData: fileContents, fileName: fileNames, fileMIME: fileMimes });

    }

    // For Freedom To Operate Search
    else if (service === "Freedom To Operate") {
      const jobDetails = await freedomToOperate.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.invention_description || !jobDetails.patent_application_details ) {
        return res.status(404).json({ error: "File not found" });
      }
      const inventionFile = jobDetails.invention_description[0];
      const patentFile = jobDetails.patent_application_details[0];

      if (!inventionFile.base64 || !patentFile.base64) {
        return res.status(404).json({ error: "File not found" });
      }
      let fileNames = new Array(inventionFile.name, patentFile.name);
      let fileContents = new Array(inventionFile.base64, patentFile.base64);
      let fileMimes = new Array(inventionFile.type, patentFile.type);
      fileNames.forEach((file) => {
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${file}`,
          });
      });
      console.log(fileContents, fileNames, fileMimes);
      res.json({ fileData: fileContents, fileName: fileNames, fileMIME: fileMimes });

    }

    // For Freedom to Patent Portfolio Analysis
    else if (service === "Patent Portfolio Analysis") {
      const jobDetails = await patentPortfolioAnalysis.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.service_specific_files.invention_details ) {
        return res.status(404).json({ error: "File not found" });
      }
      const portfolioInfoFile = jobDetails.service_specific_files.invention_details[0];

      if (!portfolioInfoFile.base64) {
        return res.status(404).json({ error: "File not found" });
      }
      let fileNames = new Array(portfolioInfoFile.name);
      let fileContents = new Array(portfolioInfoFile.base64);
      let fileMimes = new Array(portfolioInfoFile.type);
      fileNames.forEach((file) => {
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${file}`,
          });
      });
      res.json({ fileData: fileContents, fileName: fileNames, fileMIME: fileMimes });

    }

    // For Patent Translation Service
    else if (service === "Patent Translation Services") {
      const jobDetails = await patentTranslation.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.document_details ) {
        return res.status(404).json({ error: "File not found" });
      }
      const documentFile = jobDetails.document_details[0];

      if (!documentFile.base64) {
        return res.status(404).json({ error: "File not found" });
      }
      let fileNames = new Array(documentFile.name);
      let fileContents = new Array(documentFile.base64);
      let fileMimes = new Array(documentFile.type);
      fileNames.forEach((file) => {
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${file}`,
          });
      });
      res.json({ fileData: fileContents, fileName: fileNames, fileMIME: fileMimes });

    }

    // For Patent Illustration
    else if (service === "Patent Illustration") {
      const jobDetails = await patentIllustration.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.preferred_style ) {
        return res.status(404).json({ error: "File not found" });
      }
      const styleFile = jobDetails.preferred_style[0];

      if (!styleFile.base64) {
        return res.status(404).json({ error: "File not found" });
      }
      let fileNames = new Array(styleFile.name);
      let fileContents = new Array(styleFile.base64);
      let fileMimes = new Array(styleFile.type);
      fileNames.forEach((file) => {
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${file}`,
          });
      });
      res.json({ fileData: fileContents, fileName: fileNames, fileMIME: fileMimes });

    }

    
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
    

    if (serviceName === "Patent Drafting") {
      jobData = await Drafting.findOne({ "_id.job_no": jobID });
      neededData = {
        "Domain": jobData.domain,
        "Country": jobData.country,
        "Title": jobData.job_title,
        "Keywords": jobData.keywords,
        "Budget": jobData.budget,
        "Time of Delivery": jobData.time_of_delivery
      };
    } else if (serviceName === "Patent Filing") {
      jobData = await Filing.findOne({ "_id.job_no": jobID });
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

// Finding Partner according to Job ID

const findPartnersWithJobNo = async (req, res) => {
  const jobID = req.params.id;
  const service = req.params.services;
  console.log("Params " + parseInt(jobID));
  try
  {
    const partner = await Partner.findOne( { jobs: {$in: [parseInt(jobID)]}} ); // Finding Partners according to the given Job ID
    res.json({partnerID: partner.userID, partnerName: partner.full_name, country: partner.country, service: service});
  

  } catch(err) {
    console.error("Error in Finding Partner according to Job ID", err);
  }


};

const addJobFiles = async (req, res) => {
  console.log("Requests " + req.body.partnerID);
  const job = req.body;
  try {
    const jobFile = await JobFiles.findOne({"_id.job_no": job.job_no})
    if(!jobFile){
      const taskFile = new JobFiles(
        {
        "_id.job_no": job.job_no, 
          service: job.service, 
          country: job.country, 
          partnerID: job.partnerID, 
          partnerName: job.partnerName, 
          job_files: job.job_files,
          verification: "File submitted Successfully",
    }).save().then((response) => {
      console.log("Job Files added Successfully");
    }).catch((err) => {
      console.log("Error in Updating Job Files");
    });
    } else {
        jobFile.job_files = job.job_files;
        jobFile.verification = "Job Files sent to the Admin Successfully for Verification";
        jobFile.save()
        .then((response) => {
          console.log("Job Files Updated Successfully");
        })
        .catch((err) => {
          console.error("Error in Updating Job File: ", err);
        });
    }
    

  } catch {
    console.error("Error in Updating Job Files", err);
  }

}

// Fetch Partner's Work Files for Partner
const getJobFilesDetailsForPartners = async(req, res) => {
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



module.exports = {
  getPartnerJobsById,
  getPartnerJobOrders,
  acceptJobOrder,
  rejectJobOrder,
  getFilesForPartners,
  getJobDetailsForPartners,
  findPartnersWithJobNo,
  addJobFiles,
  getJobFilesDetailsForPartners,
};