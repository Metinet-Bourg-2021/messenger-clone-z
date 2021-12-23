const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    posted_at: {
        type: Date,
        default: Date.now
    },
    delivered_to: {
        type: Object,
        default: {}
    },
    reply_to: {
        type: Object,
        default: {}
    },
    edited: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    reactions: {
        type: Object,
        default: {}
    }
}, { minimize: false });

module.exports = mongoose.model('Message', messageSchema);

//module.exports = mongoose.model('Message', messageSchema, Schema: messageSchema);
