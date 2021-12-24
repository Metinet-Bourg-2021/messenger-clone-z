const bcrypt = require('bcrypt');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function postMessage({token, conversation_id, content}) {
    const userToken = token.userToken;
    let user = await User.findOne({id:userToken});

    await UserSchema.findOneAndUpdate({ username: user.data }, { last_activity_at: new Date() });

    let conversation = await Conversation.findOne({ id: conversation_id });

    let userList = {};
    conversation.participants.forEach(participant => {
        userList[participant] = new Date();
    });

    let message = new MessageSchema({
        id: conversation.messages.length,
        from: user.data,
        content: content,
        posted_at: new Date(),
        delivered_to: userList,
        reply_to: null,
        edited: false,
        deleted: false,
        reactions: {}
    });

    conversation.messages.push(message._id);
    conversation.seen[user.data] = {
        message_id: message.id,
        time: new Date()
    }

    await ConversationSchema.findOneAndUpdate(
        {id: conversation_id}, 
        {
            messages: conversation.messages,
            seen: conversation.seen,
            updated_at: new Date()
        }
    );

    for (let username of conversation.participants) {
        userList = allSockets.find(element => element.name === username);
        if (userList) {
            userList.socket.emit("@messagePosted", { conversation_id, message });
        }
    }
    return (userList);
}

async function seeConversation({token, conversation_id, message_id}) {
    const userToken = token.userToken;
    let user = await User.findOne({id:userToken});

    if(user)
    {
        const conversation = await Conversation.findOne({id:conversation_id});

        conversation.seen[user.username] = {
            message_id,
            time: new Date()
        }
        conversation.markModified('seen');

        sockets.forEach((socket)=>{
            if(conversation.participants.includes(socket.username)){
                socket.client.emit('@conversationSeen',{
                    conversation:conversation
                })
            }
        })
    }
}

async function replyMessage({token, conversation_id, message_id, content}) {
    const userToken = token.userToken;
    let user = await User.findOne({id:userToken});
  
    const conversation = await Conversation.findOne({id: conversation_id});
    const message = await Message.findById(message_id);
    const newMessage = await Message.create({
        from: user.username,
        content: content,
        posted_at: Date.now(),
        delivered_to: [],
        reply_to: message,
        edited: false,
        deleted: false,
        reactions: {},
    });

    await Conversation.updateOne(
    { id: conversation_id },
    { messages: [...conversation.messages, newMessage._id] }
    );

    return (newMessage);
}

async function editMessage({token, conversation_id, message_id, content}) {
    const userToken = token.userToken;
    let user = await User.findOne({id:userToken});

    await UserSchema.findOneAndUpdate({ username: user.data }, { last_activity_at: new Date() });

    let conversation = await Conversation.findOne({id: conversation_id});

    let messageList = [];
    for(let messageId of conversation.messages) {
        const message = await Message.findOne({
            id: messageId
        });
        if (message) {
            messagesList.push(message);
        }
    }

    let message = messageList.find(message => message.id === message_id);

    message.content = content;
    message.edited = true;
    await Message.findByIdAndUpdate(message.id, {
        content: content,
        edited: true
    });

    for (let username of conversation.participants) {
        let userList = allSockets.find(element => element.name === username);
        if (userList) {
            userList.socket.emit("@messageEdited", { conversation_id, message: messageFind });
        }
    }
    return (message);
}

async function reactMessage({token, conversation_id, message_id, reaction}) {
    const conversation = await Conversation.findById(conversation_id);

    const userToken = token.userToken;
    let user = await User.findOne({id:userToken});

    const editedMessage = await Message.findOneAndUpdate(
    { id: message_id },
    {
        $set: {
        [`reactions.${user.username}`]: reaction,
        },
    },
    { new: true }
    );

    conversation.participants.forEach((participant) => {
    users[participant]?.emit("@messageReacted", {
        conversation_id,
        message: { ...editedMessage.doc, id: editedMessage.id },
    });
    });

    return (editedMessage);
}

async function deleteMessage({token, conversation_id, message_id, content}) {
    const userToken = token.userToken;
    let user = await User.findOne({id:userToken});

    const message = await Message.findOne({id:message_id})
    message.deleted = true;
    await message.save()

    const conversation = await Conversation.findOne({id:conversation_id})

    let messageId = conversation.messages.findIndex(message=>message.id === message_id)
    conversation.messages.splice(messageId,1)
    await conversation.save()
    sockets.forEach((socket)=>{
        if(conversation.participants.includes(socket.username)){
            socket.client.emit('@messageDeleted',{
                conversation_id,
                message_id
            })
        }
    })
    return (message);
}

module.exports = {
    postMessage: postMessage,
    seeConversation: seeConversation,
    replyMessage: replyMessage,
    editMessage: editMessage,
    reactMessage: reactMessage,
    deleteMessage: deleteMessage
}