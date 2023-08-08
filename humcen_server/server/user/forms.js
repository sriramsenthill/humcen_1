const Search = require("../mongoose_schemas/search"); // Import the Patent Search Model
const patentPortfolioAnalysis = require("../mongoose_schemas/patent_portfolio_analysis"); // Import Patent Portfolio Analysis Model
const patentTranslation = require("../mongoose_schemas/patent_translation_service"); // Import Patent Translation Services Mode
const patentLicense = require("../mongoose_schemas/patent_licensing"); // Import Patent Licensing and Commercialization Services Model
const patentLandscape = require("../mongoose_schemas/freedom_to_patent_landscape"); // Import Freedom to Patent Landscape Model
const patentWatch = require("../mongoose_schemas/patent_watch"); // Import Patent Watch Model
const responseToFer = require("../mongoose_schemas/response_to_fer"); // Import Response To FER Model
const freedomToOperate = require("../mongoose_schemas/freedom_to_operate"); // Import the Freedom To Operate Search Model
const JobOrder = require("../mongoose_schemas/job_order"); // Import the JobOrder model
const Partner = require("../mongoose_schemas/partner"); // Import the Partner model
const patentIllustration = require("../mongoose_schemas/patent_illustration"); // Import Patent Illustration Model
const Consultation = require("../mongoose_schemas/consultation");
const Customer=require("../mongoose_schemas/customer");
const { spawn } = require('child_process'); // Import the spawn function
const {PythonShell} = require('python-shell');
const JobFiles=require("../mongoose_schemas/job_files");
const Drafting = require("../mongoose_schemas/patent_drafting");
const Filing = require("../mongoose_schemas/patent_filing");
const Unassigned = require("../mongoose_schemas/unassigned");
const sendEmail = require("../email.js");
const Notification = require("../mongoose_schemas/notification"); // Import Notification Model
const NotificationPartner = require("../mongoose_schemas/notification_partner"); // Import Notification for Partner model
const NotificationAdmin = require("../mongoose_schemas/notification_admin"); // Import Notification Model for Admin
const Admin= require("../mongoose_schemas/admin");
const BulkOrder = require("../mongoose_schemas/bulk_order"); // Import Bulk Order Module

// Define your API route for fetching job order data
const getJobOrderOnID = async (req, res) => {
  const { id } = req.params;
  const userID = req.userId;

  try {
    const specificJob = await JobOrder.findOne({ "_id.job_no": id, userID });

    if (specificJob) {
      res.json(specificJob);
    } else {
      res.status(404).json({
        error: "No job found with the provided id or unauthorized access",
      });
    }
  } catch (error) {
    console.error("Error fetching job order data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getJobOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const jobOrders = await JobOrder.find({ userID: userId });
    res.json({ jobOrders });
  } catch (error) {
    console.error("Error fetching job orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createPatentConsultation = async (req, res) => {
  try {
    const { service, email, meeting_date_time } = req.body;
    const userId = req.userId;
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
};


const createJobOrderPatentDrafting = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const draftingData = req.body;
    console.log(draftingData);
    draftingData.userID = userId;

    // Find the partner and customer
    const findPartner = await Partner.findOne({
      is_free: true,
      ["known_fields.Patent Drafting"]: true,
      country: req.body.country
    });

    const findCustomer = await Customer.findOne({ userID: userId });
    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})
    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    
    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedDraftingOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedDraftingNo = latestUnassignedDraftingOrder
      ? latestUnassignedDraftingOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newDraftingData = draftingData;
      newDraftingData.service = "Patent Drafting";
      newDraftingData.customerName = findCustomer.first_name;
      newDraftingData.status = "In Progress";
      console.log(newDraftingData);
      const unassignedDraftingOrder = new Unassigned(newDraftingData);
      unassignedDraftingOrder._id.job_no =  newUnassignedDraftingNo ;
      
      unassignedDraftingOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedDraftingOrder);

    } if(findPartner) {
      const latestDraftingOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newDraftingNo = latestDraftingOrder
      ? latestDraftingOrder._id.job_no + 1
      : 1000;

      stepsInitial = 3;
      // Save the draftingData in the Drafting collection
      const draftingOrder = new Drafting(draftingData);
      draftingOrder._id = { job_no: newDraftingNo };
  
      // Ensure findPartner and findCustomer are not null before accessing their properties
      draftingOrder.partnerName = findPartner.first_name; // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      draftingOrder.customerName = findCustomer.first_name;// Assuming the customer's name is stored in the 'customerName' field of the Customer collection
  
      const savedDrafting = await draftingOrder.save();
  
      // Update partner and customer jobs lists
      findPartner.jobs.push(draftingOrder._id.job_no);
      findCustomer.jobs.push(draftingOrder._id.job_no);
  
      await Promise.all([findPartner.save(), findCustomer.save()]);
  
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);
  
      const newJobOrder = new JobOrder({
        _id: { job_no: newDraftingNo },
        service: "Patent Drafting",
        userID: userId,
        partnerID: findPartner.userID,
        partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
        customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
        country: req.body.country,
        start_date: startDate,
        end_date: endDate,
        steps_done: 1,
        steps_done_user: 1,
        steps_done_activity: 2,
        date_partner: [formattedDate, " ", " ", " "], 
        date_user: [formattedDate, " ", " ", " ", " ", " "],
        date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
        status: "In Progress",
        budget: req.body.budget,
        domain: req.body.field,
      });
  
      await newJobOrder.save();
  
      console.log("Successfully Assigned Patent Drafting Task to a Partner");

      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Patent Drafting Form has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Patent Drafting Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }

      // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Patent Drafting Form of ID " + newDraftingNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Patent Drafting Form of ID " + newDraftingNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }


      res.status(200).json(savedDrafting);

    }
  
        // Fetch user's email from MongoDB and send the email
        const user = await Customer.findOne({ userID: userId });
        const attachments = [];
        if (user && user.email) {
          const subject = 'Patent Drafting Submission Successful';
          const text = 'Your Patent Drafting form has been submitted successfully.';
          
          // Prepare the data for the table in the email
          const tableData = [
            { label: 'Service :', value: 'Patent Drafting' },
            { label: 'Customer Name :', value: findCustomer.first_name },
            {label:'Domain :',value:req.body.domain},
            {label:'Country :',value:req.body.country},
            {label:'Job Title :',value:req.body.job_title},
            {label:'Budget :',value:req.body.budget},
            {label:'Time Of Delivery :',value:req.body.time_of_delivery},
            // Add more rows as needed
          ];

          const { invention_details } = req.body.service_specific_files;
          
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
          
          // Send the email with tableData and attachments
          sendEmail(user.email, subject, text, tableData,attachments);
          if (findPartner){
            const partnerSubject="Request to accept the Patent Drafting Form"
            const partnerText="Accept the submission for Patent Drafting Form"
            sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments)
          }
          else{
            const partnerSubject="Request to accept the Patent Drafting Form"
            const partnerText="Assign the partner for Patent Drafting Form"
            sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
          }
          } 

  } catch (error) {
    console.error("Error creating Patent Drafting Order:", error);
    res.status(500).send("Error creating Patent Drafting Order");
  }
};
      


