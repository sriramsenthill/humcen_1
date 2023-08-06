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
const Notification = require("../mongoose_schemas/notification"); // Import Notification Model

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
    const updatedJobOrder = await JobOrder.findOne(
      { "_id.job_no": jobId },
    );


    if (!updatedJobOrder) {
      return res.status(404).json({ error: "Job order not found" });
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    updatedJobOrder.Accepted = true;
    updatedJobOrder.steps_done = 2;
    updatedJobOrder.steps_done_user = 3;
    updatedJobOrder.steps_done_activity = 4;
    for (let steps=1; steps < 3; steps++) {
      updatedJobOrder.date_user[steps] = formattedDate;
    }
    for (let steps=2; steps < 4; steps++) {
      updatedJobOrder.date_activity[steps] = formattedDate;
    }
    for (let steps=1; steps < 2; steps++) {
      updatedJobOrder.date_partner[steps] = formattedDate;
    }

    updatedJobOrder.save().then(() => {
      console.log("Job Order saved successfully.");
    }). catch((err) => {
      console.log("Error in saving Job Order");
    })

    partner.in_progress_jobs = partner.in_progress_jobs + 1;
    partner.save().then((response) => {console.log("Job added to In Progress section of Partner")})
    res.json({ message: "Job order accepted successfully" });

    const assignedNotification = await Notification.findOne({ user_Id: Number(userID) });
    if(!assignedNotification) {
      const newNotification = new Notification({
        user_Id: Number(userID),
        notifications: [
          {
            notifNum: 1,
            notifText: "Work  " + jobId+" has been assigned to Partner named " + partner.first_name + " " + partner.last_name + " Successfully.",
            notifDate: formattedDate,
            seen: false,
          }
        ] 
      }).save().then(() => {
        console.log("Notification sent Successfully.");
      }).catch((err) => {
        console.error("Error in sending Notification : " + err);
      });
    } else {
      const oldNotification = {
        notifNum: assignedNotification.notifications.length + 1,
        notifText: "Work  " + jobId+" has been assigned to Partner named " + partner.first_name + " " + partner.last_name + " Successfully.",
        notifDate: formattedDate,
        seen: false,
      }
      assignedNotification.notifications.push(oldNotification);
      assignedNotification.save().then(() => {
        console.log("Notification sent Successfully.")
      }).catch((err) => {
        console.error("Error in sending Notifcation : " + err);
      });
    }

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

      // For Patent Drafting Rejection
      if(service === "Patent Drafting") {
        // Getting the Drafting Details
        const rejectedJob = await Drafting.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedDraftingOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedDraftingNo = latestUnassignedDraftingOrder
            ? latestUnassignedDraftingOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedDraftingNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedDrafting = new Unassigned(unassigned);  
            

            rejectedDrafting.save()
            .then(() => {
              console.log("Rejected Drafting Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Drafting Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Drafting traces
              Drafting.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Drafting with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Drafting:", error);
              });
              

          }
        }
      }

      // For Patent Filing Rejection
      else if(service === "Patent Filing") {
        // Getting the Filing Details
        const rejectedJob = await Filing.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedFilingOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedFilingNo = latestUnassignedFilingOrder
            ? latestUnassignedFilingOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedFilingNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;
          
            const rejectedFiling = new Unassigned(unassigned);  
          

            rejectedFiling.save()
            .then(() => {
              console.log("Rejected Filing Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Filing Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Filing traces
              Filing.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Filing with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Filing:", error);
              });
          }
        }
      }

      // Patent Search Rejection

      else if(service === "Patent Search") {
        // Getting the Patent Search Details
        const rejectedJob = await Search.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedSearchOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedSearchNo = latestUnassignedSearchOrder
            ? latestUnassignedSearchOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedSearchNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedSearch = new Unassigned(unassigned);  
            

            rejectedSearch.save()
            .then(() => {
              console.log("Rejected Patent Search Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Patent Search Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Patent Search traces
              Search.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Patent Search with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Patent Search:", error);
              });
          }
        }
      }      

      // Response to FER Office Action Rejection

      else if(service === "Response To FER Office Action") {
        // Getting the Response to FER Details
        const rejectedJob = await responseToFer.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedFEROrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedFERNo = latestUnassignedFEROrder
            ? latestUnassignedFEROrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedFERNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedFER = new Unassigned(unassigned);  
            

            rejectedFER.save()
            .then(() => {
              console.log("Rejected Response To FER Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Response To FER Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Response To FER traces
              responseToFer.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Response To FER with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Response To FER:", error);
              });
          }
        }
      }

      // Freedom to Operate Search Rejection
      else if(service === "Freedom To Operate") {
        // Getting the Freedom To Operate Search Details
        const rejectedJob = await freedomToOperate.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedFTOOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedFTONo = latestUnassignedFTOOrder
            ? latestUnassignedFTOOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedFTONo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedFTO = new Unassigned(unassigned);  
            
            rejectedFTO.save()
            .then(() => {
              console.log("Rejected Freedom To Operate Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Freedom To Operate Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Freedom To Operate Search traces
              freedomToOperate.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Freedom To Operate with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Freedom To Operate:", error);
              });
          }
        }
      }

      // Freedom to Patent Landscape Rejection
      else if(service === "Freedom to Patent Landscape") {
        // Getting the Freedom to Patent Landscape Details
        const rejectedJob = await patentLandscape.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedLandscapeOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedLandscapeNo = latestUnassignedLandscapeOrder
            ? latestUnassignedLandscapeOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedLandscapeNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedLandscape = new Unassigned(unassigned);  
           
            rejectedLandscape.save()
            .then(() => {
              console.log("Rejected Freedom to Patent Landscape Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Freedom to Patent Landscape Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Freedom to Patent Landscape traces
              patentLandscape.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Freedom to Patent Landscape with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Freedom to Patent Landscape :", error);
              });
          }
        }
      }      

      // Freedom to Patent Portfolio Rejection
      else if(service === "Patent Portfolio Analysis") {
        // Getting the Patent Portfolio Analysis Details
        const rejectedJob = await patentPortfolioAnalysis.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedPortfolioOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedPortfolioNo = latestUnassignedPortfolioOrder
            ? latestUnassignedPortfolioOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedPortfolioNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedPortfolio = new Unassigned(unassigned);  

            rejectedPortfolio.save()
            .then(() => {
              console.log("Rejected Patent Portfolio Analysis Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Patent Portfolio Analysis Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Patent Portfolio Analysis traces
              patentPortfolioAnalysis.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Patent Portfolio Analysis with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Patent Portfolio Analysis :", error);
              });
          }
        }
      }
      // Patent Translation Services Rejection 
      else if(service === "Patent Translation Services") {
        // Getting the Patent Portfolio Analysis Details
        const rejectedJob = await patentTranslation.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedTranslationOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedTranslationNo = latestUnassignedTranslationOrder
            ? latestUnassignedTranslationOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedTranslationNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedTranslation = new Unassigned(unassigned);  

            rejectedTranslation.save()
            .then(() => {
              console.log("Rejected Patent Translation Services Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Patent Translation Services Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Patent Translation Services traces
              patentTranslation.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Patent Translation Services with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Patent Translation Services :", error);
              });
          }
        }
      }      

      // Patent Illustration Rejection
      else if(service === "Patent Illustration") {
        // Getting the Patent Portfolio Analysis Details
        const rejectedJob = await patentIllustration.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedIllustrationOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedIllustrationNo = latestUnassignedIllustrationOrder
            ? latestUnassignedIllustrationOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedIllustrationNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedIllustration = new Unassigned(unassigned);  
           

            rejectedIllustration.save()
            .then(() => {
              console.log("Rejected Patent Illustration Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Patent Illustration Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Patent Illustration traces
              patentIllustration.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Patent Illustration with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Patent Illustration :", error);
              });
          }
        }
      }
      // Patent Watch Rejection
      else if(service === "Patent Watch") {
        // Getting the Patent Watch Details
        const rejectedJob = await patentWatch.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedWatchOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedWatchNo = latestUnassignedWatchOrder
            ? latestUnassignedWatchOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedWatchNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedWatch = new Unassigned(unassigned);  

            rejectedWatch.save()
            .then(() => {
              console.log("Rejected Patent Watch Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Patent Watch Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Patent Watch traces
              patentWatch.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Patent Watch with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Patent Watch :", error);
              });
          }
        }
      }
      // Patent Licensing and Commercialization Services Rejection
      else if(service === "Patent Licensing and Commercialization Services") {
        // Getting the Patent Watch Details
        const rejectedJob = await patentLicense.findOne({"_id.job_no": parseInt(jobId)}).lean();
        if(!rejectedJob) {
          console.error("No Job Details present for Job Number " + jobId);
        } else {
          // Getting the Job Order details
          const jobOrderDetails = await JobOrder.findOne({"_id.job_no": parseInt(jobId)});
          if(!jobOrderDetails) {
            console.error("No Job Details present for Job Number " + jobId);
          } else {
            const latestUnassignedLicenseOrder = await Unassigned.findOne()
            .sort({ "_id.job_no": -1 })
            .select({ "_id.job_no": 1 }) // Select only the _id.job_no field
            .lean();

            const newUnassignedLicenseNo = latestUnassignedLicenseOrder
            ? latestUnassignedLicenseOrder._id.job_no + 1
            : 1000;

            // Clone the rejectedJob object and remove _id.job_no property
            const unassigned = { ...rejectedJob };
            unassigned._id.job_no = newUnassignedLicenseNo; // Set the new job number as a string
            unassigned.status = jobOrderDetails.status;
            unassigned.budget = jobOrderDetails.budget;
            unassigned.service = service;

            const rejectedLicense = new Unassigned(unassigned);  

            rejectedLicense.save()
            .then(() => {
              console.log("Rejected Patent Licensing Successfully sent to Unassigned Jobs");
              })
            .catch((err) => {
              console.error("Failed to reject the Patent Licensing Job:", err);
              });

              // Deleting JobOrder traces
              JobOrder.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Job Order with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Job Order:", error);
              });

              // Deleting Patent Licensing traces
              patentLicense.deleteOne({ "_id.job_no": jobId })
              .then((deletedJob) => {
                if (deletedJob) {
                  console.log(`Successfully deleted job from Patent Licensing with job number ${jobId}`);
                } else {
                  console.log(`Job with job number ${jobId} not found`);
                }
              })
              .catch((error) => {
                console.error("Error deleting job from Patent Licensing :", error);
              });
          }
        }
      }
      
      

      

      return res.status(200).json({ error: "No available partner found. Sending the Job Order to Unassigned Jobs" });
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
      let fileDataList = [];
      let fileNameList = [];
      let fileMIMEList = [];
      // Extract the file data from the job details
      for(let totalFiles=0; totalFiles < jobDetails.service_specific_files.invention_details.length; totalFiles++) {
        const inventionDetails = jobDetails.service_specific_files.invention_details[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Patent_Drafting_Invention_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
          
      }
      
      // Send the file data as a response to the frontend
      res.json({ fileData: fileDataList, fileName: fileNameList , fileMIME: fileMIMEList});
    } 

    // For Patent Filing
    else if (service === "Patent Filing") {
      const jobDetails = await Filing.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.service_specific_files || !jobDetails.service_specific_files.details || !jobDetails.service_specific_files.applicants || !jobDetails.service_specific_files.investors) {
        return res.status(404).json({ error: "File not found" });
      }

      let fileDataList = [];
      let fileNameList = [];
      let fileMIMEList = [];
      // Extract the file data from the job details
      for(let totalFiles=0; totalFiles < jobDetails.service_specific_files.details.length; totalFiles++) {
        const inventionDetails = jobDetails.service_specific_files.details[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Patent_Filing_Invention_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      for(let totalFiles=0; totalFiles < jobDetails.service_specific_files.applicants.length; totalFiles++) {
        const inventionDetails = jobDetails.service_specific_files.applicants[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Patent_Filing_Applicant_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      for(let totalFiles=0; totalFiles < jobDetails.service_specific_files.investors.length; totalFiles++) {
        const inventionDetails = jobDetails.service_specific_files.investors[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Patent_Filing_Investors_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Patent Search
    else if (service === "Patent Search") {
      const jobDetails = await Search.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.technical_diagram) {
        return res.status(404).json({ error: "File not found" });
      }

      let fileDataList = [];
      let fileNameList = [];
      let fileMIMEList = [];
      // Extract the file data from the job details
      for(let totalFiles=0; totalFiles < jobDetails.technical_diagram.length; totalFiles++) {
        const inventionDetails = jobDetails.technical_diagram[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Patent_Search_Technical_Diagram_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }
      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Response To FER/ Office Action
    else if (service === "Response To FER Office Action") {
      const jobDetails = await responseToFer.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.fer || !jobDetails.complete_specifications) {
        return res.status(404).json({ error: "File not found" });
      }

      let fileDataList = [];
      let fileNameList = [];
      let fileMIMEList = [];
      // Extract the file data from the job details
      for(let totalFiles=0; totalFiles < jobDetails.fer.length; totalFiles++) {
        const inventionDetails = jobDetails.fer[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Response_To_FER_Office_Action_FER_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      for(let totalFiles=0; totalFiles < jobDetails.complete_specifications.length; totalFiles++) {
        const inventionDetails = jobDetails.complete_specifications[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Response_To_FER_Office_Action_Complete_Specifications_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Freedom To Operate Search
    else if (service === "Freedom To Operate") {
      const jobDetails = await freedomToOperate.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.invention_description || !jobDetails.patent_application_details ) {
        return res.status(404).json({ error: "File not found" });
      }

      let fileDataList = [];
      let fileNameList = [];
      let fileMIMEList = [];
      // Extract the file data from the job details
      for(let totalFiles=0; totalFiles < jobDetails.invention_description.length; totalFiles++) {
        const inventionDetails = jobDetails.invention_description[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Freedom_To_Operate_Invention_Description_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      for(let totalFiles=0; totalFiles < jobDetails.patent_application_details.length; totalFiles++) {
        const inventionDetails = jobDetails.patent_application_details[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Freedom_To_Operate_Patent_Application_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });
    }

    // For Freedom to Patent Portfolio Analysis
    else if (service === "Patent Portfolio Analysis") {
      const jobDetails = await patentPortfolioAnalysis.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.service_specific_files.invention_details ) {
        return res.status(404).json({ error: "File not found" });
      }

      let fileDataList = [];
      let fileNameList = [];
      let fileMIMEList = [];
      // Extract the file data from the job details
      for(let totalFiles=0; totalFiles < jobDetails.service_specific_files.invention_details.length; totalFiles++) {
        const inventionDetails = jobDetails.service_specific_files.invention_details[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Patent_Portfolio_Analysis_Invention_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Patent Translation Service
    else if (service === "Patent Translation Services") {
      const jobDetails = await patentTranslation.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.document_details ) {
        return res.status(404).json({ error: "File not found" });
      }

      let fileDataList = [];
      let fileNameList = [];
      let fileMIMEList = [];
      // Extract the file data from the job details
      for(let totalFiles=0; totalFiles < jobDetails.document_details.length; totalFiles++) {
        const inventionDetails = jobDetails.document_details[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Patent_Translation_Document_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Patent Illustration
    else if (service === "Patent Illustration") {
      const jobDetails = await patentIllustration.findOne({ "_id.job_no": jobId });
      if (!jobDetails || !jobDetails.preferred_style ) {
        return res.status(404).json({ error: "File not found" });
      }

      let fileDataList = [];
      let fileNameList = [];
      let fileMIMEList = [];
      // Extract the file data from the job details
      for(let totalFiles=0; totalFiles < jobDetails.preferred_style.length; totalFiles++) {
        const inventionDetails = jobDetails.preferred_style[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Patent_Illustration_Preferred_Style_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

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
          decided: false, 
          job_files: job.job_files,
          verification: "Job Files sent to the Admin Successfully for Verification",
    }).save().then((response) => {
      console.log("Job Files added Successfully");
    }).catch((err) => {
      console.log("Error in Updating Job Files");
    });
    } else {
        jobFile.job_files = job.job_files;
        jobFile.decided = false;
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

const updateTimelineForUpload = async (req, res) => {
  try {
    const userID = req.userID;


    const timeLineStatus = req.body.activity;
    console.log(timeLineStatus);
    const jobNumber = req.body.job_no; // Get the job number from the URL parameter

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


    if (!specificJob) {
      return res
        .status(404)
        .json({ error: "No job found with the provided job number" });
    } else {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      specificJob.steps_done_activity = timeLineStatus;
      specificJob.date_activity[4] = new Date().toLocaleDateString(undefined, options);

      specificJob.save().then((response)=> {
        console.log("Timeline Updated Successfully for Partner Work Upload" + response);
      }).catch((error) => {
        console.error("Error in Updating Partner Activity Timeline Status: " + error);
      });
      console.log(specificJob);
    }

  } catch (error) {
    console.error("Error fetching job order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
  updateTimelineForUpload
};