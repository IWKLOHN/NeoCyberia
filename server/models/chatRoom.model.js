
import mongoose from 'mongoose';


const ChatRoomMessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    text: { type: String},
    file: { type: String},
    timestamp: { type: Date, default: Date.now},
},{_id: false, timestamps: true});


const ChatRoomSchema = new mongoose.Schema({
    name:{ type: String},
    messages: [ChatRoomMessageSchema],

} , {timestamps: true});


const ChatRoom = mongoose.model('chatRooms', ChatRoomSchema);

export default ChatRoom;