const createJobOrderPatentFiling = async (req, res) => {
  try {
    const userId = req.userId;
    const filingData = req.body;
    let stepsInitial = 0;
    console.log(filingData);
    filingData.userID = userId;



    // Find the partner and customer and update their jobs list
    let findPartner = await Partner.findOne({ is_free: true, ["known_fields.Patent Filing"]: true, country: req.body.country });
    let findCustomer = await Customer.findOne({ userID: userId });
    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})
    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }

    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedFilingOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedFilingNo = latestUnassignedFilingOrder
      ? latestUnassignedFilingOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newFilingData = filingData;
      newFilingData.service = "Patent Filing";
      newFilingData.customerName = findCustomer.first_name;
      newFilingData.status = "In Progress";
      console.log(newFilingData);
      const unassignedFilingOrder = new Unassigned(newFilingData);
      unassignedFilingOrder._id.job_no =  newUnassignedFilingNo ;
      
      unassignedFilingOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedFilingOrder);
    }

     if(findPartner) {
      const latestFilingOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newFilingNo = latestFilingOrder
      ? latestFilingOrder._id.job_no + 1
      : 1000;

    // Save the filingData in the Filing collection
    const filingOrder = new Filing(filingData);
    filingOrder._id = { job_no: newFilingNo };
    const savedFiling = await filingOrder.save();

    stepsInitial = 3;
    findPartner.jobs.push(filingOrder._id.job_no);
    findCustomer.jobs.push(filingOrder._id.job_no);

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newJobOrder = new JobOrder({
      _id: { job_no: newFilingNo },
      service: "Patent Filing",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      country: req.body.country,
      start_date: startDate,
      end_date: endDate,
      steps_done: 1,
      steps_done_user: 1,
      steps_done_activity: 2,
      date_partner: [formattedDate, " ", " ", " "], 
      date_user: [formattedDate, " ", " ", " ", " ", " "],
      date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
      status: "In Progress",
      budget: req.body.budget,
      domain: req.body.field,
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Patent Filing Task to a Partner");
      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Patent Filing Form has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Patent Filing Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }
  
// To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Patent Filing Form of ID " + newFilingNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Patent Filing Form of ID " + newFilingNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }

    

    res.status(200).json(savedFiling);

    }
    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
        if (user && user.email) {
          const subject = 'Patent Filing Submission Successful';
          const text = 'Your Patent Filing form has been submitted successfully.';
          
          // Prepare the data for the table in the email
          const tableData = [
            { label: 'Service :', value: 'Patent Filing' },
            { label: 'Customer Name :', value: findCustomer.first_name },
            {label:'Domain :',value:req.body.domain},
            {label:'Country :',value:req.body.country},
            {label:'Job Title :',value:req.body.job_title},
            {label:'Application Type :',value:req.body.service_specific_files.application_type},
            {label:'Budget :',value:req.body.budget},
            {label:'Time Of Delivery :',value:req.body.time_of_delivery},
            // Add more rows as needed
          ];

          const { details,applicants,investors } = req.body.service_specific_files;
          
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
          
          // Send the email with tableData and attachments
          sendEmail(user.email, subject, text, tableData,attachments);
    if (findPartner){
      const partnerSubject="Request to accept the Patent Filing Form"
      const partnerText="Accept the submission for Patent Filing Form"
      sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
    else{
      const partnerSubject="Request to accept the Patent Filing Form"
      const partnerText="Assign the partner for Patent Filing Form"
      sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
    }
  }

    
  } catch (error) {
    console.error("Error creating Patent Filing Order:", error);
    res.status(500).send("Error creating Patent Filing Order");
  }
};



const savePatentSearchData = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const searchData = req.body;
    searchData.userID = userId;

    let findPartner = await Partner.findOne({ is_free: true, ["known_fields.Patent Search"]: true, country: req.body.country, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });
    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})


    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    
    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedSearchOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedSearchNo = latestUnassignedSearchOrder
      ? latestUnassignedSearchOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newSearchData = searchData;
      newSearchData.service = "Patent Search";
      newSearchData.customerName = findCustomer.first_name;
      newSearchData.budget = "To be Allocated";
      newSearchData.status = "In Progress";
      console.log(newSearchData);
      const unassignedSearchOrder = new Unassigned(newSearchData);
      unassignedSearchOrder._id.job_no =  newUnassignedSearchNo ;
      
      unassignedSearchOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedSearchOrder);
    } 
    if(findPartner) {
      const latestSearchOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newSearchNo = latestSearchOrder
      ? latestSearchOrder._id.job_no + 1
      : 1000;

    const searchOrder = new Search(searchData);
    searchOrder._id = { job_no: newSearchNo };
    const savedSearch = await searchOrder.save();
      stepsInitial = 3;
    findPartner.jobs.push(searchOrder._id.job_no);
    findCustomer.jobs.push(searchOrder._id.job_no);

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newJobOrder = new JobOrder({
      _id: { job_no: newSearchNo },
      service: "Patent Search",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      start_date: new Date(),
      end_date: endDate,
      steps_done: 1,
      steps_done_user: 1,
      steps_done_activity: 2,
      date_partner: [formattedDate, " ", " ", " "], 
      date_user: [formattedDate, " ", " ", " ", " ", " "],
      date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
      budget: "To be Allocated",
      status: "In Progress",
      country: req.body.country,
      domain: req.body.field,
    });

    await newJobOrder.save();

      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Patent Search Form has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Patent Search Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }

      // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Patent Search Form of ID " + newSearchNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Patent Search Form of ID " + newSearchNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }

    console.log("Successfully Assigned Patent Search Task to a Partner");
    res.status(200).json(savedSearch);

    }
    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
        if (user && user.email) {
          const subject = 'Patent Search Submission Successful';
          const text = 'Your Patent Search form has been submitted successfully.';
          
          // Prepare the data for the table in the email
          const tableData = [
            { label: 'Service :', value: 'Patent Search' },
            { label: 'Customer Name :', value: findCustomer.first_name },
            {label:'Domain :',value:req.body.field},
            {label:'Country :',value:req.body.country},
            {label:'Invention Description :',value:req.body.invention_description},
            // Add more rows as needed
          ];
         const fileData=req.body.technical_diagram
          
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
          
          // Send the email with tableData and attachments
          sendEmail(user.email, subject, text, tableData,attachments);
          if (findPartner){
            const partnerSubject="Request to accept the Patent Search Form"
            const partnerText="Accept the submission for Patent Search Form"
            sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
          }
          else{
            const partnerSubject="Request to accept the Patent Search Form"
            const partnerText="Assign the partner for Patent Search Form"
            sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
          }
        }
  } catch (error) {
    console.error("Error creating Search Order:", error);
    res.status(500).send("Error creating Search Order");
  }
};


