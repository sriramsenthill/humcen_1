const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  pref: {
    essential_emails: {
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
});

const Admin = mongoose.model('Admin', AdminSchema, 'admin');

module.exports = Admin;
