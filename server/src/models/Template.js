const mongoose = require('mongoose');

const templateschema = new mongoose.Schema({
    lang: { type: String, required: true},
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Template', templateschema);