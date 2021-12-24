const bcrypt = require('bcrypt');
const User = require('../models/Message');
const jwt = require('jsonwebtoken');

async function postMessage({token, conversation_id, content}) {

}

async function seeConversation({token, conversation_id, message_id}) {

}

async function replyMessage({token, conversation_id, message_id, content}) {

}

async function editMessage({token, conversation_id, message_id, content}) {

}

async function reactMessage({token, conversation_id, message_id, reaction}) {

}

async function deleteMessage({token, conversation_id, message_id, content}) {

}

module.exports = {
    postMessage: postMessage,
    seeConversation: seeConversation,
    replyMessage: replyMessage,
    editMessage: editMessage,
    reactMessage: reactMessage,
    deleteMessage: deleteMessage
}