const saveResponseToFerData = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const responseToFerData = req.body;
    console.log(responseToFerData);
    responseToFerData.userID = userId;


    let findPartner = await Partner.findOne({ is_free: true, ["known_fields.Response to FER Office Action"]: true, country: req.body.country, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });
    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})


    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedFEROrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedFERNo = latestUnassignedFEROrder
      ? latestUnassignedFEROrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newFERData = responseToFerData;
      newFERData.service = "Response to FER Office Action";
      newFERData.customerName = findCustomer.first_name;
      newFERData.budget = "To be Allocated";
      newFERData.status = "In Progress";
      console.log(newFERData);
      const unassignedFEROrder = new Unassigned(newFERData);
      unassignedFEROrder._id.job_no =  newUnassignedFERNo ;
      
      unassignedFEROrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedFEROrder);
    }

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }

    if(findPartner) {
      const latestResponseToFerOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newResponseToFerNo = latestResponseToFerOrder
      ? latestResponseToFerOrder._id.job_no + 1
      : 1000;

    const responseToFerOrder = new responseToFer(responseToFerData);
    responseToFerOrder._id = { job_no: newResponseToFerNo };
    const savedResponseToFer = await responseToFerOrder.save();

    stepsInitial = 3;
    findPartner.jobs.push(responseToFerOrder._id.job_no);
    findCustomer.jobs.push(responseToFerOrder._id.job_no);

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newJobOrder = new JobOrder({
      _id: { job_no: newResponseToFerNo },
      service: "Response To FER Office Action",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      country: req.body.country,
      start_date: new Date(),
      end_date: endDate,
      steps_done: 1,
      steps_done_user: 1,
      steps_done_activity: 2,
      date_partner: [formattedDate, " ", " ", " "], 
      date_user: [formattedDate, " ", " ", " ", " ", " "],
      date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
      status: "In Progress",
      budget: "To be Allocated",
      domain: req.body.field,
    });

    await newJobOrder.save();
      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Response To FER/Office Action has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Response To FER/Office Action Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }

      // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Response To FER Form of ID " + newResponseToFerNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Response To FER Form of ID " + newResponseToFerNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }

    console.log("Successfully Assigned Response to FER Task to a Partner");
    res.status(200).json(savedResponseToFer);

    }
    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
    if (user && user.email) {
      const subject = 'Response To FER Office Action Submission Successful';
      const text = 'Your Response To FER Office Action form has been submitted successfully.';
      
      // Prepare the data for the table in the email
      const tableData = [
        { label: 'Service :', value: 'Response To FER Office Action' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:req.body.field},
        {label:'Country :',value:req.body.country},
        {label:'Response Strategy :',value:req.body.response_strategy},

        // Add more rows as needed
      ];

      const ferFileData=req.body.fer
      const completeSpecificationsFileData=req.body.complete_specifications
      
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
      
      // Send the email with tableData and attachments
      sendEmail(user.email, subject, text, tableData,attachments);
      if (findPartner){
        const partnerSubject="Request to accept the Response To FER Office Action Form"
        const partnerText="Accept the submission for Response To FER Office Action Form"
        sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
      }
      else{
        const partnerSubject="Request to accept the Response To FER Office Action Form"
        const partnerText="Assign the partner for Response To FER Office Action Form"
        sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
      }
    }
 


    
  } catch (error) {
    console.error("Error creating Response To FER Order:", error);
    res.status(500).send("Error creating Response To FER Order");
  }
};


