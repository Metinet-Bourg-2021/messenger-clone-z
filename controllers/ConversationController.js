const bcrypt = require('bcrypt');
const User = require('../models/Conversation');
const jwt = require('jsonwebtoken');

function getOrCreateOneToOneConversation({token, username}) { 
        const conversationList = await ConversationSchema.findOne({participants: { "$all" : [username] }, type: 'one_to_one'});
        if (conversationList) 
        {
            let messageList = [];
            await conversationList.messageList.forEach(async (messageId) => {
                const message = await MessageSchema.find({id : messageId});
                messagesList.push(message);
            });
            conversationList.messageList = messageList;
        }
        else {
            const newConv = new ConversationSchema({
                title: "",
                type: "one_to_one",
                participants: [username],
                messages: [],
                theme: "BLUE",
                updated_at: new Date(),
                seen: {},
                typing: {}
            });
            newConv.participants.forEach(username => {
                newConv.seen[username] = {
                    message_id : -1,
                    time : new Date()
                };
            });

            newConv.title = username;
    
            return callback({newConv});
        }
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