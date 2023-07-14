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
    const jobOrderData = req.body;
    jobOrderData.userID = userId;
    jobOrderData.service = "Patent Drafting";
    jobOrderData.start_date = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    jobOrderData.end_date = endDate;
    jobOrderData.status = "In Progress";
    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();
    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    jobOrderData._id = { job_no: newJobNo };
    const jobOrder = new JobOrder(jobOrderData);
    const savedJobOrder = await jobOrder.save();
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;
    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Drafting Task to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Drafting Task to the Partner");
      });
    res.status(200).json(savedJobOrder);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

const createJobOrderPatentFiling = async (req, res) => {
  try {
    const userId = req.userId;
    const jobOrderData = req.body;
    jobOrderData.userID = userId;
    jobOrderData.service = "Patent Filing";
    jobOrderData.start_date = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    jobOrderData.end_date = endDate;
    jobOrderData.status = "In Progress";
    jobOrderData.budget = req.body.budget;
    jobOrderData.country = req.body.country;
    const latestJobOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();
    const newJobNo = latestJobOrder ? latestJobOrder._id.job_no + 1 : 1000;
    jobOrderData._id = { job_no: newJobNo };
    const jobOrder = new JobOrder(jobOrderData);
    const savedJobOrder = await jobOrder.save();
    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;
    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Filing to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Filing to the Partner");
      });
    res.status(200).json(savedJobOrder);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

const savePatentSearchData = async (req, res) => {
  try {
    const userId = req.userId;
    const searchData = req.body;
    searchData.userID = userId;

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

    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedSearch._id.job_no);
    findPartner.is_free = false;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newSearchNo },
      service: "Patent Search",
      userID: userId,
      partnerID: findPartner.userID,
      start_date: new Date(),
      end_date: endDate,
      budget: "To be Allocated",
      status: "In Progress",
      country: "NA",
      domain: req.body.field,
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Search Task to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Search Task to the Partner");
      });

    res.status(200).json(savedSearch);
  } catch (error) {
    console.error("Error creating Search Order:", error);
    res.status(500).send("Error creating Search Order");
  }
};

const saveResponseToFerData = async (req, res) => {
  try {
    const userId = req.userId;
    const responseToFerData = req.body;
    responseToFerData.userID = userId;

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

    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedResponseToFer._id.job_no);
    findPartner.is_free = false;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newResponseToFerNo },
      service: "Response To FER Office Action",
      userID: userId,
      partnerID: findPartner.userID,
      country: req.body.country,
      start_date: new Date(),
      end_date: endDate,
      status: "In Progress",
      budget: "To be Allocated",
      domain: req.body.field,
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Response to FER Task to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Response to FER Task to the Partner");
      });

    res.status(200).json(savedResponseToFer);
  } catch (error) {
    console.error("Error creating Response To FER Order:", error);
    res.status(500).send("Error creating Response To FER Order");
  }
};

const saveFreedomToOperateData = async (req, res) => {
  try {
    const userId = req.userId;
    const freedomToOperateData = req.body;
    freedomToOperateData.userID = userId;

    const latestFTOOrder = await JobOrder.findOne()
      .sort({ "_id.job_no": -1 })
      .limit(1)
      .exec();

    const newFTONo = latestFTOOrder ? latestFTOOrder._id.job_no + 1 : 1000;
    freedomToOperateData._id = { job_no: newFTONo };

    const fTOOrder = new freedomToOperate(freedomToOperateData);
    fTOOrder._id = { job_no: newFTONo };
    const savedFTO = await fTOOrder.save();

    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedFTO._id.job_no);
    findPartner.is_free = false;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newFTONo },
      service: "Freedom To Operate",
      userID: userId,
      partnerID: findPartner.userID,
      country: req.body.country,
      start_date: new Date(),
      end_date: endDate,
      status: "In Progress",
      budget: "To be Allocated",
      domain: req.body.field,
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Freedom To Operate Task to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Freedom To Operate Task to the Partner");
      });

    res.status(200).send(savedFTO._id);
  } catch (error) {
    console.error("Error creating Freedom To Operate:", error);
    res.status(500).send("Error creating Freedom to Operate");
  }
};



const savePatentIllustrationData = async (req, res) => {
  try {
    const userId = req.userId;
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

    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Illustration",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: "NA",
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Illustration to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Illustration to the Partner");
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

const savePatentLandscapeData = async (req, res) => {
  try {
    const userId = req.userId;
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

    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Freedom to Patent Landscape",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Landscape to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Landscape to the Partner");
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

const savePatentWatchData = async (req, res) => {
  try {
    const userId = req.userId;
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

    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Watch",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: "NA",
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log("Successfully Assigned Patent Watch to a Partner");
      })
      .catch((err) => {
        console.log("Error in Assigning Patent Watch to the Partner");
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

const savePatentLicenseData = async (req, res) => {
  try {
    const userId = req.userId;
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

    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Licensing and Commercialization Services",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log(
          "Successfully Assigned Patent Licensing and Commercialization Services Task to a Partner"
        );
      })
      .catch((err) => {
        console.log(
          "Error in Assigning Patent Licensing and Commercialization Services Task to the Partner"
        );
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

const savePatentPortfolioAnalysisData = async (req, res) => {
  try {
    const userId = req.userId;
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

    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Portfolio Analysis",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: req.body.country,
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log(
          "Successfully Assigned Patent Portfolio Analysis Task to a Partner"
        );
      })
      .catch((err) => {
        console.log(
          "Error in Assigning Patent Portfolio Analysis Task to the Partner"
        );
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

const savePatentTranslationData = async (req, res) => {
  try {
    const userId = req.userId;
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

    const findPartner = await Partner.findOne({ is_free: true });
    console.log(findPartner);
    findPartner.jobs.push(savedJobOrder._id.job_no);
    findPartner.is_free = false;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newJobOrder = new JobOrder({
      _id: { job_no: newJobNo },
      service: "Patent Translation Services",
      userID: userId,
      partnerID: findPartner.userID,
      domain: req.body.field,
      start_date: new Date(),
      end_date: endDate,
      country: "NA",
      status: "In Progress",
      budget: "To be Allocated",
    }).save();

    findPartner
      .save()
      .then((response) => {
        console.log(
          "Successfully Assigned Patent Translation Services Task to a Partner"
        );
      })
      .catch((err) => {
        console.log(
          "Error in Assigning Patent Translation Services Task to the Partner"
        );
      });

    res.status(200).json(savedJobOrder._id);
  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).send("Error creating job order");
  }
};

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
  };