import mongoose from "mongoose";



const ChatSingleSchema = new mongoose.Schema({
    sender:{type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    recipient:{type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    text:{type: String},
    file:{type: String},
}, {timestamps: true});


const ChatSingle = mongoose.model('chatSingle', ChatSingleSchema);

export default ChatSingle;