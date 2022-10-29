const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide an name!'],
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },

        password: {
            type: String,
            required: [true, 'Please provide a password!'],
        },
        gender: {
            type: String,
        },
        avatar: {
            type: String,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
