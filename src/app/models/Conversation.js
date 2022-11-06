const mongoose = require('mongoose');

const Conversation = mongoose.Schema({
    id: { type: String, required: true },
    member1: { type: String, required: true },
    member2: { type: String, required: true },
    message: { type: Array, required: true },
});

module.exports = mongoose.model('Conversation', Conversation);