const saveFreedomToOperateData = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const freedomToOperateData = req.body;
    freedomToOperateData.userID = userId;

    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Freedom To Operate"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });
    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})


    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedFTOOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedFTONo = latestUnassignedFTOOrder
      ? latestUnassignedFTOOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newFTOData = freedomToOperateData;
      newFTOData.service = "Freedom To Operate";
      newFTOData.customerName = findCustomer.first_name;
      newFTOData.budget = "To be Allocated";
      newFTOData.status = "In Progress";
      console.log(newFTOData);
      const unassignedFTOOrder = new Unassigned(newFTOData);
      unassignedFTOOrder._id.job_no =  newUnassignedFTONo ;
      
      unassignedFTOOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedFTOOrder);

    } 
    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }

    if(findPartner) {
      const latestFTOOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newFTONo = latestFTOOrder ? latestFTOOrder._id.job_no + 1 : 1000;
      freedomToOperateData._id = { job_no: newFTONo };

      const savedFTO = await freedomToOperate.create(freedomToOperateData);
      stepsInitial = 3;
      findPartner.jobs.push(freedomToOperateData._id.job_no);
      findCustomer.jobs.push(freedomToOperateData._id.job_no);
  
      await Promise.all([findPartner.save(), findCustomer.save()]);
  
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString(undefined, options);
  
      const newJobOrder = new JobOrder({
        _id: { job_no: newFTONo },
        service: "Freedom To Operate",
        userID: userId,
        partnerID: findPartner.userID,
        partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
        customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
        country: req.body.country,
        start_date: new Date(),
        end_date: endDate,
        steps_done: 1,
        steps_done_user: 1,
        steps_done_activity: 2,
        date_partner: [formattedDate, " ", " ", " "], 
        date_user: [formattedDate, " ", " ", " ", " ", " "],
        date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
        status: "In Progress",
        budget: "To be Allocated",
        domain: req.body.field,
      });
  
      await newJobOrder.save();
        // To send notification to User
        const notificationHub = await Notification.findOne({user_Id: userId});
        if (!notificationHub) {
          const newNotificationDoc = new Notification({
            user_Id: userId,
            notifications: [
              {
                notifNum: 1,
                notifText: "Your Freedom To Operate Search Form has been submitted successfully",
                notifDate: formattedDate,
                seen: false,
              }
            ]
          })
          newNotificationDoc.save().then(() => {
            console.log("Notification sent Successfully");
          }).catch((err) => {
            console.error("Error in sending Notification : " + err);
          })
        } else {
          const newNotification = {
            notifNum: notificationHub.notifications.length + 1,
            notifText: "Your Freedom To Operate Search Form has been submitted successfully",
            notifDate: formattedDate,
            seen: false,
          }
          notificationHub.notifications.push(newNotification);
          notificationHub.save().then(() => {
            console.log("Notification sent Successfully");
          }).catch((err) => {
            console.error("Error in sending Notification : " + err);
          });
  
        }

        // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Freedom To Operate Search Form of ID " + newFTONo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Freedom To Operate Search Form of ID " + newFTONo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }
  
      console.log("Successfully Assigned Freedom To Operate Task to a Partner");
  
      res.status(200).send(savedFTO._id);

    }
    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
    if (user && user.email) {
      const subject = 'Freedom To Operate Search Submission Successful';
      const text = 'Your Freedom To Operate Search form has been submitted successfully.';
      
      // Prepare the data for the table in the email
      const tableData = [
        { label: 'Service :', value: 'Freedom To Operate Search' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:req.body.field},
        {label:'Country :',value:req.body.country},
        // Add more rows as needed
      ];

      const inventionDescriptionFile=req.body.invention_description
      const patentApplicationFile=req.body.patent_application_details
      
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
      
      // Send the email with tableData and attachments
      sendEmail(user.email, subject, text, tableData,attachments);
      if (findPartner){
    
        const partnerSubject="Request to accept the Freedom To Operate Search Form"
        const partnerText="Accept the submission for Freedom To Operate Search Form"
        sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
      }
      else{
        const partnerSubject="Request to accept the Freedom To Operate Search Form"
        const partnerText="Assign the partner for Freedom To Operate Search Form"
        sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
      }

    }

  } catch (error) {
    console.error("Error creating Freedom To Operate:", error);
    res.status(500).send("Error creating Freedom to Operate");
  }
};





const savePatentIllustrationData = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const illustrationData = req.body;
    illustrationData.userID = userId;



    let findPartner = await Partner.findOne({ is_free: true, ["known_fields.Patent Illustration"]: true, country: req.body.country, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });
    
  const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})


    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedPatentIllustrationOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedPatentIllustrationNo = latestUnassignedPatentIllustrationOrder
      ? latestUnassignedPatentIllustrationOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newPatentIllustrationData = illustrationData;
      newPatentIllustrationData.service = "Patent Illustration";
      newPatentIllustrationData.customerName = findCustomer.first_name;
      newPatentIllustrationData.budget = "To be Allocated";
      newPatentIllustrationData.status = "In Progress";
      console.log(newPatentIllustrationData);
      const unassignedPatentIllustrationOrder = new Unassigned(newPatentIllustrationData);
      unassignedPatentIllustrationOrder._id.job_no =  newUnassignedPatentIllustrationNo ;
      
      unassignedPatentIllustrationOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedPatentIllustrationOrder);

    }

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    } if(findPartner) {
      const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    illustrationData._id = { job_no: newJobNo };

    const savedJobOrder = new patentIllustration(illustrationData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentIllustration = await savedJobOrder.save();

    stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Illustration",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      steps_done: 1,
      steps_done_user: 1,
      steps_done_activity: 2,
      date_partner: [formattedDate, " ", " ", " "], 
      date_user: [formattedDate, " ", " ", " ", " ", " "],
      date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Patent Illustration Form has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Patent Illustration Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }

      // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Patent Illustration Form of ID " + newJobNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Patent Illustration Form of ID " + newJobNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }


    console.log("Successfully Assigned Patent Illustration to a Partner");

    res.status(200).json(savedJobOrder._id);

    }

    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
    if (user && user.email) {
      const subject = 'Patent Illustration Submission Successful';
      const text = 'Your Patent Illustration form has been submitted successfully.';
      
      // Prepare the data for the table in the email
      const tableData = [
        { label: 'Service :', value: 'Patent Illustration' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:req.body.field},
        {label:'Country :',value:req.body.country},
        {label:'Patent Specifications :',value:req.body.patent_specifications},
        {label:'Drawing Requirements :',value:req.body.drawing_requirements},
        // Add more rows as needed
      ];

      const preferredStyleFile=req.body.preferred_style
    
      
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
      
      // Send the email with tableData and attachments
      sendEmail(user.email, subject, text, tableData,attachments);
    if (findPartner){
      const partnerSubject="Request to accept the Patent Illustration Form"
      const partnerText="Accept the submission for Patent Illustration Form"
      sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
    else{
      const partnerSubject="Request to accept the PPatent Illustration Form"
      const partnerText="Assign the partner for Patent Illustration Form"
      sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
    }
  }
    
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};


