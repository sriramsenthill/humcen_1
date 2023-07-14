const mongoose = require('mongoose');

const patentPortfolioAnalysisSchema = new mongoose.Schema({
    _id: {
      job_no: {
      type: Number,
    },
    },
    field: {
      type: String,
    },
   country:{
  type:String,
   },
market_and_industry_information: {
      type: String,
    },
    
 business_objectives:{
      type: String,
    },
    patent_portfolio_information: {
      type: Object,
    },
    userID: {
      type: Number,
    },
    service_specific_files: {
      invention_details: {
        type: Object,
      },
    },
  });


  const patentPortfolioAnalysis = mongoose.model('PatentPortfolioAnalysis', patentPortfolioAnalysisSchema, 'freedom_to_patent_portfolio_analysis');


  module.exports = patentPortfolioAnalysis;