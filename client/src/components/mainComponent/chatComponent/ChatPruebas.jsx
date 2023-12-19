import { useState, useEffect, Fragment, useRef } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';
import styles from './ChatComponent.module.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';





export const ChatPruebas = ({ handleShowProfile, users, loggedUser, loggedUserId }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});
    const [recipientId, setRecipientId] = useState(null);
    const [recipientName, setRecipientName] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState(1);
    // const [forceUpdate, setForceUpdate] = useState(false);
    const [roomId, setRoomId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);

    const recipientIdRef = useRef(recipientId);
    const messagesRef = useRef(messages);


    useEffect(() => {
        recipientIdRef.current = recipientId;
        // console.log('recipientIdRef ', recipientId);
    }, [recipientId]);

    useEffect(() => {
        messagesRef.current = messages;
        // console.log('messagesRef ', messages);
    }, [messages]);
    
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    useEffect(() => {
        const token = getCookie('token');
        const newSocket = io('http://localhost:8080', { query: { token: token } });
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    
    const generateRoomId = (userId, recipientId) => {
        console.log('Generating room id with userId', userId, 'and recipientId', recipientId);
    
    
        if (userId < recipientId) {
            return `${userId}-${recipientId}`;
        } else {
            return `${recipientId}-${userId}`;
        }
    };
    
    useEffect(() => {
        if (recipientId) {
            socket.emit('join private room', recipientId);
        }
    }, [recipientId]);
    

    const fetchChatHistory = async (roomId) => {
        try {
            const token = getCookie('token'); // Assuming getCookie is a function that retrieves the token
            const response = await axios.get(`http://localhost:8080/api/chatHistory/${roomId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });
            console.log('Chat history:', response.data);
            setMessages((prevMessages) => ({
            ...prevMessages,
            [roomId]: response.data,
            }));
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
        }
    };
    
    
    
    
    
    
    
    
    
    
    
    const openOneToOneRoom = (userId, recipientId) => {
        setRecipientId(recipientId);
        // const roomId = generateRoomId(userId, recipientId);
        console.log('Setting room id', roomId)
        // setRoomId(roomId);

        // socket.emit('join private room', recipientId);

        
    };

    
    
    useEffect(() => {
        if(roomId && messages[roomId]){
            setMessages(messagesRef.current);
        }
    }, [roomId, messages]);
    
    
    
    
    
    
    
    

    const handleSend = (e) => {
        e.preventDefault();
        const token = Cookies.get('token');
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const username = decoded.username;
    
        if (!recipientId) {
            console.error('Recipient not set.');
            return;
        }
    
        const roomId = generateRoomId(userId, recipientId);
        // setRoomId(roomId);
    
        const newMessage = {
            body: message,
            from: userId,
            fromName: username,
            roomId: roomId,
        };
    
        // Update chat history immediately after sending a message
        setMessages((prevMessages) => ({
            ...prevMessages,
            [roomId]: [...(prevMessages[roomId] || []), newMessage],
        }));
    
        // Fetch chat history immediately after sending a message
        // await fetchChatHistory(roomId);
    
        socket.emit('private message', { to: recipientId, message: { body: message, from: userId } });
        setMessage('');
        console.log(`Message sent to ${recipientId}:`, newMessage);
    };
    
    //ESTA YA NO SE USA AL PARECER
    const receiveMessage = (message) => {
        const { body, from: senderId, fromName: senderName, roomId } = message;
    
        setMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            if (!updatedMessages[roomId]) {
                updatedMessages[roomId] = [];
            }
            return {
                ...prevMessages,
                [roomId]: [...updatedMessages[roomId], { body, fromName: senderName }]
            };
        // }, () => {
        //     // This callback function will be called after the messages state has been updated
        //     setRoomId(roomId);
        });
    };
    



    useEffect(() => {
        if (socket) {
            socket.on('room message', ({ body, from }) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [from]: [...(prevMessages[from] || []), { body, from }],
                }));
            });
    
            socket.on('private message', (message) => {
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [message.roomId]: [...(prevMessages[message.roomId] || []), message],
                }));
                console.log('Received message:', message);
                // receiveMessage(message);
                // fetchChatHistory(roomId);
            });
    
            // Use 'chat history' instead of 'send chat history'
            socket.on('chat history', (data) => {
                console.log('Received chat history:', data);
                if (data.room === roomId) {
                    setChatHistory(data.chatHistory);
                }
            });
        }
    
        return () => {
            if (socket) {
                socket.off('room message');
                socket.off('private message');
                // Use 'chat history' instead of 'send chat history'
                socket.off('chat history');
            }
        };
    }, [socket, messages, roomId]);

    

    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };

    const tabSwitch = (idx) => {
        setActiveTab(idx);
    };

    // useEffect(() => {
    //     console.log('Current Messages State:', messages);
    // }, [messages]);

    useEffect(() => {
        if (recipientId) {
            setMessages((prevMessages) => {
                const updatedMessages = { ...prevMessages };
                if (!updatedMessages[recipientId]) {
                    updatedMessages[recipientId] = [];
                }
                return updatedMessages;
            });
        }
    }, [recipientId]);

    useEffect(() => {
        if (recipientId) {
            const roomId = generateRoomId(loggedUserId, recipientId);
            setRoomId(roomId);
        }
    }, [recipientId]);
    
                // console.log('Rendering with recipientId:', recipientId);
                // console.log('Rendering with messages:', messages);
        
        // useEffect(() => {
        //     fetchChatHistory(roomId);
        //     console.log('RoomId changed', roomId);
        // }, [roomId]);

        useEffect(() => {
            if (roomId) {
                fetchChatHistory(roomId);
                console.log('Fetching chat history for room', roomId);
            }   
        }, [roomId]);
    
    
        const allMessages = messages[roomId] || [];
    
    

        const handleUserClick = (userId) => {
            const roomId = generateRoomId(loggedUserId, userId);
            setRoomId(roomId);
            
        }




            return (
        <div>
        
        {/* <Draggable position={position} onDrag={handleDrag} bounds="body" handle=".handle"> */}
            <div className={styles.mainContainer}>
                <div className={`${'handle'} ${styles.handle1}`}>{recipientName ? recipientName : 'NEO CYBERIA'}</div>

                <div className={styles.flexContainer}>
                    <div className={styles.selectorContainer}>
                        <div className={styles.tabContainer}>
                            <button onClick={() => tabSwitch(1)} className={activeTab === 1 ? styles.activeTab : styles.tab}>
                                Rooms
                            </button>
                            <button onClick={() => tabSwitch(2)} className={activeTab === 2 ? styles.activeTab : styles.tab}>
                                Users
                            </button>
                        </div>

                        {/* // ACA EMPIEZA EL COMP? */}
                        <div className={activeTab === 1 ? styles.activeContent : styles.content}> 
                            <ul>
                                <li>ROOMS</li>
                            </ul>
                        </div>

                        <div className={activeTab === 2 ? styles.activeContent : styles.content}>
                            <ul className={styles.userFlexContainer}>
                                {users.map((user) => {
                                    if (user.username !== loggedUser)
                                        return (
                                            <Fragment key={user._id}>
                                                <li className={styles.userItem}>
                                                    <div className={styles.imgContainer}>
                                                        <img
                                                            src={user.profilePicture ? user.profilePicture : user.profilePictureUrl}
                                                            alt="Profile Picture"
                                                            onClick={() => {
                                                                handleShowProfile(user._id);
                                                                //console.log('USER: ', user._id);
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        onClick={ () => {
                                                            handleUserClick(user._id);
                                                            setRecipientId(user._id);
                                                            setRecipientName(user.username);
                                                            openOneToOneRoom(loggedUserId, user._id);
                                                            

                                                            //console.log('RECIPIENT: ', user._id);
                                                        }}
                                                    >
                                                        {user.username}
                                                    </div>
                                                </li>
                                            </Fragment>
                                        );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.chatContainer}>
                        <ul>
                            {
                                allMessages.map((message, i) => (
                                    <li key={i}>
                                        {message.text ? `${message.sender.username}: ${message.text}` : `${message.fromName}: ${message.body}`}
                                    </li>
                            ))}
                        </ul>
                        <form onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Write message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        {/* </Draggable> */}
        </div>
    );
};
