import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import * as userRoutes from './routes/user.routes.js';



const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(userRoutes.router);
app.use(cookieParser());

const server = http.createServer(app); // http server
const io = new Server(server, {     // socket.io
    cors: {
        origin: 'http://localhost:5173',
    }
}); 

mongoose.connect("mongodb://127.0.0.1:27017/neocyberia") // connect to mongodb
.then(() => {
    console.log('Connected to MongoDB');
}) .catch(err => {
    console.log(err);
});

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('message', (body)=>{ // listen for message event
        console.log(body)
        socket.broadcast.emit('message',{ // emit message event
            body,
            from: socket.id.slice(8)
        
        })
    })
})

app.listen(8080 , () => { console.log('CRUD port 8080') });
server.listen(8081, () => { console.log('Socket.io port 8081') });
