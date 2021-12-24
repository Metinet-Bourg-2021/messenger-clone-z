const bcrypt = require('bcrypt');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function getOrCreateOneToOneConversation({token, username}) { 
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
    
            return {newConv};
        }
}

async function createManyToManyConversation({token, username}) {

    const userToken = token.userToken;
    let user = await User.findOne({id:userToken});
    usernames.push(user.username);
    let conversationList = await Conversation.find();
    const conversation = new Conversation({
        id: conversationList.length,
        type: "many_to_many",
        participants: usernames
    });
    return {conversation};

}

async function getConversations(token) {

    const user = await User.findOne({token:token})
    if(user)
    {
        const conversationList = await Conversation.find({participants : { $in :user.username  }});
        return {conversationList};

    }
}

module.exports = {
    getOrCreateOneToOneConversation : getOrCreateOneToOneConversation,
    createManyToManyConversation: createManyToManyConversation,
    getConversations: getConversations
}