import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import * as userRoutes from './routes/user.routes.js';
import * as profileRoutes from './routes/profile.routes.js';
import jwt from 'jsonwebtoken';



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

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/neocyberia") // connect to mongodb
.then(() => {
    console.log('Connected to MongoDB');
}) .catch(err => {
    console.log(err);
});


// Socket.io
io.on('connection', (socket) => {
    const token = socket.handshake.query.token; // get token from query
    console.log('Token', token);
    if(!token){
        console.log('No token')
        return;
    }
    jwt.verify(token,"jwt-secret-key", (err, decoded) =>{
        if(err){
            console.log('Failed to verify token:',err)
            return
        }else{
            socket.username = decoded.username // set username
        }
    });
    console.log('a user connected');
    socket.on('message', (body)=>{ // listen for message event
        console.log(body)
        socket.broadcast.emit('message',{ // emit message event
            body,
            from: socket.username
        
        })
    })
});


// Start server
server.listen(8080, () => { console.log('Express and Socket.io on port 8080') });