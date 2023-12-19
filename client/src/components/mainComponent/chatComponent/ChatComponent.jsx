import { useState, useEffect, Fragment } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';
import styles from './ChatComponent.module.css';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';



export const ChatComponent = ({handleShowProfile, users, loggedUser}) => {

    const [socket, setSocket] = useState(null);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    // Aqui conectando el socket y enviando el token.
    useEffect(() => {
        const token = getCookie('token');
        const newSocket = io('http://localhost:8080',
        {query: {token: token}});
        setSocket(newSocket);
        return () => newSocket.close();
    },[])
    
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});
    
    // Aqui enviando mensajes a otro cliente.
    const handleSend = (e) => {
        e.preventDefault();
        const token = Cookies.get("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const username = decoded.username;
        if (!recipientId) {
            console.error('Recipient not set.'); // Add an error log for debugging
            return;
        }
    
        const newMessage = {
            body: message,
            from: userId,
            fromName: username
        };
    
        setMessages((prevMessages) => ({
            ...prevMessages,
            [recipientId]: [...(prevMessages[recipientId] || []), newMessage]
        }));
    
        //socket.emit('private message', { to: recipientId, message: newMessage });  // ORiginal
        socket.emit('private message', { to: recipientId, message: {body: message, from: userId} });  
        setMessage('');
        console.log(`Message sent to ${recipientId}:`, newMessage);
    };
    
    
    const receiveMessage = (message) => {
        const { body, from: senderId, fromName: senderName } = message;
    
        setMessages((prevMessages) => {
            return {
                ...prevMessages,
                [recipientId]: [...(prevMessages[recipientId] || []), { body, fromName: senderName }]
            };
        });
    };
    
    
    
    
    // Aqui recibiendo mensajes desde otro cliente.
    useEffect(() => { 
        if(socket){
            // Handle incoming room messages
            socket.on('room message', ({ body, from }) => {
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [from]: [...(prevMessages[from] || []), { body, from }]
                }));
            });
    

            // Handle incoming private messages
            socket.on('private message', (message) => {
                console.log('Received message:', message); // This will log the received message
                receiveMessage(message);
                
            
            
            });
            
                
        }
        return()=>{
            if(socket){
                socket.off('room message');
                socket.off('private message');
            }
        }
    }, [socket, messages]);
    
    const [recipientId, setRecipientId] = useState(null);
    const [recipientName, setRecipientName] = useState(null);

    

    //DRAGGABLE
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };
    
    //TABS
    const [activeTab, setActiveTab] = useState(1);
    const tabSwitch = (idx) => {    
        setActiveTab(idx);
    };
    
    
    useEffect(() => {
        console.log('Current Messages State:', messages);
    }, [messages]);
    
    
    
    
    return (
        <Draggable position={position} onDrag={handleDrag} bounds="body" handle='.handle'>
            <div className={styles.mainContainer}>
                {/*HANDLE*/ }
                <div className= {`${'handle'} ${styles.handle1}`}>{recipientName ? recipientName : "NEO CYBERIA"}</div>
                


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
                                <li>ROOMS</li>
                                    
                            </ul>
                        </div>

                        {/*LISTA DE USUARIOS */}
                        <div className={activeTab === 2 ? styles.activeContent : styles.content}> 
                            <ul className={styles.userFlexContainer}>
                                {
                                    users.map(user => {
                                        if(user.username !== loggedUser)
                                            return (
                                                <Fragment key={user._id}>
                                                    <li className={styles.userItem}>
                                                        <div className={styles.imgContainer}>
                                                            <img 
                                                                src={user.profilePicture ? user.profilePicture : user.profilePictureUrl}
                                                                alt='Profile Picture' 
                                                                onClick={() => {handleShowProfile(user._id);
                                                                                console.log("USER: " ,user._id);}}
                                                            />
                                                        </div>
                                                        <div onClick={() => {setRecipientId(user._id);
                                                                            setRecipientName(user.username); 
                                                                            console.log("RECIPIENT: " ,user._id);}}>
                                                            {user.username}
                                                        </div>
                                                    </li>
                                                    
                                                </Fragment>
                                            )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                                

                                
                    
                    
                    
                
                
                
                {/*INPUT CHAT Y MENSAJES*/ }
                    <div className={styles.chatContainer}>
                        <ul>
                        {/* {console.log("RECIPIENT ID BEFORE MAP: ", recipientId)}
                        {console.log("MESSAGES FOR RECIPIENT: ", messages[recipientId])} */}
                            {
                                recipientId && messages[recipientId] && messages[recipientId].map((message, i) => {
                                    return <li key={i}>{message.fromName}: {message.body}</li>
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