const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    picture: String,
    last_activity_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);