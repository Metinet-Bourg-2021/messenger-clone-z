const mongoose = require('mongoose');
const {Message, MessageSchema} = require("./Message");

const conversationSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    participants: {
        type: [String],
        required: true
    },
    messages: {
        type: [MessageSchema],
        default:[]
    },
    title: {
        type: String,
        default: null
    },
    theme: {
        type: String,
        default: null
    },
    nicknames: String,
    updated_at: { 
        type: Date,
        default: Date.now
    },
    seen: {
        type: Object,
        default: {}
    },
    typing: {
        type: Object,
        default: {}
    }
}, { minimize: false });

module.exports = mongoose.model('Conversation', conversationSchema);