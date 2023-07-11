const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  userID: {
    type: Number,
  },
  first_name: {
    type: String,
  },
  last_name:{
    type: String,
  },
  profile_img:{
    type: String,
  },
  position: {
    type: String,
  },
  phno: {
    type: String,
  },
  street: {
    type: String,
  },
  town: {
    type: String,
  },
  country: {
    type: String,
  },
  applicant_type: {
    type: String,
  },
  business_name: {
    type: String,
  },
  company_id: {
    type: String,
  },
  vat_payer: {
    type: String,
  },
  post_code: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  full_name: {
    type: String,
  },
  age: {
    type: Number,
  },
  domain: {
    type: String,
  },
  "Patent Agent": {
    type: String,
  },
  cert_no: {
    type: String,
  },
  jurisdiction: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip_code: {
    type: String,
  },
  tax_ID_no: {
    type: String,
  },
  linkedin_profile: {
    type: String,
  },
  years_of_exp: {
    type: Number,
  },
  expertise_in: {
    type: [String],
  },
  can_handle: {
    type: String,
  },
  jobs: {
    type: [Number],
  },
  bank: {
    bank_name: {
      type: String,
    },
    account_num: {
      type: String,
    },
    account_name: {
      type: String,
    },
    branch: {
      type: String,
    },
    ifsc_code: {
      type: String,
    },
    address: {
      type: String,
    },
    town: {
      type: String,
    },
    post_code: {
      type: String,
    },
    country: {
      type: String,
    }
  },
  pref: {
    mails: {
      type: Boolean,
    },
    order_updates: {
      type: Boolean,
    },
    marketing_emails: {
      type: Boolean,
    },
    newsletter: {
      type: Boolean,
    },
  },
  is_free: {
    type: Boolean,
  },


});

const Partner = mongoose.model('Partner', PartnerSchema, 'partner');

module.exports = Partner;
