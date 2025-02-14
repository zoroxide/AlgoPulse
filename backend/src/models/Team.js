const mongoose = require('mongoose');

const teamschema = new mongoose.Schema({
    name: { type: String, required: true },
    handle: { type: String, required: true },
    users: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problems: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    avatar: { type: String, required: true },
});

module.exports = mongoose.model('Team', teamschema);