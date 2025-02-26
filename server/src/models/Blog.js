const mongoose = require('mongoose');

const blogschema = new mongoose.Schema({
    titlle: { type: String, required: true },
    content: { type: String, required: true },
    arthur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blogs', blogschema);