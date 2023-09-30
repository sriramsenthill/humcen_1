const JobOrder = require("../mongoose_schemas/job_order"); // Import the JobOrder model
const Admin = require("../mongoose_schemas/admin"); // Import the Admin model
const Partner = require("../mongoose_schemas/partner"); // Import the Admin model
const User = require("../mongoose_schemas/user"); // Import the User model
const JobFiles = require("../mongoose_schemas/job_files"); // Import Job Files Model
const Unassigned=require("../mongoose_schemas/unassigned");
const Drafting = require("../mongoose_schemas/patent_drafting");
const Filing = require("../mongoose_schemas/patent_filing"); // Import Patent Filing Model
const Search = require("../mongoose_schemas/search"); // Import Patent Search Model
const {renderJobNumbers} = require("../order_number_generator");
const {PythonShell} = require('python-shell');
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
const AllNotifications = require("../notifications"); // Functions to send Notifications
const Notification = require("../mongoose_schemas/notification"); // Import Notification Model for Users
const NotificationAdmin = require("../mongoose_schemas/notification_admin"); // Import Notification Model for Admin
const BulkOrder = require("../mongoose_schemas/bulk_order"); // Importing Bulk Order Model
const BulkOrderFiles = require("../mongoose_schemas/bulk_order_files");

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
    const unassignedJobOrders = await Unassigned.find({ }).select("domain country _id status customerName budget service");
    let jobLists = [];
    if(unassignedJobOrders.length > 0) {

      const copyJobs = JSON.parse(JSON.stringify(unassignedJobOrders));

      // Remove the _id field from each object in copyJobs
      copyJobs.forEach((job) => {
        delete job._id.job_no;
      });
          unassignedJobOrders.forEach((job) => {
            jobLists.push(job._id.job_no);
          })
      
          const fakeIDs = await renderJobNumbers(jobLists);
          const cleanedArray = fakeIDs.map(item => item.replace(/'/g, '').trim());
          
          for(let jobs=0; jobs<copyJobs.length; jobs++) {
            copyJobs[jobs].og_id = jobLists[jobs]
            copyJobs[jobs]._id.job_no = cleanedArray[jobs]
          }
          console.log(copyJobs);
          res.send( copyJobs );
    }
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
    const jobOrders = await JobOrder.find({}).sort({"_id.job_no": -1});
    let jobLists = [];
    const copyJobs = JSON.parse(JSON.stringify(jobOrders));

// Remove the _id field from each object in copyJobs
copyJobs.forEach((job) => {
  delete job._id.job_no;
});
    jobOrders.forEach((job) => {
      jobLists.push(job._id.job_no);
    })

    const fakeIDs = await renderJobNumbers(jobLists);
    const cleanedArray = fakeIDs.map(item => item.replace(/'/g, '').trim());
    
    for(let jobs=0; jobs<copyJobs.length; jobs++) {
      copyJobs[jobs].og_id = jobLists[jobs]
      copyJobs[jobs]._id.job_no = cleanedArray[jobs]
    }
    console.log(copyJobs);
    res.send( copyJobs );
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
        console.log(name);
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

  try {
    const jobFile = await JobFiles.findOne({ "_id.job_no": jobID });
    const { job_files } = jobFile;

    if (!jobFile) {
      console.log("No Job Files Present under Job No " + jobID);
    } else {
      console.log(req.body);
      if (req.body.accessProvided === true) {
        console.log("Hey correct");
        const findUserThroughJob = await JobOrder.findOne({ "_id.job_no": jobID });
        if (!findUserThroughJob) {
          console.log("Can't able to find the Customer");
        } else {
          const thatCustomer = findUserThroughJob.userID;
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = new Date().toLocaleDateString(undefined, options);

          await AllNotifications.sendToAdmin("You have given access for Verification of Work " + jobID);
          await AllNotifications.sendToPartner(Number(jobFile.partnerID), "Your Work for Job ID " + jobID + " is now sent for Verification to Customer.");
          await AllNotifications.sendToUser(Number(thatCustomer), "Admin has given access for Verification of Work " + jobID);
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

      if (req.body.reduction) {
        const workedPartner = await Partner.findOne({ jobs: { $in: [parseInt(jobID)] } }); // Finding Partner based on the Job ID
        if (workedPartner) {
          console.log(workedPartner.in_progress_jobs);
          const job = await JobOrder.findOne({ "_id.job_no": jobID });
          job.steps_done = req.body.steps_done;
          job.steps_done_user = req.body.steps_user;
          job.steps_done_activity = req.body.steps_activity;
          const options = { year: 'numeric', month: 'long', day: 'numeric' };

          userCount.forEach((user) => {
            job.date_user[user] = new Date().toLocaleDateString(undefined, options);
          });
          for (let userSteps = Math.max(...userCount); userSteps < 6; userSteps++) {
            job.date_user[userSteps] = " ";
          }

          activityCount.forEach((activity) => {
            job.date_activity[activity] = new Date().toLocaleDateString(undefined, options);
          });
          for (let activitySteps = Math.max(...activityCount); activitySteps < 10; activitySteps++) {
            job.date_activity[activitySteps] = " ";
          }

          partnerCount.forEach((partner) => {
            job.date_partner[partner] = new Date().toLocaleDateString(undefined, options);
          });
          for (let partnerSteps = Math.max(...partnerCount); partnerSteps < 6; partnerSteps++) {
            job.date_partner[partnerSteps] = " ";
          }

          await job.save().then((response) => {
            console.log("Successfully updated the Timeline and Job Status");
          }).catch((err) => {
            console.error("Error in Updating Job Status and Timeline");
          });

          workedPartner.save().then((response) => {
            console.log("Successfully updated in the Partner Schema.");
          }).catch((err) => {
            console.error("Error in Updating Partner Schema: ", err);
          });

        await AllNotifications.sendToAdmin("Partner ID " + workedPartner.userID + "'s Work for Job ID " + jobID + " has been rejected and Feedback has been sent successfully.");
        await AllNotifications.sendToPartner(Number(workedPartner.userID), "Your Work for Job ID " + jobID + " has been rejected by the Admin due to some inaccuracies. Make sure to read up the Remarks to find the Issue.");
        } else {
          res.status(404).json({ error: "Partner Not Found" });
        }
      }

      jobFile.save().then(async (response) => {
        const query = JobOrder.findOne({ "_id.job_no": parseInt(jobID) });
        const job = await query.exec();

        if (job) {
          const subject = `Verification for your submission form with job no ${req.params.jobID}`;
          const text = `Verify your ${job.service} form details from the partner`;
          const attachments = [];
          const tableData = [
            { label: 'Service:', value: job.service },
            { label: 'Customer Name:', value: job.customerName },
            { label: 'Country:', value: job.country },
            { label: 'Partner Name:', value: job.partnerName },
            { label: 'Status:', value: job.status },
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

          try {
            const user = await Customer.findOne({ userID: job.userID }).exec();
            if (user) {
              sendEmail(user.email, subject, text, tableData, attachments);
              console.log("Email sent successfully.");
            } else {
              // User not found
              console.log('User not found.');
            }
          } catch (error) {
            // Handle any errors that occurred during the query execution
            console.error('Error retrieving user:', error);
          }

          console.log("Job File status Updated Successfully.");
        } else {
          // Document not found
          console.log('Job not found.');
        }
      }).catch((err) => {
        console.log("Error in saving Job File Status", err);
      });
    }
  } catch (error) {
    console.error("Error in providing Job Files Details: ", error);
  }
};



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
    const jobOrders = await JobOrder.find({"_id.job_no": jobId}).select("-_id");
    console.log("New thing " + jobOrders);
    const jobLists = [jobId];
    let copyJobs = JSON.parse(JSON.stringify(jobOrders));
// Remove the _id.job_no field from the copy
    console.log("California " , copyJobs)

    const fakeIDs = await renderJobNumbers(jobLists);
    const cleanedArray = fakeIDs[0].replace(/\[|\]|'/g, '').trim();
    console.log(cleanedArray);
    copyJobs[0].og_id = jobLists[0];
    console.log("Clean " +cleanedArray);
    copyJobs = {...copyJobs[0], _id: {
      job_no: cleanedArray
    }};
    console.log("This " , JSON.parse(JSON.stringify(copyJobs)));  




    if (jobOrders) {
      console.log(copyJobs);
      res.json( copyJobs );
    } else {
      res.status(404).json({
        error: "No job found with the provided id or unauthorized access",
      });
    }
  } catch (error) {
    console.error("Error fetching job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUnassignedJobById = async (req, res) => {
  const jobId = req.params.jobID
  console.log("Hey " + jobId);
  try {
    const jobOrders = await Unassigned.findOne({"_id.job_no": jobId});
    const jobLists = [jobId];
    const copyJobs = JSON.parse(JSON.stringify(jobOrders));

// Remove the _id.job_no field from the copy
if (copyJobs._id) {
  delete copyJobs._id.job_no;
}
    console.log("California " , copyJobs)

    const fakeIDs = await renderJobNumbers(jobLists);
    const cleanedArray = fakeIDs[0].replace(/\[|\]|'/g, '').trim();
    console.log(cleanedArray);
    copyJobs.og_id = jobLists[0];
  
    copyJobs._id.job_no = cleanedArray;
    console.log("Before this " , copyJobs);

    if (jobOrders) {
      console.log(copyJobs);
      res.json({ copyJobs });
    } else {
      res.status(404).json({
        error: "No job found with the provided id or unauthorized access",
      });
    }
    console.log("jo: " + jobOrders);
    res.json(jobOrders);
  } catch (error) {
    console.error("Error fetching job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUnassignedJobDetailsById = async (req, res) => {
  const jobId = req.params.jobID;
  try {
    const jobOrder = await Unassigned.findOne({"_id.job_no": Number(jobId)}).select("customerName userID service domain field country budget status _id");
    const jobLists = [jobId];
    const copyJobs = JSON.parse(JSON.stringify(jobOrder));

// Remove the _id.job_no field from the copy
if (copyJobs._id) {
  delete copyJobs._id.job_no;
}
    console.log("California " , copyJobs)

    const fakeIDs = await renderJobNumbers(jobLists);
    const cleanedArray = fakeIDs[0].replace(/\[|\]|'/g, '').trim();
    console.log(cleanedArray);
    copyJobs.og_id = jobLists[0];
  
    copyJobs._id.job_no = cleanedArray;
    console.log("Before this " , copyJobs);

    if (jobOrder) {
      console.log(copyJobs);
      res.json(copyJobs );
    } else {
      res.status(404).json({
        error: "No job found with the provided id or unauthorized access",
      })
    }
  }  catch(error) {
    console.error("Error in sending the Details : " + error);
  }
}

const assignTask = async(req, res) => {
  const unassignedJobID = req.body.uaJobID;
  const partnerID = req.body.partID;
  const patentService = req.body.service;
  let newJobID, realStartDate, realEndDate;

  const dummyJobOrder = await JobOrder.findOne({"unassignedID": unassignedJobID});
  if(dummyJobOrder) {
    newJobID = dummyJobOrder._id.job_no;
    realStartDate = dummyJobOrder.start_date;
    realEndDate = dummyJobOrder.end_date;
  }
  const deleteDummyJobOrder = await JobOrder.deleteOne({"unassignedID": unassignedJobID}).then(() => {
    console.log("Dummy Job Order deleted Successfully");
  }).catch((err) => {
    console.error("Error in deleting the Dummy Job Order : " + err);
  });
  // Fetching Data from Unassigned Schema
  if(patentService === "Patent Drafting") {
    const unassignedDraftingData = await Unassigned.findOne({"_id.job_no": parseInt(unassignedJobID)});
    const assignedPartner = await Partner.findOne({userID: parseInt(partnerID)});

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);



    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    // Creating a new Job Order Document

    //  Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedDraftingData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedDraftingData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    });  

      const jobOrderDoc = {
      "_id.job_no": newJobID,
      service: patentService,
      country: unassignedDraftingData.country,
      start_date: realStartDate,
      end_date: realEndDate,
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
      console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
    }).catch((error) => {
      console.error("Error in saving Document inside Job Order Schema : " + error);
    });

    //   Creating a new Service Document

      const draftingDoc = {
        "_id.job_no": newJobID,
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
        console.log("Job Order " + newJobID + " saved successfully in Drafting Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Drafting Schema : " + error);
      });

    //   Deleting the Old Unassigned Document
      const noLongerUnassigned = await Unassigned.deleteOne({"_id.job_no": parseInt(unassignedJobID)}).then((response) => {
        console.log("Unassigned Task with Job Number " + unassignedJobID + " has been deleted successfully");
      }).catch((error) => {
        console.error("Error in deleting the Unassigned Task : " + error);
      })

    //   Pushing the Job Number to Partner's Jobs Array
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully.")
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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
    //     Add more rows as needed
      ];

      const { invention_details } = unassignedDraftingData.service_specific_files;
          
    //   Ensure invention_details is an array and not empty
      if (Array.isArray(invention_details) && invention_details.length > 0) {
    //     Iterate through the invention_details array and add each file as a separate attachment
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
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedFilingData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedFilingData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedFilingData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const filingDoc = {
        "_id.job_no": newJobID,
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
        console.log("Job Order " + newJobID + " saved successfully in Filing Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")


      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedSearchData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedSearchData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedSearchData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const searchDoc = {
        "_id.job_no": newJobID,
        country: unassignedSearchData.country,
        userID: unassignedSearchData.userID,
        invention_description: unassignedSearchData.invention_description,
        technical_diagram: unassignedSearchData.technical_diagram,
        field: unassignedSearchData.domain,
        keywords: unassignedSearchData.keywords,
      }

      const searchSchemaDoc = await new Search(searchDoc).save().then((response) => {
        console.log("Job Order " + newJobID + " saved successfully in Patent Search Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")


      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedFERData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedFERData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

      // Creating a new Job Order Document

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedFERData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const FERDoc = {
        "_id.job_no": newJobID,
        country: unassignedFERData.country,
        userID: unassignedFERData.userID,
        response_strategy: unassignedFERData.response_strategy,
        fer: unassignedFERData.fer,
        complete_specifications: unassignedFERData.complete_specifications,
        field: unassignedFERData.field,
      }

      const FERSchemaDoc = await new responseToFER(FERDoc).save().then((response) => {
        console.log("Job Order " + newJobID + " saved successfully in Response to FER / Office Action Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")


      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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
  
       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedFTOData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedFTOData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

      // Creating a new Job Order Document

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedFTOData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const FTODoc = {
        "_id.job_no": newJobID,
        field: unassignedFTOData.field,
        invention_description: unassignedFTOData.invention_description,
        patent_application_details: unassignedFTOData.patent_application_details,
        keywords: unassignedFTOData.keywords,
        userID: unassignedFTOData.userID,
        country: unassignedFTOData.country,
      }

      const FTOSchemaDoc = await new freedomToOperate(FTODoc).save().then((response) => {
        console.log("Job Order " + newJobID + " saved successfully in Freedom To Operate Search Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")


      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedLandscapeData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedLandscapeData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedLandscapeData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const landscapeDoc = {
        "_id.job_no": newJobID,
        field: unassignedLandscapeData.field,
        technology_description: unassignedLandscapeData.technology_description,
        keywords: unassignedLandscapeData.keywords,
        competitor_information: unassignedLandscapeData.competitor_information,
        userID: unassignedLandscapeData.userID,
        country: unassignedLandscapeData.country,
      }

      const landscapeSchemaDoc = await new patentLandscape(landscapeDoc).save().then((response) => {
        console.log("Job Order " + newJobID + " saved successfully in Freedom To Patent Landscape Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")


      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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

      // Creating a new Job Order Document

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedPortfolioData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedPortfolioData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedPortfolioData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const portfolioDoc = {
        "_id.job_no": newJobID,
        country: unassignedPortfolioData.country,
        market_and_industry_information: unassignedPortfolioData.market_and_industry_information,
        business_objectives: unassignedPortfolioData.business_objectives,
        userID: unassignedPortfolioData.userID,
        service_specific_files: unassignedPortfolioData.service_specific_files,
      }

      const portfolioSchemaDoc = await new patentPortfolioAnalysis(portfolioDoc).save().then((response) => {
        console.log("Job Order " + newJobID + " saved successfully in Freedom To Patent Portfolio Analysis Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")

      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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
  
      // Creating a new Job Order Document

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedTranslationData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedTranslationData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedTranslationData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const translationDoc = {
        "_id.job_no": newJobID,
        source_language: unassignedTranslationData.source_language,
        target_language: unassignedTranslationData.target_language,
        document_details: unassignedTranslationData.document_details,
        userID: unassignedTranslationData.userID,
        additional_instructions: unassignedTranslationData.additional_instructions,
        country: unassignedTranslationData.country,
      }

      const translationSchemaDoc = await new patentTranslation(translationDoc).save().then((response) => {
        console.log("Job Order " + newJobID + " saved successfully in Patent Translation Services Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")


      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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

       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedIllustrationData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedIllustrationData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedIllustrationData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const illustrationDoc = {
        "_id.job_no": newJobID,
        field: unassignedIllustrationData.field,
        country: unassignedIllustrationData.country,
        patent_specifications: unassignedIllustrationData.patent_specifications,
        drawing_requirements: unassignedIllustrationData.drawing_requirements,
        preferred_style: unassignedIllustrationData.preferred_style,
        userID: unassignedIllustrationData.userID,

      }

      const illustrationSchemaDoc = await new patentIllustration(illustrationDoc).save().then((response) => {
        console.log("Job Order " + newJobID + " saved successfully in Patent Illustration Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")


      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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
  
       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedWatchData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedWatchData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedWatchData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const watchDoc = {
        "_id.job_no": newJobID,
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
        console.log("Job Order " + newJobID + " saved successfully in Patent Watch Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")


      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
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
       // Push job details to the Customer 
    const findCustomer = await Customer.findOne({userID: unassignedLicenseData.userID})
    if(!findCustomer) {
      console.error("No Customer exists with ID " + unassignedLicenseData.userID);
    }
    findCustomer.jobs.push(newJobID);
    findCustomer.save().then(() => {
      console.log("Job Number pushed to Customer Schema");
    }).catch((err) => {
      console.error("Error in pushing the Job to Customer Schema: " + err);
    }); 

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

      // Creating a new Job Order Document

      const jobOrderDoc = {
        "_id.job_no": newJobID,
        service: patentService,
        country: unassignedLicenseData.country,
        start_date: realStartDate,
        end_date: realEndDate,
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
        console.log("Job Order " + newJobID + " saved successfully in Job Order Schema" );
      }).catch((error) => {
        console.error("Error in saving Document inside Job Order Schema : " + error);
      });
  
      // Creating a new Service Document

      const licenseDoc = {
        "_id.job_no": newJobID,
        field: unassignedLicenseData.field,
        patent_information: unassignedLicenseData.patent_information,
        commercialization_goals: unassignedLicenseData.commercialization_goals,
        competitive_landscape: unassignedLicenseData.competitive_landscape,
        technology_description: unassignedLicenseData.technology_description,
        userID: unassignedLicenseData.userID,
        country: unassignedLicenseData.country,
      }

      const licenseSchemaDoc = await new patentLicense(licenseDoc).save().then((response) => {
        console.log("Job Order " + newJobID + " saved successfully in Patent Licensing and Commercialization Schema" );
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
      assignedPartner.jobs.push(newJobID);
      assignedPartner.in_progress_jobs = assignedPartner.in_progress_jobs + 1;
      assignedPartner.save().then((response) => {
        console.log("Job Number " + newJobID + " successfully pushed to the Partner");
      }).catch((error) => {
        console.log("Error in Pushing the Job to the Partner : " + error);
      });
      await AllNotifications.sendToAdmin("Unassigned Job ID " + unassignedJobID + " has been assigned to Partner ID "+ partnerID +" as " + newJobID + "successfully.");
      await AllNotifications.sendToPartner(Number(partnerID), "Job ID" + newJobID +" has been assigned manually to you by Admin successfully.");
      await AllNotifications.sendToUser(Number(findCustomer.userID), "Your Job of ID " + newJobID + " has been assigned to Partner ID" + partnerID +" successfully")

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
  res.status(200).send({message: "Received Successfully"});


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

  await AllNotifications.sendToAdmin("Job ID " + jobID +  " has been cross-assigned from Partner ID " + previousPartner +" to Partner ID " + newlyAssignedPartner +" successfully");
  await AllNotifications.sendToPartner(Number(previousPartner), "Assigned Job of ID " + jobID + " has been assigned to a new Partner. Thank You!");
  await AllNotifications.sendToPartner(Number(newlyAssignedPartner), "You have been cross-assigned the Job of ID " + jobID + " by Admin successfully.");


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


const getAllBulkOrders = async(req, res) => {
  try {
    const bulkOrders = await BulkOrder.find({Assigned: false}).select("-bulk_order_files");
    let jobLists = [];
    const copyJobs = JSON.parse(JSON.stringify(bulkOrders));

    // Remove the _id field from each object in copyJobs
    copyJobs.forEach((job) => {
      delete job._id.job_no;
    });
        bulkOrders.forEach((job) => {
          jobLists.push(job._id.job_no);
        })
    
        const fakeIDs = await renderJobNumbers(jobLists);
        const cleanedArray = fakeIDs.map(item => item.replace(/'/g, '').trim());
        
        for(let jobs=0; jobs<copyJobs.length; jobs++) {
          copyJobs[jobs].og_id = jobLists[jobs]
          copyJobs[jobs]._id.job_no = cleanedArray[jobs]
        }

    if(!bulkOrders) {
      console.log("No Pending Bulk Orders");
    } else {
      console.log("Sending the Pending Bulk Orders");
      console.log(copyJobs);
      res.json({ copyJobs });
    }
  } catch(error) {
    console.error("Error in finding Bulk Orders : " +error);
  }

}

const getBulkOrderById = async(req, res) => {
  try {
    const bulkOrderId = req.params.id;
    console.log("Hey" + bulkOrderId);
    const foundBulkOrder = await BulkOrder.findOne({"_id.job_no": Number(bulkOrderId)}).select("-bulk_order_files");
    const jobLists = [foundBulkOrder._id.job_no];
    const copyJobs = JSON.parse(JSON.stringify(foundBulkOrder));

// Remove the _id.job_no field from the copy
if (copyJobs._id) {
  delete copyJobs._id.job_no;
}
    console.log("California " , copyJobs)

    const fakeIDs = await renderJobNumbers(jobLists);
    const cleanedArray = fakeIDs[0].replace(/\[|\]|'/g, '').trim();
    console.log(cleanedArray);
    copyJobs.og_id = jobLists[0];
    console.log("This " + copyJobs);  

    copyJobs._id.job_no = cleanedArray;

    if(!foundBulkOrder) {
      console.log("No Bulk Order found for Job Number " + bulkOrderId);
    } else {
      console.log("Sending the details of that particular Bulk Order..");
      console.log(copyJobs);
      res.json( copyJobs );
    } 
  } catch(error) {
    console.error('Error in getting the Bulk Order Details : ' + error);
  }
}

const getBulkOrderFileById = async(req, res) => {
  try {
    const bulkOrderId = req.params.id;
    console.log("Hey" + bulkOrderId);
    const foundBulkOrder = await BulkOrder.findOne({"_id.job_no": Number(bulkOrderId)}).select("bulk_order_files");
    if(!foundBulkOrder) {
      console.log("No Bulk Order found for Job Number " + bulkOrderId);
    } else {
      console.log("Sending the files of that particular Bulk Order..");
      console.log("This " + foundBulkOrder);
      res.json(foundBulkOrder);
    } 
  } catch(error) {
    console.error('Error in getting the Bulk Order Files : ' + error);
  }
}

const getPartnersForBulkOrder = async(req, res) => {
  try {
    const chosenService = req.params.service;
    const chosenCountry = req.params.country;
    
    const partnersList = await Partner.find({["known_fields."+chosenService]: true, country: chosenCountry});
    const nameList = [];
    const idList = [];
    partnersList.forEach((partner) => {
      nameList.push(partner.first_name + " " + partner.last_name);
      idList.push(partner.userID);
    });

    res.json({names: nameList, uniqueIDs: idList});
  } catch(error) {
    console.error("Error in Getting Partners : " + error);
  }
}

const assignBulkOrder = async(req, res) => {
  try {
    const orderID = req.params.id;
    const customer_ID = req.body.customerID;
    const partner_ID = req.body.partnerID;
    const service = req.body.chosenService;
    const title = req.body.jobTitle;
    const country = req.body.desiredCountry;
    let requiredFiles = req.body.inputFiles;
    requiredFiles.map((file) => {
      file.base64 = "data:"+file.type+";base64,"+file.base64;
    });

    // Finding Customer 

    const thatCustomer = await Customer.findOne({userID: Number(customer_ID)});
    if(!thatCustomer) {
      console.log("No Customer found for Customer ID : " + customer_ID);
    }

    // Finding Partner
    const thatPartner = await Partner.findOne({userID: Number(partner_ID)});
    if(!thatPartner) {
      console.log("No Partner found for Partner ID : " + partner_ID);
    }

    const customer_name = thatCustomer.first_name;
    const partner_name = thatPartner.first_name;

    // Creating a New Job Order
    const latestJobOrder = await JobOrder.findOne()
    .sort({ "_id.job_no": -1 })
    .limit(1)
    .exec();

    let newJobNo = latestJobOrder
    ? latestJobOrder._id.job_no + 1
    : 1000;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newBulkJob = {
      "_id.job_no": newJobNo,
      service: service,
      country: country,
      start_date: startDate,
      end_date: endDate,
      budget: "To be Assigned",
      status: "In Progress",
      userID: customer_ID,
      customerName: customer_name,
      partnerID: partner_ID,
      partnerName: partner_name,
      steps_done: 2, 
      steps_done_user: 3,
      steps_done_activity: 4,
      date_partner: [formattedDate, formattedDate, " ", " "], 
      date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
      date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
      Accepted: true,
      bulk: true,
      job_title: title,
      prev_id: Number(orderID),
      job_desc: "To be Assigned",
    }

    const newOrder = new JobOrder(newBulkJob).save().then(() => {
      console.log("Bulk Order sent as Job Order successfully.");
    }).catch((error) => {
      console.error("Error in Creating the Job Order from Bulk Order : " +error)
    });

    
        // Pushing Job to User and Partner, Increasing the In Progress Jobs

    thatPartner.in_progress_jobs = thatPartner.in_progress_jobs + 1;
    thatPartner.is_free = false;
    thatPartner.jobs.push(newJobNo);
    thatPartner.save().then(() => {
      console.log("Bulk Order Job Successfully Assigned to ID " + partner_ID);
    }).catch((error) => {
      console.error("Error in Assigning Job to the Partner : " + error);
    });

    thatCustomer.jobs.push(newJobNo);
    thatCustomer.save().then(() => {
      console.log("Job added to the Customer Schema successfully");
    }).catch((error) => {
      console.error("Error in adding Job to the Customer Schema.")
    });

    // Clearing out that particular Bulk Order from Admin sight.
    const findThatBulkOrder = await BulkOrder.findOne({"_id.job_no": Number(orderID)});
    if(!findThatBulkOrder) {
      console.log("No Bulk Order found for ID " + orderID);
    } else {
      findThatBulkOrder.Assigned = true;
      findThatBulkOrder.save().then(() => {
        console.log("Bulk Order Updated Successfully.");
      }).catch((error) => {
        console.error("Error in assigning the Bulk Order to Partner: " + error);
      })
    }

  await AllNotifications.sendToAdmin("Bulk Order of ID " + orderID + " has been assigned to Partner of ID " + partner_ID + " successfully.");
  await AllNotifications.sendToPartner(Number(partner_ID), "You have been assigned a Bulk Order of ID " + newJobNo + " by Admin.");

  }
  catch(error) {
    console.error("Error in receiving the Assign Data : " + error);
  }
}

const notificationAdminSeen = async(req, res) => {
  const notificID = req.params.userI

  const thatAdminNotifs = await NotificationAdmin.findOne({admin_Id: 1});
  console.log(thatAdminNotifs);
  if(!thatAdminNotifs) {
    console.error("That Notification doesn't exists.");
  } else {
    thatAdminNotifs.notifications[parseInt(notificID) - 1].seen = true;
    thatAdminNotifs.save().then(() => {
      console.log("Notification Seen");
    }).catch((error) => {
      console.error('Error in seeing the Notification : ' + error);
    })
  }
}

const notifcationsAdminDelete = async(req, res) => {
  const listOfNotifDeleted = req.body.deletedNotifs;

  try {
    const findNotification = await NotificationAdmin.findOne({admin_Id: 1});
    if(!findNotification) {
      console.log("No Notifications available for Admin");
    } else {
      const updatedNotifs = findNotification.notifications.filter(notif => !listOfNotifDeleted.includes(notif.notifNum));
      findNotification.notifications = updatedNotifs;
      findNotification.save().then(() => {
        console.log("Notifications deleted Successfully.")
      }).catch((err) => {
        console.error('Error in deleting Notifications : ' + err);
      })
    }
  } catch(err) {
    console.error("Error in deleting Notifications : " + err);
  }
}

const sortAdminNotifications = async(req, res) => {
  const interval = req.params.days;

  const today = new Date();
  const totalNotifs = await NotificationAdmin.findOne({admin_Id: 1});
  if(!totalNotifs) {
    console.log("No Notifcations Left to Sort.");
  } else {
    const sortedNotifs = totalNotifs.notifications.filter((notif) => {
      return Math.round((today.getTime() - new Date(notif.notifDate).getTime())/(1000 * 3600 * 24)) <= Number(interval)
    });
    console.log(sortedNotifs.length);
    console.log("Sorted Notifications sent Successfully. ");
    res.status(200).json(sortedNotifs)
  }
}

const clearAdminRecentNotifs = async(req, res) => {

  try {
    const allNotifications = await NotificationAdmin.findOne({admin_Id: 1});
    if(!allNotifications) {
      console.log("No Notifications found.");
    } else {
      allNotifications.notifications = allNotifications.notifications.map((notification) => {
        notification.seen = true;
        return notification;
      });
      allNotifications.save().then(() => {
        console.log("All Recent Notifications Successfully Cleared");
      }).catch((err) => {
        console.error('Error in Clearing out Recent Notifications : ' + err)
      })
    }
  } catch(error) {
    console.error("Error in Clearing out Recent Notifications : " + error);
  }
}

const getAdminNotification = async (req, res) => {
  try {
    const thatAdminNotifs = await NotificationAdmin.findOne({ admin_Id: 1 });
    console.log(thatAdminNotifs);
    if (!thatAdminNotifs) {
      console.error("Notifications for Admin do not exist.");
      res.status(404).json({ error: "Notifications not found" });
    } else {
      res.json(thatAdminNotifs.notifications);
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createBulkOrders = async(req, res) => {
  try {
    const automatedJobs = req.body.bulkJobs;
    const automatedTitles = req.body.bulkTitles;
    const automatedFiles = req.body.bulkFiles;
    const thatBulkOrderFileID = req.body.fileNumber;

    const findThatBulkOrder = await BulkOrderFiles.findOne({"_id.job_no": thatBulkOrderFileID});
    if(!findThatBulkOrder) {
      console.log("No Bulk Order file present for File ID " + thatBulkOrderFileID);
    } 
    const thatCustomer = findThatBulkOrder.user_ID;
    findThatBulkOrder.generated = true;
    findThatBulkOrder.save().then(() => {
      console.log("Bulk Order Generation Status Updated Successfully.");
    }).catch((error) => {
      console.errorr("Error in Updating Bulk Order Generation Status.");
    })

    console.log("Bulk Orders Received. Please wait for sometime.");
    const newBulkOrders = [];
    const latestBulkOrder = await BulkOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    let newBulkOrderNo = latestBulkOrder
      ? latestBulkOrder._id.job_no + 1
      : 2000;

    for(let orders=0; orders < automatedJobs.length; orders++) {
      const newBulkOrder = new BulkOrder({
        "_id.job_no": newBulkOrderNo + orders,
        user_ID: Number(thatCustomer),
        bulk_order_service: findThatBulkOrder.service,
        country: findThatBulkOrder.country,
        bulk_order_title: automatedTitles[orders],
        bulk_order_files: automatedFiles[orders],
        })
        
      try {
      newBulkOrder.save();
      console.log(`${orders + 1} Bulk Orders Successfully Created`);
    } catch (error) {
      console.error("Error in creating Bulk Orders: " + error);
    }

    }
    if(automatedTitles.length > 0 ) {
    await AllNotifications.sendToAdmin(`${automatedTitles.length} Bulk Orders has been created Successfully.`);
    await AllNotifications.sendToUser(Number(thatCustomer), "Your Bulk Orders has been generated successfully and tasks are going to be assigned to the Partners by the Admin.");
    } 


  } catch(error) {
    console.error("Error in Creating Bulk Orders : " + error);
  }
  console.log("Process has ended.");
}

const getCSVData = async (req, res) => {
  try {
    const inputData = req.params.base;

    
    let options = {
      mode: 'json',
      pythonOptions: ['-u'], // get print results in real-time
      args: [inputData] //An argument which can be accessed in the script using sys.argv[1]
  };

    PythonShell.run('base_64_flask.py', options).then(result=>{
      let jobs = [];
      result[0].Job_ID.forEach((job) => {
        jobs.push(String(job) + '/');
      })
      res.json({fileDirectory: jobs, 
                bulkOrderID: result[0].Job_ID, 
                bulkOrderTitle: result[0].Job_Title});
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getBulkOrderFilesDetails = async(req, res) => {
  try {
    const bulkFilesDetails = await BulkOrderFiles.find({})
    if(!bulkFilesDetails) {
      console.log("No Bulk Order Files found.");
    } else {
      console.log("Sending Bulk Order Files Details");
      res.json(bulkFilesDetails);
    }

  } catch(error) {
    console.error("Error in fetching Bulk Order Files : " + error);
  }
}

const getParticularBulkOrderFileDetails = async(req, res) => {
  try {
    const thatFile = req.params.fileNo;

    const thatBulkOrderFile = await BulkOrderFiles.findOne({"_id.job_no": Number(thatFile)});
    

    if(!thatBulkOrderFile) {
      console.log("No Bulk Order Files found for ID " + thatFile);
    } else {
      const findCustomer = await Customer.findOne({userID: thatBulkOrderFile.user_ID});
      if(!findCustomer) {
        console.log("No Customer Found for User ID " + thatBulkOrderFile.user_ID);
      } else {
        const bulkOrderRequestDetails = {order: thatBulkOrderFile, email: findCustomer.email, generate: thatBulkOrderFile.generated} ;
        console.log("Sending the details of that Particular Bulk Order File...");
        res.json(bulkOrderRequestDetails);
      }
    }
  } catch(error) {
    console.error("Error in getting the Bulk Order File Details : " + error);
  }
}

const getOnlyTheParticularBulkOrderFile = async(req, res) => {
  try {
    const thatFile = req.params.fileNo;

    const thatBulkOrderFile = await BulkOrderFiles.findOne({"_id.job_no": Number(thatFile)}).select("_id user_files");
    if(!thatBulkOrderFile) {
      console.log("No Bulk Order Files found for ID " + thatFile);
    } else {
      console.log("Sending the details of that Particular Bulk Order File...");
      res.json(thatBulkOrderFile);
    }
  } catch(error) {
    console.error("Error in getting the Bulk Order File Details : " + error);
  }

}

const getBulkOrderAssignTabDetails = async(req, res) => {
  try {
    const bulkIDs = req.params.bulkLists.split(",").map(elem => Number(elem)); // Getting the Bulk Order IDs
    let userEmails = []
    let countries = [];
    let services = [];

    for(let totalSelected = 0; totalSelected < bulkIDs.length; totalSelected++ ) {
      // Finding the User who requested it to get their emails
      let thatBulkOrder = await BulkOrder.findOne({"_id.job_no": bulkIDs[totalSelected]});
      if(!thatBulkOrder) { 
        // If the Bulk Order doesn't exist

        console.log("No Bulk Order Found for that ID ");
      } else if(thatBulkOrder) { 
        // If the Bulk Order exists

        let customerID = thatBulkOrder.user_ID;
        let thatService = thatBulkOrder.bulk_order_service;
        let thatCountry = thatBulkOrder.country;

        services.push(thatService);
        countries.push(thatCountry);
        // Finding the Customer
        let thatCustomer = await Customer.findOne({userID: Number(customerID)});
        if(!thatCustomer) {
          // If no Customer is found
          console.log("Customer ID " + customerID + " not found.");
        } else if(thatCustomer) {
          // Finding and adding the Email to be sent as Response
          let email = thatCustomer.email;
          userEmails.push(email);
        }
      }
    }

    const finalJSON = {
      emails: userEmails,
      bulkServices: services,
      bulkCountries: countries,
    }
    console.log(bulkIDs);
    res.json(finalJSON);
  } catch(error) {
    console.error("Error in sending Bulk Order Assign Details : " + error);
  }

}

const getBulkOrderAssignPartners = async(req, res) => {
  try {
    let partnerAssignData = []
    const selectedBulkOrders = req.params.bulkOrders.split(",").map((elem) => Number(elem));
    const orderService = req.params.service;
    const orderCountry = req.params.country;

    const findPartner = await Partner.find({[`known_fields.${orderService}`]: true, country: orderCountry});
    if(!findPartner) {
      console.log("No Partners found or available for Job.");
    } else {
      findPartner.forEach((partner) => {
        partnerAssignData.push({
          name: partner.first_name + " " + partner.last_name,
          uid: partner.userID
        })
      })

      res.json(partnerAssignData);
    }

  } catch(error) {
    console.error("Error in sending Partners details as response : " + error);
  }
}

const assignBulkOrdersToPartners = async(req, res) => {
  try {
    const thoseBulkOrders = req.params.bulkIDs.split(",").map((elem) => Number(elem));
    const partnerUID = req.params.partnerID;
    let userIDLists = [];
    let countries = [];
    let services = [];
    let jobOrdersID = [];
    let files = [];
    let titles = [];
    let findPartner, findCustomer;

    // Finding the Customer through Bulk Orders
    for(let totalOrders=0; totalOrders < thoseBulkOrders.length; totalOrders++) {
      let bulkOrders = await BulkOrder.findOne({"_id.job_no": thoseBulkOrders[totalOrders]});
      if(!bulkOrders) {
        console.log("No Bulk Orders found for that ID.");
      } else {
        userIDLists.push(bulkOrders.user_ID);
        countries.push(bulkOrders.country);
        services.push(bulkOrders.bulk_order_service);
        files.push(bulkOrders.bulk_order_files);
        titles.push(bulkOrders.bulk_order_title);
      }
    }

    const user = userIDLists.filter((value, index, array) => array.indexOf(value) === index);
    
    if(user.length === 1) {
      findCustomer = await Customer.findOne({userID: user[0]});
      if(!findCustomer) {
        console.log("No Customer found for that ID");
      } else {
        let customerName = findCustomer.first_name;

        findPartner = await Partner.findOne({userID: Number(partnerUID)});
        if(!findPartner) {
          console.log("No Partner Found.");
        }

        for(let totalOrders=0; totalOrders < thoseBulkOrders.length; totalOrders++) {
      

          // Creating a New Job Order
    let latestJobOrder = await JobOrder.findOne()
    .sort({ "_id.job_no": -1 })
    .limit(1)
    .exec();

    let newJobNo = latestJobOrder
    ? latestJobOrder._id.job_no + 1
    : 1000;

    let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = new Date().toLocaleDateString(undefined, options);

    let newBulkJob = {
      "_id.job_no": newJobNo,
      service: services[totalOrders],
      country: countries[totalOrders],
      start_date: startDate,
      end_date: endDate,
      budget: "To be Assigned",
      status: "In Progress",
      userID: user[0],
      customerName: customerName,
      partnerID: findPartner ? findPartner.userID : "",
      partnerName: findPartner ? findPartner.first_name : "",
      steps_done: 2, 
      steps_done_user: 3,
      steps_done_activity: 4,
      date_partner: [formattedDate, formattedDate, " ", " "], 
      date_user: [formattedDate, formattedDate, formattedDate, " ", " ", " "],
      date_activity: [formattedDate, formattedDate, formattedDate, formattedDate, " ", " ", " ", " ", " ", " "],
      Accepted: true,
      bulk: true,
      job_title: titles[totalOrders],
      prev_id: thoseBulkOrders[totalOrders],
      job_desc: "To be Assigned",
    }

    jobOrdersID.push(newJobNo);

    let newOrder = new JobOrder(newBulkJob).save().then(() => {
      console.log("Bulk Order sent as Job Order successfully.");
    }).catch((error) => {
      console.error("Error in Creating the Job Order from Bulk Order : " +error)
    });

        
    // Clearing out that particular Bulk Order from Admin sight.
    let findThatBulkOrder = await BulkOrder.findOne({"_id.job_no": thoseBulkOrders[totalOrders]});
    if(!findThatBulkOrder) {
      console.log("No Bulk Order found for ID " + orderID);
    } else {
        findThatBulkOrder.Assigned = true;
        findThatBulkOrder.save().then(() => {
        console.log("Bulk Order Updated Successfully.");
        }).catch((error) => {
        console.error("Error in assigning the Bulk Order to Partner: " + error);
      })
     }
        

        }

      }
    }

    findPartner.in_progress_jobs = findPartner.in_progress_jobs + thoseBulkOrders.length;
    findPartner.is_free = false;

    jobOrdersID.forEach((job) => {
      findPartner.jobs.push(job);
      findCustomer.jobs.push(job);
    })

    findPartner.save().then(() => {
      console.log("Bulk Order Job Successfully Assigned to ID " + findPartner.userID);
    }).catch((error) => {
      console.error("Error in Assigning Job to the Partner : " + error);
    });

    findCustomer.save().then(() => {
      console.log("Job added to the Customer Schema successfully");
    }).catch((error) => {
      console.error("Error in adding Job to the Customer Schema.")
    });


    await AllNotifications.sendToAdmin( thoseBulkOrders.length + " Bulk Orders successfully assigned to Partner ID " + partnerUID + " successfully");
    await AllNotifications.sendToPartner(Number(partnerUID), "You were assigned " + thoseBulkOrders.length + " Bulk Orders by Admin" );
    await AllNotifications.sendToUser(Number(user[0]), thoseBulkOrders.length+" of your Bulk Orders has been assigned to a Partner successfully");

    console.log(thoseBulkOrders, partnerUID);

    res.status(200).send({message: "Successfully Created"});

  } catch(error) {
    console.error("Error in assigning Bulk Orders to Partners : " + error);
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
  getUnassignedJobDetailsById,
  getPartnersData,
  assignTask,
  getCustomers,
  getUnassignedJobFilesForAdmin,
  crossAssignTask,
  getPartnersDataForCrossAssign,
  getAllBulkOrders,
  getBulkOrderById,
  getBulkOrderFileById,
  getPartnersForBulkOrder,
  assignBulkOrder,
  notificationAdminSeen,
  notifcationsAdminDelete,
  sortAdminNotifications,
  clearAdminRecentNotifs,
  getAdminNotification,
  getCSVData,
  createBulkOrders,
  getBulkOrderFilesDetails,
  getParticularBulkOrderFileDetails,
  getOnlyTheParticularBulkOrderFile,
  getBulkOrderAssignTabDetails,
  getBulkOrderAssignPartners,
  assignBulkOrdersToPartners
};