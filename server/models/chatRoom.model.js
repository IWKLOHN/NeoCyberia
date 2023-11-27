
import mongoose from 'mongoose';

const ChatRoomSchema = new mongoose.Schema({
    witchHouse:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],
    hiphop:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],
    pop:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],
    rock:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],
    jazz:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],
    classical:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],
    kpop:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],
    edm:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],
    indie:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],
    metal:[{type: mongoose.Schema.Types.ObjectId, ref: 'users', text: String, file: String, timestamp: Date}],

} , {timestamps: true});


const ChatRoom = mongoose.model('chatRooms', ChatRoomSchema);

export default ChatRoom;
