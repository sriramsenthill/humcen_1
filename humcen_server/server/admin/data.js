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
const Customer=require("../mongoose_schemas/customer");
const sendEmail = require("../email");
const Notification = require("../mongoose_schemas/notification"); // Import Notification Model for Users
const NotificationAdmin = require("../mongoose_schemas/notification_admin"); // Import Notification Model for Admin

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
      let fileDataList = [];
      let fileNameList = [];
      let fileMIMEList = [];
      // Extract the file data from the job details
      for(let totalFiles=0; totalFiles < jobFile.job_files.length; totalFiles++) {
        const details = jobFile.job_files[totalFiles];
      // Check if base64 data is present
        if (!details.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = details;
        fileDataList.push(base64);
        fileNameList.push("Partner_Work_File_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });
    }
  } catch(err) {
    console.error("Job FIle Not Found", err);
  }
}

const updateJobFilesDetails = async (req, res) => {
  const jobID = req.params.jobID;
  const jobData = req.body.jobDetails;
  const user = await Customer.findOne({ userID: jobData.userID });
  const jobFile = await JobFiles.findOne({"_id.job_no": jobID});
  const {job_files}=jobFile
  try {
    const jobFile = await JobFiles.findOne({"_id.job_no": jobID});
    if(! jobFile) {
      console.log("No Job Files Present under Job No " + jobID);
    } else {
      console.log(req.body);
      if(req.body.accessProvided === true)  {
        console.log("Hey correct");
        const findUserThroughJob = await JobOrder.findOne({"_id.job_no": jobID});
        if(!findUserThroughJob) {
          console.log("Can't able to find the Customer");
        } else {
          const thatCustomer = findUserThroughJob.userID;
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = new Date().toLocaleDateString(undefined, options);

          const acceptNotification = await Notification.findOne({user_Id: thatCustomer});
          if(!acceptNotification) {
            const newNotification = new Notification({
              user_Id: thatCustomer,
              notifications: [
                {
                  notifNum: 1,
                  notifText: "Admin has given access for Verification of Work " + jobID,
                  notifDate: formattedDate,
                  seen: false,
                }
              ]
            });
            newNotification.save().then(() => {
              console.log("Notification sent Successfully.");
            }).catch((err) => {
              console.error("Error in sending Notifications : " + err);
            })
          } else {
            const accessGivenNotif = {
              notifNum: acceptNotification.notifications.length + 1,
              notifText: "Admin has given access for Verification of Work " + jobID,
              notifDate: formattedDate,
              seen: false,
            }
            acceptNotification.notifications.push(accessGivenNotif);
            acceptNotification.save().then(() => {
              console.log("Notification sent Successfully.")
            }).catch((err) => {
              console.error("Error in sending Notification : " + err);
            });
          }
        }
      }
      jobFile.access_provided = req.body.accessProvided;
      jobFile.verification = req.body.verification;
      jobFile.job_files = req.body.file ? {} : jobFile.job_files;
      jobFile.user_decided = req.body.userDeci;
      jobFile.decided = req.body.decision;
      const userCount = req.body.users;
      const activityCount = req.body.activity;
      const partnerCount = req.body.partners;
      if(req.body.reduction) {
        const workedPartner = await Partner.findOne( { jobs: {$in: [parseInt(jobID)]}} ); // Finding Partner based on the Job ID
        if(workedPartner) {
          console.log(workedPartner.in_progress_jobs);
          const job = await JobOrder.findOne({"_id.job_no": jobID});
          job.steps_done = req.body.steps_done;
          job.steps_done_user = req.body.steps_user;
          job.steps_done_activity = req.body.steps_activity;
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          userCount.map((user) => {
            job.date_user[user] = new Date().toLocaleDateString(undefined, options);
          })
          activityCount.map((activity) => {
            job.date_activity[activity] = new Date().toLocaleDateString(undefined, options);
          })
          partnerCount.map((partner) => {
            job.date_partner[partner] = new Date().toLocaleDateString(undefined, options);
          })
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
        const subject = `Verification for your submission form with job no ${req.params.jobID}`;
        const text = `Verify your ${jobData.service} form details from the partner`;
        const attachments=[]
        const tableData = [
          { label: 'Service :', value: jobData.service },
          { label: 'Customer Name :', value: jobData.customerName },
          {label:'Country :',value:jobData.country},
          {label:'Partner Name :',value:jobData.partnerName},
          {label:'Status :',value:jobData.status},
          // Add more rows as needed
        ];

        if (Array.isArray(job_files) && job_files.length > 0) {
          // Iterate through the invention_details array and add each file as a separate attachment
          for (const item of job_files) {
            if (item.name && item.base64) {
              const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
              attachments.push({
                filename: item.name,
                content: base64Content,
                encoding: 'base64', // Specify that the content is base64-encoded
              });
            }
          }
        }
        sendEmail(user.email, subject, text, tableData,attachments);
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
  console.log("Hey " + jobId);
  try {
    const jobOrders = await Unassigned.find({"_id.job_no": jobId});
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

     // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedDraftingData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedDraftingData.userID);
    }
    findCustomer.jobs.push(newDraftingNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    });  

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

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
      date_partner: [formattedDate, formattedDate, " ", " "], 
      date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
      date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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
      if (assignedPartner){
        const partnerSubject="Request to accept the Patent Drafting Form"
      const partnerText="Accept the submission for Patent Drafting Form" 
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Patent Drafting' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedDraftingData.domain},
        {label:'Country :',value:unassignedDraftingData.country},
        {label:'Job Title :',value:unassignedDraftingData.job_title},
        {label:'Budget :',value:unassignedDraftingData.budget},
        {label:'Time Of Delivery :',value:unassignedDraftingData.time_of_delivery},
        // Add more rows as needed
      ];

      const { invention_details } = unassignedDraftingData.service_specific_files;
          
      // Ensure invention_details is an array and not empty
      if (Array.isArray(invention_details) && invention_details.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of invention_details) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      

      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      

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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedFilingData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedFilingData.userID);
    }
    findCustomer.jobs.push(newFilingNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

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
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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

      if (assignedPartner){
        const partnerSubject="Request to accept the Patent Filing  Form"
      const partnerText="Accept the submission for Patent Filing Form"
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Patent Filing' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedFilingData.domain},
        {label:'Country :',value:unassignedFilingData.country},
        {label:'Job Title :',value:unassignedFilingData.job_title},
        {label:'Application Type :',value:unassignedFilingData.service_specific_files.application_type},
        {label:'Budget :',value:unassignedFilingData.budget},
        {label:'Time Of Delivery :',value:unassignedFilingData.time_of_delivery},
        // Add more rows as needed
      ];

      const { details,applicants,investors } = unassignedFilingData.service_specific_files;
      
      // Ensure invention_details is an array and not empty
      if (Array.isArray(details) && details.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of details) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      if (Array.isArray(applicants) && applicants.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of applicants) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      if (Array.isArray(investors) && investors.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of investors) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      
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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedSearchData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedSearchData.userID);
    }
    findCustomer.jobs.push(newSearchNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

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
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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

      
      if (assignedPartner){
        const partnerSubject="Request to accept the Patent Search  Form"
      const partnerText="Accept the submission for Patent Search Form"
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Patent Search' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedSearchData.field},
        {label:'Country :',value:unassignedSearchData.country},
        {label:'Invention Description :',value:unassignedSearchData.invention_description},
        // Add more rows as needed
      ];
     const fileData=unassignedSearchData.technical_diagram
      
      // Ensure invention_details is an array and not empty
      if (Array.isArray(fileData) && fileData.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of fileData) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }

      
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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedFERData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedFERData.userID);
    }
    findCustomer.jobs.push(newFERNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

      // Creating a new Job Order Document

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);

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
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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

      if (assignedPartner){
        const partnerSubject="Request to accept the Response to FER Office Action Form"
      const partnerText="Accept the submission for Response to FER Office Action Form"
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Response To FER Office Action' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedFERData.field},
        {label:'Country :',value:unassignedFERData.country},
        {label:'Response Strategy :',value:unassignedFERData.response_strategy},

        // Add more rows as needed
      ];

      const ferFileData=unassignedFERData.fer
      const completeSpecificationsFileData=unassignedFERData.complete_specifications
      
      // Ensure invention_details is an array and not empty
      if (Array.isArray(ferFileData) && ferFileData.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of ferFileData) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }

      if (Array.isArray(completeSpecificationsFileData) && completeSpecificationsFileData.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of completeSpecificationsFileData) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      
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
       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedFTOData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedFTOData.userID);
    }
    findCustomer.jobs.push(newFTONo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

      // Creating a new Job Order Document

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);

      const jobOrderDoc = {
        "_id.job_no": newFTONo,
        service: patentService,
        country: unassignedFTOData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedFTOData.budget,
        status: unassignedFTOData.status,
        domain: unassignedFTOData.domain,
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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

      if (assignedPartner){
        const partnerSubject="Request to accept the Freedom To Operate Form"
      const partnerText="Accept the submission for Freedom To Operate Form"
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Freedom To Operate Search' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedFTOData.field},
        {label:'Country :',value:unassignedFTOData.country},
        // Add more rows as needed
      ];

      const inventionDescriptionFile=unassignedFTOData.invention_description
      const patentApplicationFile=unassignedFTOData.patent_application_details
      
      // Ensure invention_details is an array and not empty
      if (Array.isArray(inventionDescriptionFile) && inventionDescriptionFile.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of inventionDescriptionFile) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }

      if (Array.isArray(patentApplicationFile) && patentApplicationFile.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of patentApplicationFile) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      
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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedLandscapeData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedLandscapeData.userID);
    }
    findCustomer.jobs.push(newLandscapeNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

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
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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

      if (assignedPartner){
        const partnerSubject="Request to accept the Freedom to Patent Landscape Form"
      const partnerText="Accept the submission for Freedom to Patent Landscape Form"
      const attachments=[];
      const tableData = [
        { label: 'Service :', value: 'Freedom to Patent Landscape' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedLandscapeData.field},
        {label:'Country :',value:unassignedLandscapeData.country},
        {label:'Technology Description :',value:unassignedLandscapeData.technology_description},
        {label:'Competitor Information :',value:unassignedLandscapeData.competitor_information},
        
      ];
      
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      
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

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedPortfolioData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedPortfolioData.userID);
    }
    findCustomer.jobs.push(newPortfolioNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

      const jobOrderDoc = {
        "_id.job_no": newPortfolioNo,
        service: patentService,
        country: unassignedPortfolioData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedPortfolioData.budget,
        status: unassignedPortfolioData.status,
        domain: unassignedPortfolioData.domain,
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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
      

      if (assignedPartner){
        const partnerSubject="Request to accept the Patent Portfolio Analysis Form"
      const partnerText="Accept the submission for Patent Portfolio Analysis Form"
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Freedom To Patent Portfolio Analysis' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedPortfolioData.domain},
        {label:'Country :',value:unassignedPortfolioData.country},
        {label:'Business Objectives :',value:unassignedPortfolioData.business_objectives},
        {label:'Market and Industry Information :',value:unassignedPortfolioData.market_and_industry_information},
        // Add more rows as needed
      ];

      const {invention_details}=unassignedPortfolioData.service_specific_files
    
      
      // Ensure invention_details is an array and not empty
      if (Array.isArray(invention_details) && invention_details.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of invention_details) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      
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

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedTranslationData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedTranslationData.userID);
    }
    findCustomer.jobs.push(newTranslationNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

      const jobOrderDoc = {
        "_id.job_no": newTranslationNo,
        service: patentService,
        country: unassignedTranslationData.country,
        start_date: startDate,
        end_date: endDate,
        budget: unassignedTranslationData.budget,
        status: unassignedTranslationData.status,
        domain: unassignedTranslationData.domain,
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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

      if (assignedPartner){
        const partnerSubject="Request to accept the Patent Translation Services Form"
      const partnerText="Accept the submission for Patent Translation Services Form"
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Patent Translation Services' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedTranslationData.domain},
        {label:'Country :',value:unassignedTranslationData.country},
        {label:'Source Language :',value:unassignedTranslationData.source_language},
        {label:'Target Language :',value:unassignedTranslationData.target_language},
        {label:'Additional Instructions :',value:unassignedTranslationData.additional_instructions}
      ];

      const fileData=unassignedTranslationData.document_details
    
      
      // Ensure invention_details is an array and not empty
      if (Array.isArray(fileData) && fileData.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of fileData) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      
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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedIllustrationData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedIllustrationData.userID);
    }
    findCustomer.jobs.push(newIllustrationNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

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
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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

      if (assignedPartner){
        const partnerSubject="Request to accept the Patent Illustration Form"
      const partnerText="Accept the submission for Patent Illustration Form"
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Patent Illustration' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedIllustrationData.field},
        {label:'Country :',value:unassignedIllustrationData.country},
        {label:'Patent Specifications :',value:unassignedIllustrationData.patent_specifications},
        {label:'Drawing Requirements :',value:unassignedIllustrationData.drawing_requirements},
        // Add more rows as needed
      ];

      const preferredStyleFile=unassignedIllustrationData.preferred_style
    
      
      // Ensure invention_details is an array and not empty
      if (Array.isArray(preferredStyleFile) && preferredStyleFile.length > 0) {
        // Iterate through the invention_details array and add each file as a separate attachment
        for (const item of preferredStyleFile) {
          if (item.name && item.base64) {
            const base64Content = item.base64.split(';base64,').pop(); // Get the actual base64 content
            attachments.push({
              filename: item.name,
              content: base64Content,
              encoding: 'base64', // Specify that the content is base64-encoded
            });
          }
        }
      }
      
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      
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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedWatchData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedWatchData.userID);
    }
    findCustomer.jobs.push(newWatchNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

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
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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

      

      if (assignedPartner){
        const partnerSubject="Request to accept the Patent Watch Form"
      const partnerText="Accept the submission for Patent Watch Form"
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Patent Watch' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedWatchData.field},
        {label:'Country :',value:unassignedWatchData.country},
        {label:'Technology or Industry Focus :',value:unassignedWatchData.industry_focus},
        {label:'Competitor Information :',value:unassignedWatchData.competitor_information},
        {label:'Geographic Scope :',value:unassignedWatchData.geographic_scope},
        {label:'Monitoring Duration :',value:unassignedWatchData.monitoring_duration},
        // Add more rows as needed
      ];
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      
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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedLicenseData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedLicenseData.userID);
    }
    findCustomer.jobs.push(newLicenseNo);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

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
        date_partner: [formattedDate, formattedDate, " ", " "], 
        date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
        date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
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
      if (assignedPartner){
        const partnerSubject="Request to accept the Patent Licensing and Commercialization Services Form"
      const partnerText="Accept the submission for Patent Licensing and Commercialization Services Form"
      const attachments = [];
      const tableData = [
        { label: 'Service :', value: 'Patent Licensing and Commercialization Services' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:unassignedLicenseData.field},
        {label:'Country :',value:unassignedLicenseData.country},
        {label:'Patent Information :',value:unassignedLicenseData.patent_information},
        {label:'Commercialization Goals :',value:unassignedLicenseData.commercialization_goals},
        {label:'Competitive Landscape :',value:unassignedLicenseData.competitive_landscape},
        {label:'Technology Description :',value:unassignedLicenseData.technology_description},
        // Add more rows as needed
      ];
      sendEmail(assignedPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
      
  }

}