const savePatentLandscapeData = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const patentLandscapeData = req.body;
    patentLandscapeData.userID = userId;


    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Freedom to Patent Landscape"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });
    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})


    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }

    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedPatentLandscapeOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedPatentLandscapeNo = latestUnassignedPatentLandscapeOrder
      ? latestUnassignedPatentLandscapeOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newPatentLandscapeData = patentLandscapeData;
      newPatentLandscapeData.service = "Freedom to Patent Landscape";
      newPatentLandscapeData.customerName = findCustomer.first_name;
      newPatentLandscapeData.budget = "To be Allocated";
      newPatentLandscapeData.status = "In Progress";
      console.log(newPatentLandscapeData);
      const unassignedPatentLandscapeOrder = new Unassigned(newPatentLandscapeData);
      unassignedPatentLandscapeOrder._id.job_no =  newUnassignedPatentLandscapeNo ;
      
      unassignedPatentLandscapeOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedPatentLandscapeOrder);

    }

     if(findPartner) {
      const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentLandscapeData._id = { job_no: newJobNo };

    const savedJobOrder = new patentLandscape(patentLandscapeData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentLandscape = await savedJobOrder.save();

      stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Freedom to Patent Landscape",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      steps_done: 1,
      steps_done_user: 1,
      steps_done_activity: 2,
      date_partner: [formattedDate, " ", " ", " "], 
      date_user: [formattedDate, " ", " ", " ", " ", " "],
      date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Freedom To Patent Landscape Form has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Freedom To Patent Landscape Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }

      // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Freedom To Patent Landscape Form of ID " + newJobNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Freedom To Patent Landscape Form of ID " + newJobNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }


    console.log("Successfully Assigned Patent Landscape to a Partner");

    res.status(200).json(savedJobOrder._id);

    }


    
    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
    if (user && user.email) {
      const subject = 'Freedom to Patent Landscape Submission Successful';
      const text = 'Your Freedom to Patent Landscape form has been submitted successfully.';
      
      // Prepare the data for the table in the email
      const tableData = [
        { label: 'Service :', value: 'Freedom to Patent Landscape' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:req.body.field},
        {label:'Country :',value:req.body.country},
        {label:'Technology Description :',value:req.body.technology_description},
        {label:'Competitor Information :',value:req.body.competitor_information},
        
      ];
      
      // Send the email with tableData and attachments
      sendEmail(user.email, subject, text, tableData,attachments);
    if (findPartner){
      const partnerSubject="Request to accept the Freedom to Patent Landscape Form"
      const partnerText="Accept the submission for Freedom to Patent Landscape Form"
      sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
    else{
      const partnerSubject="Request to accept the Freedom to Patent Landscape Form"
      const partnerText="Assign the partner for Freedom to Patent Landscape Form"
      sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
    }
  }
    
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

const savePatentWatchData = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const patentWatchData = req.body;
    patentWatchData.userID = userId;


    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Patent Watch"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });
    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }

    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedPatentWatchOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedPatentWatchNo = latestUnassignedPatentWatchOrder
      ? latestUnassignedPatentWatchOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newPatentWatchData = patentWatchData;
      newPatentWatchData.service = "Patent Watch";
      newPatentWatchData.customerName = findCustomer.first_name;
      newPatentWatchData.budget = "To be Allocated";
      newPatentWatchData.status = "In Progress";
      console.log(newPatentWatchData);
      const unassignedPatentWatchOrder = new Unassigned(newPatentWatchData);
      unassignedPatentWatchOrder._id.job_no =  newUnassignedPatentWatchNo ;
      
      unassignedPatentWatchOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedPatentWatchOrder);
    }

    if (findPartner) {

      const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

      const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
      patentWatchData._id = { job_no: newJobNo };
  
      const savedJobOrder = new patentWatch(patentWatchData);
      savedJobOrder._id = { job_no: newJobNo };
      const savedPatentWatch = await savedJobOrder.save();

      stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Watch",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      steps_done: 1,
      steps_done_user: 1,
      steps_done_activity: 2,
      date_partner: [formattedDate, " ", " ", " "], 
      date_user: [formattedDate, " ", " ", " ", " ", " "],
      date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Patent Watch Form has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Patent Watch Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }

      // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Patent Watc Form of ID " + newJobNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Patent Watch Form of ID " + newJobNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }


    console.log("Successfully Assigned Patent Watch to a Partner");

    res.status(200).json(savedJobOrder._id);

    }

    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
    if (user && user.email) {
      const subject = 'Patent Watch Submission Successful';
      const text = 'Your Patent Watch form has been submitted successfully.';
      
      // Prepare the data for the table in the email
      const tableData = [
        { label: 'Service :', value: 'Patent Watch' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:req.body.field},
        {label:'Country :',value:req.body.country},
        {label:'Technology or Industry Focus :',value:req.body.industry_focus},
        {label:'Competitor Information :',value:req.body.competitor_information},
        {label:'Geographic Scope :',value:req.body.geographic_scope},
        {label:'Monitoring Duration :',value:req.body.monitoring_duration},
        // Add more rows as needed
      ];
      // Send the email with tableData and attachments
      sendEmail(user.email, subject, text, tableData,attachments);
    if (findPartner){
      const partnerSubject="Request to accept the Patent Watch Form"
      const partnerText="Accept the submission for Patent Watch Form"
      sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
    else{
      const partnerSubject="Request to accept the Patent Watch Form"
      const partnerText="Assign the partner for Patent Watch Form"
      sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
    }

  }

    
    
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

const savePatentLicenseData = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const patentLicenseData = req.body;
    patentLicenseData.userID = userId;


    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Patent Licensing and Commercialization Services"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });

    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }

    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedPatentLicenseOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedPatentLicenseNo = latestUnassignedPatentLicenseOrder
      ? latestUnassignedPatentLicenseOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newPatentLicenseData = patentLicenseData;
      newPatentLicenseData.service = "Patent Licensing and Commercialization Services";
      newPatentLicenseData.customerName = findCustomer.first_name;
      newPatentLicenseData.budget = "To be Allocated";
      newPatentLicenseData.status = "In Progress";
      console.log(newPatentLicenseData);
      const unassignedPatentLicenseOrder = new Unassigned(newPatentLicenseData);
      unassignedPatentLicenseOrder._id.job_no =  newUnassignedPatentLicenseNo ;
      
      unassignedPatentLicenseOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedPatentLicenseOrder);
    }

    if(findPartner) {
      const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentLicenseData._id = { job_no: newJobNo };

    const savedJobOrder = new patentLicense(patentLicenseData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentLicense = await savedJobOrder.save();

    stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Licensing and Commercialization Services",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      steps_done: 1,
      steps_done_user: 1,
      steps_done_activity: 2,
      date_partner: [formattedDate, " ", " ", " "], 
      date_user: [formattedDate, " ", " ", " ", " ", " "],
      date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Patent Licensing and Commercialization Form has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Patent Licensing and Commercialization Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }

      // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Patent Licensing and Commercialization Form of ID " + newJobNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Patent Licensing and Commercialization Form of ID " + newJobNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }


    console.log("Successfully Assigned Patent Licensing and Commercialization Services Task to a Partner");

    res.status(200).json(savedJobOrder._id);
    }

    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
    if (user && user.email) {
      const subject = 'Patent Licensing and Commercialization Services Submission Successful';
      const text = 'Your Patent Licensing and Commercialization Services form has been submitted successfully.';
      
      // Prepare the data for the table in the email
      const tableData = [
        { label: 'Service :', value: 'Patent Licensing and Commercialization Services' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:req.body.field},
        {label:'Country :',value:req.body.country},
        {label:'Patent Information :',value:req.body.patent_information},
        {label:'Commercialization Goals :',value:req.body.commercialization_goals},
        {label:'Competitive Landscape :',value:req.body.competitive_landscape},
        {label:'Technology Description :',value:req.body.technology_description},
        // Add more rows as needed
      ];
      // Send the email with tableData and attachments
      sendEmail(user.email, subject, text, tableData,attachments);
    if (findPartner){
      const partnerSubject="Request to accept the Patent Licensing and Commercialization Services Form"
      const partnerText="Accept the submission for Patent Licensing and Commercialization Services Form"
      sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
    else{
      const partnerSubject="Request to accept the Patent Licensing and Commercialization Services Form"
      const partnerText="Assign the partner for Patent Licensing and Commercialization Services Form"
      sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
    }


  }



    
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};


