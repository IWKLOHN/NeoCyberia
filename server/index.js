import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import * as userRoutes from './routes/user.routes.js';
import * as profileRoutes from './routes/profile.routes.js';
import jwt from 'jsonwebtoken';
import { fetchPrivateMessages, getPrivateMessages, savePrivateMessage } from './controllers/chatSingle.controller.js';
import * as chatSingleRoutes from './routes/chatSingle.routes.js';
import axios from 'axios';

const generateRoomId = (userId, recipientId) => {
    if (userId < recipientId) {
        return `${userId}-${recipientId}`;
    } else {
        return `${recipientId}-${userId}`;
    }
};


const app = express();
const server = http.createServer(app); // http server
const io = new Server(server, {     // socket.io
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
}); 


// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
app.use(userRoutes.router);
app.use(profileRoutes.router);
app.use(chatSingleRoutes.router);

app.get('/deezer/*', async (req, res) => {
    try {
        const response = await axios.get(`https://api.deezer.com/${req.params[0]}`, {
        params: req.query,
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
    });

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/neocyberia") // connect to mongodb
.then(() => {
    console.log('Connected to MongoDB');
}) .catch(err => {
    console.log(err);
});


// function generateRoomId(userId, recipientId) {
//     // Sort the ids to ensure the roomId is the same regardless of the order of userId and recipientId
//     const ids = [userId, recipientId].sort();

//     // Join the ids with a hyphen to generate the roomId
//     return ids.join('-');
// }

// Socket.io
const userIdToSocketId = {};
// const usernameToSocketId = {};
let onlineUsers = 0;

io.on('connection', (socket) => {

    const { token } = socket.handshake.query;

    if (!token) {
        console.log('No token');
        return;
    }

    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        console.log('Decoded:', decoded); 
        if (err) {
            console.log('Failed to verify token:', err);
            return;
        }

        const { id, username } = decoded;
        socket.userId = id;
        socket.username = username;
        console.log(`${socket.username} connected`);
        

        userIdToSocketId[id] = socket.id;
        console.log('Updated userIdToSocketId:', userIdToSocketId); 

        onlineUsers++;
        io.emit('online users', {count: onlineUsers, users: Object.keys(userIdToSocketId)});
    });

    

    // Chat Rooms
    socket.on('join public room', (room) => {
        socket.join(room);
        console.log(`${socket.username} joined public room ${room}`);

        // Fetch and send chat history for the room to the user
        const chatHistory = getChatHistoryForRoom(room); // Implement this function
        socket.emit('chat history', { room, chatHistory });
    });

    // Handle joining private one-to-one chat rooms
    socket.on('join private room', async (recipientId) => {
        console.log('Recipient ID:', recipientId); // Add this
        // Ensure the recipientId is valid
        if (!userIdToSocketId[recipientId]) {
            console.log('Invalid recipientId');
            return;
        }
    
        const roomId = generateRoomId(socket.userId, recipientId);
    
        // Join the room
        socket.join(roomId);
        console.log(`${socket.username} joined private room ${roomId}`);
    
        // Fetch and send chat history for the room to the user
        
        try {
            const chatHistory = await fetchPrivateMessages(roomId);
            console.log('Sending chat history:', chatHistory); // Add this
            socket.emit('chat history', { room: roomId, chatHistory });
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    });

    socket.on('leave room', (room) => {
        socket.leave(room);
        console.log(`${socket.username} left room ${room}`);
    });

    socket.on('room message', ({ room, message }) => {
        io.to(room).emit('room message', {
            body: message,
            from: socket.username
        });
    });

    // Private Chat
    socket.on('private message', ({ to, message }) => {
        const recipientSocketId = userIdToSocketId[to];

        if (recipientSocketId) {
            const roomId = generateRoomId(socket.userId, to);
            socket.broadcast.to(roomId).emit('private message', {
                body: message.body,
                from: socket.username,
                fromName: socket.username,
                roomId: roomId
            });
            savePrivateMessage({
                body: message.body,
                from: socket.userId,
                to,
                roomId: roomId
            });
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        delete userIdToSocketId[socket.userId];
        console.log(`${socket.username} disconnected`);

        onlineUsers--;
        io.emit('online users', {count: onlineUsers, users: Object.keys(userIdToSocketId)});
    });
});






















// Start server
server.listen(8080, () => { console.log('Express and Socket.io on port 8080') });