// To get User Files from Unassigned Schema

const getUnassignedJobFilesForAdmin = async (req, res) => {
  const jobId = req.params.id;
  const service = req.params.services;
  try {
    // Retrieve job details from MongoDB using the provided job ID
    if (service === "Patent Drafting") {
      const jobDetails = await Unassigned.findOne({ "_id.job_no": jobId });

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
        fileNameList.push("Patent_Drafting_Unassigned_Invention_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      // Send the file data as a response to the frontend
      res.json({ fileData: fileDataList, fileName: fileNameList , fileMIME: fileMIMEList});
    } 

    // For Patent Filing
    else if (service === "Patent Filing") {
      const jobDetails = await Unassigned.findOne({ "_id.job_no": jobId });
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
        fileNameList.push("Patent_Filing_Unassigned_Invention_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
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
        fileNameList.push("Patent_Filing_Unassigned_Applicants_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
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
        fileNameList.push("Patent_Filing_Unassigned_Investors_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Patent Search
    else if (service === "Patent Search") {
      const jobDetails = await Unassigned.findOne({ "_id.job_no": jobId });
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
        fileNameList.push("Patent_Search_Unassigned_Technical_Diagram_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }
      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Response To FER/ Office Action
    else if (service === "Response to FER Office Action") {
      const jobDetails = await Unassigned.findOne({ "_id.job_no": jobId });


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
        fileNameList.push("Response_To_FER_Unassigned_FER_File_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
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
        fileNameList.push("Response_To_FER_Unassigned_Complete_Specifications_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      console.log(fileDataList, fileNameList, fileMIMEList)
      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Freedom To Operate Search
    else if (service === "Freedom To Operate") {
      const jobDetails = await Unassigned.findOne({ "_id.job_no": jobId });
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
        fileNameList.push("Freedom_To_Operate_Unassigned_Invention_Description_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
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
        fileNameList.push("Freedom_To_Operate_Unassigned_Patent_Application_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }


      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Freedom to Patent Portfolio Analysis
    else if (service === "Patent Portfolio Analysis") {
      const jobDetails = await Unassigned.findOne({ "_id.job_no": jobId });
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
        fileNameList.push("Patent_Portfolio_Analysis_Unassigned_Invention_Description_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Patent Translation Service
    else if (service === "Patent Translation Services") {
      const jobDetails = await Unassigned.findOne({ "_id.job_no": jobId });
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
        fileNameList.push("Patent_Translation_Services_Unassigned_Document_Details_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }

      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

    // For Patent Illustration
    else if (service === "Patent Illustration") {
      const jobDetails = await Unassigned.findOne({ "_id.job_no": jobId });
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
        fileNameList.push("Patent_Illustration_Unassigned_Preferred_Style_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }


      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });

    }

  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const crossAssignTask = async(req, res) => {
  const jobID = req.body.JobID;
  const patentService = req.body.service;
  const newlyAssignedPartner = req.body.newPartID;
  const previousPartner = req.body.prevPartID;

  console.log("Cross Assign " + jobID + patentService + newlyAssignedPartner + previousPartner);



  // Update Job Order , Respective Schema along with Job Files in that way
  // Change Start Date, End Date, Partner ID, Partner Name, Timeline Status in Job Order
try {
  const thatJobOrder = await JobOrder.findOne({"_id.job_no": parseInt(jobID)});
  if(!thatJobOrder) {
    console.error("No Job Orders found with Job Order " + jobID );
  } else {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

      // Finding the previous Partner
    const previousPartnerDetails = await Partner.findOne({userID: parseInt(previousPartner)});
    if(!previousPartner) {
      console.error("No Partner found with Partner ID " + previousPartner);
    } else {
      // Removing the Job ID from the Previous Partner's Jobs List
      previousPartnerDetails.jobs = previousPartnerDetails.jobs.filter(item => item !== parseInt(jobID));
      previousPartnerDetails.is_free = true;
      previousPartnerDetails.in_progress_jobs = previousPartnerDetails.in_progress_jobs - 1;
      previousPartnerDetails.save().then(() => {
        console.log("Successfully Updated in the Previous Partner's Details");
      }).catch((error) => {
        console.error("Error in updating the details in Previous Partner's Details: " + error);
      });
    }    
    
    // Finding the Newly Assigned Partner
    const newPartner = await Partner.findOne({userID: parseInt(newlyAssignedPartner)});
    if(!newPartner) {
      console.error("No Partner found with Partner ID " + newlyAssignedPartner);
    } else {
      const newPartnerName = newPartner.first_name;
      // Updating the Job Order
      thatJobOrder.start_date = startDate;
      thatJobOrder.end_date = endDate;
      thatJobOrder.partnerName = newPartnerName;
      thatJobOrder.partnerID = newlyAssignedPartner;
      thatJobOrder.steps_done = 2 
      thatJobOrder.steps_done_user = 3;
      thatJobOrder.steps_done_activity =  4;
      thatJobOrder.Accepted = true;
      thatJobOrder.save().then(() => {
        console.log("Job Order successfully Updated with Cross Assign");
      }).catch((error) => {
        console.error("Error in Updating Job Order after Cross Assign: " + error);
      })
      newPartner.jobs.push(parseInt(jobID));
      newPartner.is_free = false;
      newPartner.in_progress_jobs = newPartner.in_progress_jobs + 1;
      newPartner.save().then(() => {
        console.log("Job pushed and Updated Successfully in Newly Assigned Partner's Details");
      }).catch((error) => {
        console.error("Error in Updating the Newly assigned Partner's Details : " + error)
      })
    }

    // Removing the files if the Old Partner had done some work and uploaded it to the Database
    const thatJobFile = await JobFiles.findOne({"_id.job_no": parseInt(jobID)});
    if(!thatJobFile) {
      console.log("Partner didn't upload his Work. Therefore, Leaving it without any changes.");
    } else {
      const deleteThatOne = await JobFiles.deleteOne({"_id.job_no": parseInt(jobID)});
      deleteThatOne.save().then(() => {
        console.log("Deleted the Job FIles with Job Number " + jobID);
      }).catch((error) => {
        console.error("Error in deleting the Job Files with Job Number " + jobID + error);
      })
    }
    
  }

} catch(error) {
  console.error("Error in performing Cross Assign to the Partner : " + error);
}

}

const getPartnersDataForCrossAssign = async  (req, res) => {
  try {
    const { country, services, partID} = req.params; // Assuming you have fields named "country" and "known_fields" in your Partner schema
    console.log("Here " + country + services);
    const partners = await Partner.find({
      country: country,
      userID: {$ne: parseInt(partID)},
      ["known_fields." + services]: true,

    });
    console.log(partners);
    res.json(partners);
  } catch (error) {
    console.error("Error finding partners:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


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
  getCustomers,
  getUnassignedJobFilesForAdmin,
  crossAssignTask,
  getPartnersDataForCrossAssign
};