const savePatentPortfolioAnalysisData = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const patentPortfolioData = req.body;
    patentPortfolioData.userID = userId;

    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Patent Portfolio Analysis"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });
    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})


    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    
    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedPatentPortfolioOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedPatentPortfolioNo = latestUnassignedPatentPortfolioOrder
      ? latestUnassignedPatentPortfolioOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newPatentPortfolioData = patentPortfolioData;
      newPatentPortfolioData.service = "Patent Portfolio Analysis";
      newPatentPortfolioData.customerName = findCustomer.first_name;
      newPatentPortfolioData.budget = "To be Allocated";
      newPatentPortfolioData.status = "In Progress";
      console.log(newPatentPortfolioData);
      const unassignedPatentPortfolioOrder = new Unassigned(newPatentPortfolioData);
      unassignedPatentPortfolioOrder._id.job_no =  newUnassignedPatentPortfolioNo ;
      
      unassignedPatentPortfolioOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedPatentPortfolioOrder);
    }

    if(findPartner) {
      const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentPortfolioData._id = { job_no: newJobNo };

    const savedJobOrder = new patentPortfolioAnalysis(patentPortfolioData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentPortfolio = await savedJobOrder.save();

      stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Portfolio Analysis",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      steps_done: 1,
      steps_done_user: 1,
      steps_done_activity: 2,
      date_partner: [formattedDate, " ", " ", " "], 
      date_user: [formattedDate, " ", " ", " ", " ", " "],
      date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Patent Portfolio Analysis Form has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Patent Portfolio Analysis Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }
    
      // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Patent Portfolio Analysis Form of ID " + newJobNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Patent Portfolio Analysis Form of ID " + newJobNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }


    console.log("Successfully Assigned Patent Portfolio Analysis Task to a Partner");

    res.status(200).json(savedJobOrder._id);

    }

    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
    if (user && user.email) {
      const subject = 'Freedom To Patent Portfolio Analysis Submission Successful';
      const text = 'Your Freedom To Patent Portfolio Analysis form has been submitted successfully.';
      
      // Prepare the data for the table in the email
      const tableData = [
        { label: 'Service :', value: 'Freedom To Patent Portfolio Analysis' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:req.body.domain},
        {label:'Country :',value:req.body.country},
        {label:'Business Objectives :',value:req.body.business_objectives},
        {label:'Market and Industry Information :',value:req.body.market_and_industry_information},
        // Add more rows as needed
      ];

      const {invention_details}=req.body.service_specific_files
    
      
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
      
      // Send the email with tableData and attachments
      sendEmail(user.email, subject, text, tableData,attachments);
    if (findPartner){
      const partnerSubject="Request to accept the Freedom To Patent Portfolio Analysis Form"
      const partnerText="Accept the submission for Freedom To Patent Portfolio Analysis Form"
      sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
    else{
      const partnerSubject="Request to accept the Freedom To Patent Portfolio Analysis Form"
      const partnerText="Assign the partner for Freedom To Patent Portfolio Analysis Form"
      sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
    }

  }


    
    
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};


