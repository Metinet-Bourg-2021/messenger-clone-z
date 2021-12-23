const bcrypt = require('bcrypt');
const User = require('../models/Conversation');
const jwt = require('jsonwebtoken');

function getOrCreateOneToOneConversation() {

}

function createManyToManyConversation() {

}

function getConversations() {

}

module.exports = {
    getOrCreateOneToOneConversation : getOrCreateOneToOneConversation,
    createManyToManyConversation: createManyToManyConversation,
    getConversations: getConversations
}