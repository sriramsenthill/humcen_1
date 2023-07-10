const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phno: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  pref: {
    mails: {
      type: Boolean,
      required: true,
    },
    order_updates: {
      type: Boolean,
      required: true,
    },
    marketing_emails: {
      type: Boolean,
      required: true,
    },
    newsletter: {
      type: Boolean,
      required: true,
    },
  },
  user_specific_data: {
    tax_ID: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    ind_sec: {
      type: String,
      required: true,
    },
    emp_name: {
      type: String,
      required: true,
    },
    emp_surname: {
      type: String,
      required: true,
    },
    emp_pos: {
      type: String,
      required: true,
    },
  },
});

const User = mongoose.model('User', UserSchema, 'user');

module.exports = User;
