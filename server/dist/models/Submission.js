"use strict";

var mongoose = require('mongoose');
var submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  failedTestcase: {
    type: Number,
    "default": null
  }
});
module.exports = mongoose.model('Submission', submissionSchema);