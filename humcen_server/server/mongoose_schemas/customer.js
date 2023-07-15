const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  phno:{
    type: String,
  },
  last_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userID: {
    type: Number,
    unique: true,
  },
  profile_img: {
    type: String
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
  user_specific_data: {
    surname: {
      type: String
    }
  },
  jobs: {
    type: [Number],
  }
});

const Customer = mongoose.model("Customer", customerSchema, "customer");

module.exports = Customer;
