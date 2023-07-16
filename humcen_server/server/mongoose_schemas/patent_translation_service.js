const mongoose = require('mongoose');

const patentTranslationServiceSchema = new mongoose.Schema({
    _id: {
      job_no: {
      type: Number,
    },
    },
    field: {
      type: String,
    },

    source_language: {
      type: String,
    },
    
 
target_language:{
      type: String,
    },
    document_details: {
      type: Object,
    },
    userID: {
      type: Number,
    },
    additional_instructions:{
        type:String,
    },
    country: {
      type: String,
    },
  });


  const patentTranslationServices = mongoose.model('PatentTranslationServices', patentTranslationServiceSchema, 'patent_translation_services');


  module.exports = patentTranslationServices;