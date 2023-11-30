import styles from './ChatComponent.module.css';
import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';



export const ChatComponent = () => {

    const [socket, setSocket] = useState(null);

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    
    
    
    
    
    useEffect(() => {
        const token = getCookie('token');
        const newSocket = io('http://localhost:8080',
        {query: {token: token}});
        setSocket(newSocket);
        return () => newSocket.close();
    },[])


    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    
    const [activeTab, setActiveTab] = useState(1);


    const tabSwitch = (idx) => {    // Funcion para cambiar de tab.
        setActiveTab(idx);
    }
    
    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };
    
    
    const handleSend = (e) => { // Aqui enviando mensajes a otro cliente.
        e.preventDefault();
        const newMessage = {
            body: message,
            from: 'Me'
        }
        setMessages([...messages, newMessage]);
        socket.emit('message', message);
        setMessage('');

    }

    const recieveMessage = (message) => {
        setMessages(state => [...state, message]);
    }
    

    useEffect(() => { // Aqui recibiendo mensajes desde otro cliente.
        if(socket){
        socket.on("message", recieveMessage);
        }
        return()=>{
            if(socket){
                socket.off("message", recieveMessage);
            }
        }
    }, [socket, recieveMessage])

    return (
        <Draggable position={position} onDrag={handleDrag} bounds="body" handle='.handle'>
            <div className={styles.mainContainer}>
                {/*HANDLE*/ }
                <div className= {`${'handle'} ${styles.handle1}`}>Handle</div>
                


                <div className={styles.flexContainer}>
                
                {/*LISTA DE SALAS + USUARIOS CONECTADOS*/ }
                    
                    <div className={styles.selectorContainer}>
                        
                        {/*TABS*/}
                        <div className={styles.tabContainer}>
                        <button onClick={()=> tabSwitch(1)} 
                            className={activeTab === 1 ? styles.activeTab : styles.tab}>Rooms</button>
                        <button onClick={()=> tabSwitch(2)} 
                            className={activeTab === 2 ? styles.activeTab : styles.tab}>Users</button>
                        </div>
                        
                        {/*LISTA DE SALAS*/ }
                        <div className={activeTab === 1 ? styles.activeContent : styles.content}>
                            <ul>
                                <li>Room 1</li>
                                <li>Room 2</li>
                                <li>Room 3</li>
                                <li>Room 4</li>
                                <li>Room 5</li>
                                <li>Room 6</li>
                                <li>Room 7</li>
                                <li>Room 8</li>
                                <li>Room 9</li>
                                <li>Room 10</li>
                            </ul>
                        </div>

                        {/*LISTA DE USUARIOS CONECTADOS*/}
                        <div className={activeTab === 2 ? styles.activeContent : styles.content}> 
                            <ul>
                                    <li>User</li>
                                    <li>User</li>
                                    <li>User</li>
                                    <li>User</li>
                                    <li>User</li>
                                    <li>User</li>
                                    <li>User</li>
                                    <li>User</li>
                                    <li>User</li>
                            </ul>
                        </div>
                                

                                
                    
                    
                    
                    </div>
                
                
                
                {/*INPUT CHAT Y MENSAJES*/ }
                    <div className={styles.chatContainer}>
                        <ul>
                            {
                                messages.map((message, i)=>{
                                    return <li key={i}>{message.from}: {message.body}</li>
                                })
                            }
                        </ul>
                        <form onSubmit={handleSend}>
                            <input type="text" placeholder='Write message...'
                                value={message}
                                onChange={(e)=> setMessage(e.target.value)}/>
                            <button>Send</button>
                        </form>
                    </div>
                    
                    
                    </div>
                    
                    
                
                </div>
            </Draggable>
    )
}