const savePatentTranslationData = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.userId;
    let stepsInitial = 0;
    const patentTranslationData = req.body;
    patentTranslationData.userID = userId;


    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Patent Translation Services"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });
    const findAdmin=await Admin.findOne({_id:"64803aa4b57edc54d6b276cb"})

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    
    if (!findPartner) {
      // Handle the case when no partner is found
      const latestUnassignedPatentTranslationOrder = await Unassigned.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newUnassignedPatentTranslationNo = latestUnassignedPatentTranslationOrder
      ? latestUnassignedPatentTranslationOrder._id.job_no + 1
      : 1000;


      stepsInitial = 2;
      const newPatentTranslationData = patentTranslationData;
      newPatentTranslationData.service = "Patent Translation Services";
      newPatentTranslationData.customerName = findCustomer.first_name;
      newPatentTranslationData.budget = "To be Allocated";
      newPatentTranslationData.status = "In Progress";
      console.log(newPatentTranslationData);
      const unassignedPatentTranslationOrder = new Unassigned(newPatentTranslationData);
      unassignedPatentTranslationOrder._id.job_no =  newUnassignedPatentTranslationNo ;
      
      unassignedPatentTranslationOrder.save();
      
      console.log("No Partner found. Therefore, Sending it to Unassigned Tasks");
      res.status(200).json(unassignedPatentTranslationOrder);
    }

    if(findPartner) {
      const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentTranslationData._id = { job_no: newJobNo };

    const savedJobOrder = new patentTranslation(patentTranslationData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentTranslation = await savedJobOrder.save();

    stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString(undefined, options);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Translation Services",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      steps_done: 1,
      steps_done_user: 1,
      steps_done_activity: 2,
      date_partner: [formattedDate, " ", " ", " "], 
      date_user: [formattedDate, " ", " ", " ", " ", " "],
      date_activity: [formattedDate, formattedDate, " ", " ", " ", " ", " ", " ", " ", " "],
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

      // To send notification to User
      const notificationHub = await Notification.findOne({user_Id: userId});
      if (!notificationHub) {
        const newNotificationDoc = new Notification({
          user_Id: userId,
          notifications: [
            {
              notifNum: 1,
              notifText: "Your Patent Translation Services Form has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotification = {
          notifNum: notificationHub.notifications.length + 1,
          notifText: "Your Patent Translation Services Form has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationHub.notifications.push(newNotification);
        notificationHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });

      }

      // To send Notification to Admin
      const notificationAdminHub = await NotificationAdmin.findOne({admin_Id: 1});
      if (!notificationAdminHub) {
        const newNotificationAdminDoc = new NotificationAdmin({
          admin_Id: 1,
          notifications: [
            {
              notifNum: 1,
              notifText: "Patent Translation Services Form of ID " + newJobNo +" has been submitted successfully",
              notifDate: formattedDate,
              seen: false,
            }
          ]
        })
        newNotificationAdminDoc.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        })
      } else {
        const newNotificationAdmin = {
          notifNum: notificationAdminHub.notifications.length + 1,
          notifText: "Patent Translation Services Form of ID " + newJobNo +" has been submitted successfully",
          notifDate: formattedDate,
          seen: false,
        }
        notificationAdminHub.notifications.push(newNotificationAdmin);
        notificationAdminHub.save().then(() => {
          console.log("Notification sent Successfully");
        }).catch((err) => {
          console.error("Error in sending Notification : " + err);
        });
      }


    console.log("Successfully Assigned Patent Translation Services Task to a Partner");

    res.status(200).json(savedJobOrder._id);

    }

    const user = await Customer.findOne({ userID: userId });
    const attachments = [];
    if (user && user.email) {
      const subject = 'Patent Translation Services Analysis Submission Successful';
      const text = 'Your Patent Translation Services form has been submitted successfully.';
      
      // Prepare the data for the table in the email
      const tableData = [
        { label: 'Service :', value: 'Patent Translation Services' },
        { label: 'Customer Name :', value: findCustomer.first_name },
        {label:'Domain :',value:req.body.domain},
        {label:'Country :',value:req.body.country},
        {label:'Source Language :',value:req.body.source_language},
        {label:'Target Language :',value:req.body.target_language},
        {label:'Additional Instructions :',value:req.body.additional_instructions}
      ];

      const fileData=req.body.document_details
    
      
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
      
      // Send the email with tableData and attachments
      sendEmail(user.email, subject, text, tableData,attachments);
    if (findPartner){
      const partnerSubject="Request to accept the Patent Translation Services Form"
      const partnerText="Accept the submission for Patent Translation Services Form"
      sendEmail(findPartner.email,partnerSubject,partnerText,tableData,attachments);
    }
    else{
      const partnerSubject="Request to accept the Patent Translation Services Form"
      const partnerText="Assign the partner for Patent Translation Services Form"
      sendEmail(findAdmin.email,partnerSubject,partnerText,tableData,attachments)
    }


  }
    
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};


// Fetch Partner's Work Files for User
const getJobFilesDetailsForUsers = async(req, res) => {
  const jobID = req.params.jobID;
  try{
    const jobFile = await JobFiles.findOne({"_id.job_no": jobID});
    if(!jobFile) {
      console.log("No Job Files Present under Job No " + jobID);
    } else {
      res.json(jobFile);
    }

  } catch(error) {
      console.error("Error in fetching Job Details File.", error);
  }
}

const getJobFilesForUsers = async (req, res) => {
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
        const inventionDetails = jobFile.job_files[totalFiles];
      // Check if base64 data is present
        if (!inventionDetails.base64) {
          return res.status(404).json({ error: "File not found" });
        }

        const { base64, name, type } = inventionDetails;
        fileDataList.push(base64);
        fileNameList.push("Finished_Job_Files_" + (totalFiles+1) + '.' + name.split(".")[1]) ;
        fileMIMEList.push(type);
      }
      res.json({ fileData: fileDataList, fileName: fileNameList, fileMIME: fileMIMEList });
    }
  } catch(err) {
    console.error("Job File Not Found", err);
  }
}

