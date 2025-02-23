const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    time: { type: Number, required: true },
    code: { type: String, required: true },
    accepted: { type: Boolean, required: true },
    failedTestcase: { type: Number},
});

module.exports = mongoose.model('Submission', submissionSchema);