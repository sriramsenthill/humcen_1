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
const JobFiles=require("../mongoose_schemas/job_files");
const Drafting = require("../mongoose_schemas/patent_drafting");
const Filing = require("../mongoose_schemas/patent_filing");
const Unassigned = require("../mongoose_schemas/unassigned");


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

    } else {
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
      findPartner.is_free = false;
      findCustomer.jobs.push(draftingOrder._id.job_no);
  
      await Promise.all([findPartner.save(), findCustomer.save()]);
  
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
  
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
        steps_done: stepsInitial - 1, 
        steps_done_user: stepsInitial,
        steps_done_activity: stepsInitial + 1,
        status: "In Progress",
        budget: req.body.budget,
        domain: req.body.field,
      });
  
      await newJobOrder.save();
  
      console.log("Successfully Assigned Patent Drafting Task to a Partner");
      res.status(200).json(savedDrafting);

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

     else {
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
    findPartner.is_free = false;

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

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
      steps_done: stepsInitial - 1, 
      steps_done_user: stepsInitial,
      steps_done_activity: stepsInitial + 1,
      status: "In Progress",
      budget: req.body.budget,
      domain: req.body.field,
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Patent Filing Task to a Partner");
    res.status(200).json(savedFiling);

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
    findPartner.is_free = false;

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newSearchNo },
      service: "Patent Search",
      userID: userId,
      partnerID: findPartner.userID,
      partnerName: findPartner.first_name, // Assuming the partner's full name is stored in the 'full_name' field of the Partner collection
      customerName: findCustomer.first_name, // Assuming the customer's name is stored in the 'customerName' field of the Customer collection
      start_date: new Date(),
      end_date: endDate,
      steps_done: stepsInitial - 1, 
      steps_done_user: stepsInitial,
      steps_done_activity: stepsInitial + 1,
      budget: "To be Allocated",
      status: "In Progress",
      country: req.body.country,
      domain: req.body.field,
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Patent Search Task to a Partner");
    res.status(200).json(savedSearch);

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


    let findPartner = await Partner.findOne({ is_free: true, ["known_fields.Response to FER/Office Action"]: true, country: req.body.country, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }

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

    else {
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
    findPartner.is_free = false;

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

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
      steps_done: stepsInitial - 1, 
      steps_done_user: stepsInitial,
      steps_done_activity: stepsInitial + 1,
      status: "In Progress",
      budget: "To be Allocated",
      domain: req.body.field,
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Response to FER Task to a Partner");
    res.status(200).json(savedResponseToFer);

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

    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Freedom To Operate Search"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }

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

    } else {
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
      findPartner.is_free = false;
  
      await Promise.all([findPartner.save(), findCustomer.save()]);
  
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
  
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
        steps_done: stepsInitial - 1, 
        steps_done_user: stepsInitial,
        steps_done_activity: stepsInitial + 1,
        status: "In Progress",
        budget: "To be Allocated",
        domain: req.body.field,
      });
  
      await newJobOrder.save();
  
      console.log("Successfully Assigned Freedom To Operate Task to a Partner");
  
      res.status(200).send(savedFTO._id);

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

    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    illustrationData._id = { job_no: newJobNo };

    const savedJobOrder = new patentIllustration(illustrationData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentIllustration = await savedJobOrder.save();

    let findPartner = await Partner.findOne({ is_free: true, ["known_fields.Patent Illustration"]: true, country: req.body.country, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });

    if (!findPartner) {
      // Handle the case when no partner is found
      stepsInitial = 2;
      throw new Error("No partner found for the given criteria");
    }

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

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
      steps_done: stepsInitial - 1, 
      steps_done_user: stepsInitial,
      steps_done_activity: stepsInitial + 1,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Patent Illustration to a Partner");

    res.status(200).json(savedJobOrder._id);
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

    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentLandscapeData._id = { job_no: newJobNo };

    const savedJobOrder = new patentLandscape(patentLandscapeData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentLandscape = await savedJobOrder.save();

    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Freedom to Patent Landscape"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });

    if (!findPartner) {
      // Handle the case when no partner is found
      stepsInitial = 2;
      throw new Error("No partner found for the given criteria");
    }

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

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
      steps_done: stepsInitial - 1, 
      steps_done_user: stepsInitial,
      steps_done_activity: stepsInitial + 1,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Patent Landscape to a Partner");

    res.status(200).json(savedJobOrder._id);
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

    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentWatchData._id = { job_no: newJobNo };

    const savedJobOrder = new patentWatch(patentWatchData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentWatch = await savedJobOrder.save();

    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Patent Watch"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });

    if (!findPartner) {
      // Handle the case when no partner is found
      stepsInitial = 2;
      throw new Error("No partner found for the given criteria");
    }

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

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
      steps_done: stepsInitial - 1, 
      steps_done_user: stepsInitial,
      steps_done_activity: stepsInitial + 1,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Patent Watch to a Partner");

    res.status(200).json(savedJobOrder._id);
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

    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentLicenseData._id = { job_no: newJobNo };

    const savedJobOrder = new patentLicense(patentLicenseData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentLicense = await savedJobOrder.save();

    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Patent Licensing and Commercialization Services"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });

    if (!findPartner) {
      // Handle the case when no partner is found
      stepsInitial = 2;
      throw new Error("No partner found for the given criteria");
    }

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

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
      steps_done: stepsInitial - 1, 
      steps_done_user: stepsInitial,
      steps_done_activity: stepsInitial + 1,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Patent Licensing and Commercialization Services Task to a Partner");

    res.status(200).json(savedJobOrder._id);
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

    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentPortfolioData._id = { job_no: newJobNo };

    const savedJobOrder = new patentPortfolioAnalysis(patentPortfolioData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentPortfolio = await savedJobOrder.save();

    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Freedom to Patent Portfolio Analysis"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });

    if (!findPartner) {
      // Handle the case when no partner is found
      stepsInitial = 2;
      throw new Error("No partner found for the given criteria");
    }

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

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
      steps_done: stepsInitial - 1, 
      steps_done_user: stepsInitial,
      steps_done_activity: stepsInitial + 1,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Patent Portfolio Analysis Task to a Partner");

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};


const savePatentTranslationData = async (req, res) => {
  try {
    const userId = req.userId;
    let stepsInitial = 0;
    const patentTranslationData = req.body;
    patentTranslationData.userID = userId;

    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    patentTranslationData._id = { job_no: newJobNo };

    const savedJobOrder = new patentTranslation(patentTranslationData);
    savedJobOrder._id = { job_no: newJobNo };
    const savedPatentTranslation = await savedJobOrder.save();

    let findPartner = await Partner.findOne({ is_free: true, country: req.body.country, ["known_fields.Patent Translation Service"]: true, in_progress_jobs: { $lt: 5 } });
    let findCustomer = await Customer.findOne({ userID: userId });

    if (!findPartner) {
      // Handle the case when no partner is found
      stepsInitial = 2;
      throw new Error("No partner found for the given criteria");
    }

    if (!findCustomer) {
      // Handle the case when no customer is found
      throw new Error("No customer found for the given user ID");
    }
    stepsInitial = 3;
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findCustomer.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    await Promise.all([findPartner.save(), findCustomer.save()]);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

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
      steps_done: stepsInitial - 1, 
      steps_done_user: stepsInitial,
      steps_done_activity: stepsInitial + 1,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    });

    await newJobOrder.save();

    console.log("Successfully Assigned Patent Translation Services Task to a Partner");

    res.status(200).json(savedJobOrder._id);
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

const approveTheDoneWork = async(req, res) => {
  const jobID = req.params.jobID;
  const updatedData = req.body; // Getting the data sent through PUT request
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
    workedPartner.save().then((response) => {
      console.log("Partner's In Progress Job Count successfully Updated");
    }).catch((error) => {
      console.error("Error in updating Partner's In Progress Job Count: ", error);
    })      
    res.redirect("back");
  } catch(error) {
    console.error("Error in finding the Job: "+ error);
  }

}

const rejectTheDoneWork = async(req, res) => {
  const jobID = req.params.jobID;
  const updatedData = req.body;
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
  };