const approveTheDoneWork = async(req, res) => {
  const jobID = req.params.jobID;
  const updatedData = req.body; // Getting the data sent through PUT request
  try {
    // Updating the Job Order Status
    const job = await JobOrder.findOne({"_id.job_no": parseInt(jobID)});
    if(!job) {
      console.error("No Job found under Job Number " + jobID);
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const done_activity = [7, 8, 9];
    job.status = req.body.status;
    job.steps_done = req.body.steps;
    job.steps_done_user = req.body.user_steps;
    job.steps_done_activity = req.body.activity;
    const formattedDate = new Date().toLocaleDateString(undefined, options);
    done_activity.map((elem) => {
      job.date_activity[elem]  = formattedDate;
    });
    job.date_partner[3] = formattedDate;
    job.date_user[5] = formattedDate;

    job.save()
    .then((response) => {
      console.log("User's Approval Completed Successfully");
    }).catch((error) => {
      console.error("Error in accepting User's Approval: " + error);
    });
    
    // Updating Job Files Status
    const jobFile = await JobFiles.findOne({"_id.job_no": jobID});
    if(!jobFile) {
      console.error("No Job Files present for Job No : "+ jobID);
    }
    jobFile.verification = req.body.verif;
    jobFile.approval_given = true;
    jobFile.user_decided = true;
    jobFile.save().then((response)=>{
      console.log("Work status Updated for the Partner Successfully");
    }).catch((error)=> {
      console.error("Error in Updating Partner's Work Status: ", error);
    });

    // Updating Partner's In Progress Job Count
    const workedPartner = await Partner.findOne({jobs: {$in: [parseInt(jobID)] }});
    if(!workedPartner) {
      console.error("Error in finding the Partner.")
    }
    workedPartner.in_progress_jobs = workedPartner.in_progress_jobs - 1;
    workedPartner.is_free = true;
    workedPartner.save().then((response) => {
      console.log("Partner's In Progress Job Count successfully Updated");
    }).catch((error) => {
      console.error("Error in updating Partner's In Progress Job Count: ", error);
    })      
    res.redirect("back");

    // Sending Notification to Users that File is ready to download
    const finalizeNotification = await Notification.findOne({user_Id: job.userID});
    if(!finalizeNotification) {
      const thatFinalNotification = new Notification({
        user_Id: job.userID,
        notifications: [
          {
            notifNum: 1,
            notifText: "Job " + jobID + " has been delivered Successfully and is ready to Download.",
            notifDate: formattedDate,
            seen: false,
          }
        ]
      })
      thatFinalNotification.save().then(() => {
        console.log("Notifications sent Successfully.");
      }).catch((error) => {
        console.error("Error in sending the Notification : " + error );
      })
    } else {
      const finalNotifDoc = {
        notifNum: finalizeNotification.notifications.length + 1,
        notifText: "Job " + jobID + " has been delivered Successfully and is ready to Download.",
        notifDate: formattedDate,
        seen: false,
      }
      finalizeNotification.notifications.push(finalNotifDoc);
      finalizeNotification.save().then(() => {
        console.log("Notification sent Successfully.");
      }).catch((err) => {
        console.error("Error in sending the Notification : " + err)
      });
    }

  } catch(error) {
    console.error("Error in finding the Job: "+ error);
  }

}

const rejectTheDoneWork = async(req, res) => {
  const jobID = req.params.jobID;
  const updatedData = req.body;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    // Updating the Job Order Status
    const job = await JobOrder.findOne({"_id.job_no": parseInt(jobID)});
    if(!job) {
      console.error("No Job found under Job Number " + jobID);
    }
    job.status = req.body.status;
    job.steps_done = req.body.steps;
    job.steps_done_user = req.body.user_steps;
    job.steps_done_activity = req.body.activity;

    job.date_partner[3] = " ";
    
    job.date_activity[3] = new Date().toLocaleDateString(undefined, options);
    for(let remSteps=4; remSteps<10; remSteps++) {
      job.date_activity[remSteps] = " "
    }
    job.date_user[2] = new Date().toLocaleDateString(undefined, options);
    for(let remSteps=3; remSteps<6; remSteps++) {
      job.date_user[remSteps] = " ";
    }
    job.save()
    .then((response) => {
      console.log("User's Rejection Completed Successfully");
    }).catch((error) => {
      console.error("Error in accepting User's Rejection: " + error);
    });
    
    // Updating Job Files Status
    const jobFile = await JobFiles.findOne({"_id.job_no": jobID});
    if(!jobFile) {
      console.error("No Job Files present for Job No : "+ jobID);
    }
    jobFile.verification = req.body.verif;
    jobFile.decided = false;
    jobFile.access_provided = false;
    jobFile.user_decided = true;
    jobFile.job_files = {};
    jobFile.save().then((response)=>{
      console.log("Work status Updated for the Partner Successfully");
    }).catch((error)=> {
      console.error("Error in Updating Partner's Work Status: ", error);
    });

  } catch(error) {
    console.error("Error in finding the Job: "+ error);
  }
}

const getNotification = async(req, res) => {
  const customerID = req.params.userID;
  console.log(customerID);
  const thatCustomerNotifs = await Notification.findOne({user_Id: Number(customerID)});
  if(!thatCustomerNotifs) {
    console.error("Notifications for Customer ID " + customerID + " not exists.");
  } else {
    res.json(thatCustomerNotifs.notifications);
  }
}

const notificationSeen = async(req, res) => {
  const notificID = req.params.userID;
  const customerID = req.params.notifId;

  console.log(customerID, notificID);
  const thatCustomerNotifs = await Notification.findOne({user_Id: Number(customerID)});
  console.log(thatCustomerNotifs);
  if(!thatCustomerNotifs) {
    console.error("That Notification doesn't exists.");
  } else {
    thatCustomerNotifs.notifications[parseInt(notificID) - 1].seen = true;
    thatCustomerNotifs.save().then(() => {
      console.log("Notification Seen");
    }).catch((error) => {
      console.error('Error in seeing the Notification : ' + error);
    })
  }
}

const notifcationsDelete = async(req, res) => {
  const userID = req.params.userID;
  const listOfNotifDeleted = req.body.deletedNotifs;

  try {
    const findNotification = await Notification.findOne({user_Id: Number(userID)});
    if(!findNotification) {
      console.log("No Notifications available for User ID " + userID);
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

const sortNotifications = async(req, res) => {
  const userID = req.params.userID;
  const interval = req.params.days;

  const today = new Date();
  const totalNotifs = await Notification.findOne({user_Id: Number(userID)});
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

const clearRecentNotifs = async(req, res) => {
  const userID = req.params.userID;

  try {
    const allNotifications = await Notification.findOne({user_Id: Number(userID)});
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
        console.error('Error in Clearin out Recent Notifications : ' + err)
      })
    }
  } catch(error) {
    console.error("Error in Clearing out Recent Notifications : " + error);
  }
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
                bulkOrderTitle: result[0].Job_Title,
                bulkOrderService: result[0].Service});
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const createBulkOrders = async(req, res) => {
  try {
    const automatedJobs = req.body.bulkJobs;
    const automatedTitles = req.body.bulkTitles;
    const automatedServices = req.body.bulkServices;
    const automatedFiles = req.body.bulkFiles;
    const userID = req.body.userID;

    console.log(userID);

  } catch(error) {
    console.error("Error in Creating Bulk Orders : " + error);
  }
}


  module.exports = {
    getJobOrderOnID,
    getJobOrders,
    createPatentConsultation,
    createJobOrderPatentDrafting,
    createJobOrderPatentFiling,
    savePatentSearchData,
    saveResponseToFerData,
    saveFreedomToOperateData,
    savePatentIllustrationData,
    savePatentLandscapeData,
    savePatentWatchData,
    savePatentLicenseData,
    savePatentPortfolioAnalysisData,
    savePatentTranslationData,
    getJobFilesDetailsForUsers,
    getJobFilesForUsers,
    approveTheDoneWork,
    rejectTheDoneWork,
    getNotification,
    notificationSeen,
    notifcationsDelete,
    sortNotifications,
    clearRecentNotifs,
    getCSVData,
    createBulkOrders,
  };