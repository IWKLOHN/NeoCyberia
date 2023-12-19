import { useState, useEffect, Fragment, useRef, useContext } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';
import styles from './ChatComponent.module.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { SocketContext } from '../../context/SocketContext';

export const ChatComponent = ({ handleShowProfile, users, loggedUser, loggedUserId }) => {
    const socket = useContext(SocketContext);

    // const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});
    const [recipientId, setRecipientId] = useState(null);
    const [recipientName, setRecipientName] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState(1);
    const [roomId, setRoomId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [lastMessageFrom, setLastMessageFrom] = useState(null);



    const recipientIdRef = useRef(recipientId);
    const messagesRef = useRef(messages);
    const messagesEndRef = useRef(null);
    

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

    // useEffect(() => {
    //     const token = getCookie('token');
    //     const newSocket = io('http://localhost:8080', { query: { token: token } });
    //     setSocket(newSocket);
    //     return () => newSocket.close();
    // }, []);

    
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
            const token = getCookie('token'); 
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
        console.log('Setting room id', roomId)
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

    
        const newMessage = {
            body: message,
            from: userId,
            roomId: roomId,
        };

        console.log('Sending message:', newMessage);
    
        
        setMessages((prevMessages) => ({
            ...prevMessages,
            [roomId]: [...(prevMessages[roomId] || []), newMessage],
        }));
    
    
        socket.emit('private message', { to: recipientId, message: { body: message, from: userId } });
        setMessage('');
        console.log(`Message sent to ${recipientId}:`, newMessage);
    };
    
    //ESTA YA NO SE USA AL PARECER
    // const receiveMessage = (message) => {
    //     const { body, from: senderId, fromName: senderName, roomId } = message;
    
    //     setMessages((prevMessages) => {
    //         const updatedMessages = { ...prevMessages };
    //         if (!updatedMessages[roomId]) {
    //             updatedMessages[roomId] = [];
    //         }
    //         return {
    //             ...prevMessages,
    //             [roomId]: [...updatedMessages[roomId], { body, fromName: senderName }]
    //         };

    //     });
    // };
    



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

                if (message.from !== recipientName) {
                    setLastMessageFrom(message.from);
                }
                
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
                socket.off('chat history');
            }
        };
    }, [socket, messages, roomId]);

    

    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };

    


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


        useEffect(() => {
            if (roomId) {
                fetchChatHistory(roomId);
                console.log('Fetching chat history for room', roomId);
            }   
        }, [roomId]);
    
    
        const allMessages = messages[roomId] || [];
    
        // const scrollToBottom = () => {
        //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        // };
    
        useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, [allMessages]);

        const handleUserClick = (userId) => {
            const roomId = generateRoomId(loggedUserId, userId);
            setRoomId(roomId);
            
        }

        
    
    return(
        <Draggable position={position} onDrag={handleDrag} bounds="body" handle=".handle" >
            <div className={styles.fullWraper}>
                <div className={`${'handle'} ${styles.handle1}`}>{recipientName ? recipientName : 'NEO CYBERIA'}</div>
                <div className={styles.flexContainer}>
                    <div className={styles.selectorContainer}>
                        <div className={styles.tabContainer}>
                            
                            <button >
                                Users
                            </button>
                        </div>
                        
                        <div className={styles.userList}>
                            <UserList 
                                users={users} 
                                loggedUser={loggedUser}
                                loggedUserId={loggedUserId} 
                                handleShowProfile={handleShowProfile} 
                                handleUserClick={handleUserClick} 
                                setRecipientId={setRecipientId} 
                                setRecipientName={setRecipientName} 
                                openOneToOneRoom={openOneToOneRoom}
                                lastMessageFrom={lastMessageFrom}
                                setLastMessageFrom={setLastMessageFrom}/>
                        </div>
                    </div>
                    <div className={styles.chatContainer}>
                        <div className={styles.messageListContainer}>
                            <MessageList 
                                allMessages={allMessages} 
                                loggedUserId={loggedUserId} 
                                messagesEndRef={messagesEndRef}/>
                        </div>
                        <MessageInput 
                            message={message} 
                            setMessage={setMessage} 
                            handleSend={handleSend} />
                        
                    </div>
                </div>
            </div>
        </Draggable>

    )
};
    
    
const UserList = ({ users, loggedUser, loggedUserId, handleShowProfile, handleUserClick, setRecipientId, setRecipientName, openOneToOneRoom, lastMessageFrom, setLastMessageFrom}) => {
    return (
        <div className={styles.userFlexContainer}>
            <ul>
                {users.map((user) => {
                    if (user.username !== loggedUser)
                        return (
                            <Fragment key={user._id}>
                                <li className={user.username === lastMessageFrom ? `${styles.userItem} ${styles.userWithNewMessage}` : styles.userItem}>
                                    <div className={styles.imgContainer}>
                                        <img
                                            src={user.profilePicture ? user.profilePicture : user.profilePictureUrl}
                                            alt="Profile Picture"
                                            onClick={() => handleShowProfile(user._id)}
                                        />
                                    </div>
                                    <div
                                        onClick={() => {
                                            handleUserClick(user._id);
                                            setRecipientId(user._id);
                                            setRecipientName(user.username);
                                            openOneToOneRoom(loggedUserId, user._id);

                                            setLastMessageFrom(null);
                                        }}
                                    >
                                        <span>{user.username}</span>
                                    </div>
                                    <div className={styles.point}>
                                    
                                    </div>
                                </li>
                            </Fragment>
                        );
                })}
            </ul>
        </div>
    );
}
    
const MessageList = ({ allMessages, loggedUserId, messagesEndRef }) => {
    return (
        <ul className={styles.messagesContainer}>
            {allMessages.map((message, i) => (
                
                <li 
                key={i} 
                className={message.from === loggedUserId || (message.sender && message.sender._id === loggedUserId) ? styles.senderStyle : styles.receivedStyles}
            >
                {message.text ? 
                    (message.sender._id === loggedUserId ? message.text : `${message.sender.username}: ${message.text}`) 
                    : 
                    (message.from === loggedUserId ? message.body : `${message.fromName}: ${message.body}`)}
            </li>
            ))}
            <div ref={messagesEndRef} />
        </ul>
    );
}


const MessageInput = ({ message, setMessage, handleSend }) => {
    

    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        const resizeTextarea = () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight - parseInt(getComputedStyle(textarea).paddingTop) - parseInt(getComputedStyle(textarea).paddingBottom)) + 'px';
        };
        textarea.addEventListener('input', resizeTextarea);
        // Clean up function
        return () => {
            textarea.removeEventListener('input', resizeTextarea);
        };
    }, []);


    return (
        <form onSubmit={handleSend} className={styles.messageInputContainer}>
            <div className={styles.textareaWrapper}>
            <textarea
                ref={textareaRef}
                type="text"
                placeholder="Write message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            </div>
            <button>Send</button>
        </form>
    );
}