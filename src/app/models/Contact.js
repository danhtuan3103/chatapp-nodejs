const mongoose = require('mongoose');
const Contact = new mongoose.Schema({
    self: {
        type: String,
        required: true,
    },
    contact: {
        type: Array,
    },
});

module.exports = mongoose.model('Contact', Contact);
