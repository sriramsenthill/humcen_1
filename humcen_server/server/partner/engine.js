const Partner = require("../mongoose_schemas/partner"); // Import the Partner model
const JobOrder = require("../mongoose_schemas/job_order"); // Import the JobOrder model


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

module.exports = {
  getPartnerJobsById,
  getPartnerJobOrders,
  acceptJobOrder,
  rejectJobOrder,
  getFilesForPartners,
};