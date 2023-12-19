import { useState, useEffect, Fragment, useRef, useContext } from 'react';
import io from 'socket.io-client';
import styles from './ChatComponent.module.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { SocketContext } from '../../context/SocketContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faVolumeUp, faVolumeDown, faVolumeMute } from '@fortawesome/free-solid-svg-icons'



export const ChatComponent = ({ handleShowProfile, users, loggedUser, loggedUserId, selectedUser, artistPhotos, albumCovers,songPreviews}) => {
    const {socket, usersOnlineCount, usersOnline} = useContext(SocketContext);
    
    
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});
    const [recipientId, setRecipientId] = useState(null);
    const [recipientName, setRecipientName] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState(1);
    const [roomId, setRoomId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [lastMessageFrom, setLastMessageFrom] = useState(null);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    // const [showSongPreviews, setShowSongPreviews] = useState(false);
    // const [showFavoriteAlbums, setShowFavoriteAlbums] = useState(false);
    // const [showFavoriteArtists, setShowFavoriteArtists] = useState(false);
    const [isProfileHidden, setIsProfileHidden] = useState(true); 
    // const [onlineUsersCount, setOnlineUsersCount] = useState(0);
    // const [onlineUsers, setOnlineUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);        



    const recipientIdRef = useRef(recipientId);
    const messagesRef = useRef(messages);
    const messagesEndRef = useRef(null);
    
    const handleRenderProfile = () => {
        setIsProfileVisible(true);
    };
        
    
    


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

        // console.log('Sending message:', newMessage);
    
        
        setMessages((prevMessages) => ({
            ...prevMessages,
            [roomId]: [...(prevMessages[roomId] || []), newMessage],
        }));
    
    
        socket.emit('private message', { to: recipientId, message: { body: message, from: userId } });
        setMessage('');
        console.log(`Message sent to ${recipientId}:`, newMessage);
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
            return () => {
                if (socket) {
                    socket.off('room message');
                    socket.off('private message');
                    socket.off('chat history');
                }

            };
            
        }
    
        
    }, [socket, roomId, messages]);

    

    

    


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
        
        <div className={styles.fullWraper}>
                

            <div className={styles.userListContainer}>
                
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
                    setLastMessageFrom={setLastMessageFrom}
                    handleRenderProfile={handleRenderProfile}
                    setIsProfileHidden={setIsProfileHidden}
                    isProfileHidden= {isProfileHidden}
                    usersOnline ={usersOnline}
                    />
                    
            </div>
        
                        
                        
                    
            {/* CHAT CONTAINER */}
            <div className={styles.chatContainer}>
                <div className={styles.chatHeader}>{recipientName ? recipientName : 'NEO CYBERIA'}</div>

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
            
            <div className={`${styles.renderProfilesContainer} ${isProfileHidden ? styles.hidden : ''}`}>
                <RenderProfile
                selectedUser={selectedUser}
                artistPhotos={artistPhotos}
                albumCovers={albumCovers}
                songPreviews={songPreviews}
                
                setIsProfileHidden={setIsProfileHidden}
                />
            </div>
            
            <div className={styles.footerContainer}>
                <Footer
                usersOnlineCount={usersOnlineCount}
                />
            </div>    

        </div>
    

    )
};
    
    
const UserList = ({ 
        users,
        loggedUser,
        loggedUserId,
        handleShowProfile,
        handleUserClick,
        setRecipientId,
        setRecipientName,
        openOneToOneRoom,
        lastMessageFrom,
        setLastMessageFrom,
        handleRenderProfile,
        setIsProfileHidden,
        isProfileHidden,
        usersOnline
    }) => {
    
    
        return (
            <div className={styles.userListItems}>
                <ul>
                    {users.sort((a, b) => {
                        // Move online users to the top
                        if (usersOnline.includes(a._id) && !usersOnline.includes(b._id)) {
                            return -1;
                        }
                        if (!usersOnline.includes(a._id) && usersOnline.includes(b._id)) {
                            return 1;
                        }
                        // If both users are online or both are offline, sort by username
                        return a.username.localeCompare(b.username);
                    }).map((user) => {
                        if (user.username !== loggedUser)
                            return (
                                <Fragment key={user._id}>
                                    <li className={user.username === lastMessageFrom ? `${styles.userItem} ${styles.userWithNewMessage}` : styles.userItem}>
                                        <div className={styles.imgContainer}>
                                            <img
                                                src={user.profilePicture ? user.profilePicture : user.profilePictureUrl}
                                                alt="Profile Picture"
                                                onClick={() => {
                                                    handleShowProfile(user._id)
                                                    setIsProfileHidden(false);
                                                    console.log('User image clicked, isProfileHidden:', isProfileHidden);
                                                }}
                                            />
                                        </div>
                                        <div
                                            onClick={() => {
                                                handleUserClick(user._id);
                                                setRecipientId(user._id);
                                                setRecipientName(user.username);
                                                openOneToOneRoom(loggedUserId, user._id);
                                                handleRenderProfile();
                                                setLastMessageFrom(null);
                                            }}
                                        >
                                            <span>{user.username}</span>
                                        </div>
                                        <div className={usersOnline.includes(user._id) ? styles.online : styles.offline}>
                                        </div>
                                    </li>
                                </Fragment>
                            );
                    })}
                </ul>
            </div>
        );
    };
    
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
    

    


    return (
        <form onSubmit={handleSend} className={styles.messageInputContainer}>
            <div>
                <input value={message} onChange={(e) => setMessage(e.target.value) } className={styles.inputText} placeholder='Write message...' type="text" />
            </div>
            <button className={styles.sendButton}>Send</button>
        </form>
    );
}


const RenderProfile = ({
        selectedUser,
        artistPhotos,
        albumCovers,
        songPreviews,
        setIsProfileHidden,
    
        }) => {
    
    const [tab, setTab] = useState(1);
    const [openSection, setOpenSection] = useState(null);
    const audioRef = useRef();

    const play = () => {
        audioRef.current.play();
    }

    const pause = () => {
        audioRef.current.pause();
    }



    const handleButtonClick = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleTabChange = (idx) => {
        setTab(idx);
    }
    
    
    
    return(
        <div >
            {selectedUser && (
                <div>
                    <button className={styles.closeButton} onClick={() => setIsProfileHidden(true)}>X</button>
                        
                        <div className={styles.headerProf}>
                            <div className={styles.centerProfileImg}>
                                <div className={styles.imgContainerProfileSq}>
                                    <img src={selectedUser.profilePicture} alt={selectedUser.username} />
                                </div>
                            </div>
                            <div className={styles.tabContainer}>
                                    <button onClick={() => handleTabChange(1)}
                                    className={tab === 1 ? styles.activeTab : styles.tab}>Bio</button>
                                    <button onClick={() => handleTabChange(2)}
                                    className={tab === 2 ? styles.activeTab : styles.tab}>Interests</button>
                            </div>
                        </div>
                        <h1 className={styles.profileTitle}>{selectedUser.username}</h1>
                        
                    
                        
                        <div className={tab === 1 ? styles.activeContent : styles.content}>
                    <div className={styles.bio}>
                        
                        
                        
                        <ul>
                            
                            <li className={styles.bioLi}>{`Birthday: ${new Date (selectedUser.profile.birthday).toLocaleDateString()}`}</li>
                            <li className={styles.bioLi}>Country: {selectedUser.profile.country}</li>
                            <li className={styles.bioLi}>Languages: {selectedUser.profile.languages}</li>
                            <li className={styles.bioLi}>Current Obession: {selectedUser.profile.currentObsession}</li>
                        </ul>
                        </div>
                        
                    </div>
                    <div className={tab === 2 ? styles.activeContent : styles.content}>
                    <button className={styles.subTitles} onClick={() => handleButtonClick('artists')}>Favorite Artists</button>
                    <hr />
                    <div className={styles.artistsContainer}>
                        {openSection === 'artists' && artistPhotos.map((artist, index) => (
                            <div key={index}>
                                {artist.error ? (
                            <p>Could not retrieve artist "{artist.artistName}"</p>
                        ) : (
                            <>
                                <p>{artist.artistName}</p>
                                <a href={artist.link} target="_blank" rel="noopener noreferrer" className= {styles.imgAnimation}>
                                    <img src={artist.picture} alt={`Picture of ${artist.artistName}`} />
                                </a>
                                
                            </>
                        )}
                    </div>
                        ))}
                    </div>
                    <button className={styles.subTitles} onClick={() => handleButtonClick('albums')}  >Favorite Albums</button>
                    <hr />
                    <div className={styles.albumsContainer}>
                    {openSection === 'albums' && albumCovers.map((album, index) => (
                    <div key={index}>
                        {album.error ? (
                    <p>Could not retrieve album "{album.albumName}" by "{album.artistName}"</p>
                ) : (
                    <>
                        <p>{album.albumName}</p>
                        {/* <label>{album.artistName}</label> */}
                        <a href={album.link} target="_blank" rel="noopener noreferrer" className= {styles.imgAnimation}>
                            <img src={album.cover} alt={`Cover of ${album.albumName}`} />
                        </a>
                        
                    </>
                )}
            </div>
                    ))}
                    </div>
                <button className={styles.subTitles} onClick={() => handleButtonClick('songs')} >Favorite Songs</button>
                <hr />
                <div className={styles.songsContainer}>
                {openSection === 'songs' && songPreviews.map((song, index) => {
                    return(
                    <div key={index}>
                        {song.error ? (
                    <p>Could not retrieve song "{song.songName}" by "{song.artistName}"</p>
                ) : (
                    <>
                        <div>
                        <p>{song.songName} - <span>{song.artistName}</span></p>
                        
                        </div>
                        
                        <div className={styles.audioFullSong}>
                        <audio controls >
                            <source src={song.preview} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        <a href={song.link} target="_blank" rel="noopener noreferrer">Full song</a>
                        </div>
                    </>
                )}
                </div>
                )})}
                </div> 
                </div>
                    
                    

                    
                    
                </div>
            )}
        </div>
    )
};

const Footer = (usersOnlineCount) => {

    const [playing, setPlaying] = useState(false);
    
    const [volume, setVolume] = useState(1.0);
    const audioRef = useRef();
    
    let volumeIcon;
    if (volume > 0.5) {
    volumeIcon = <FontAwesomeIcon icon={faVolumeUp} />;
    } else if (volume > 0) {
    volumeIcon = <FontAwesomeIcon icon={faVolumeDown} />;
    } else {
    volumeIcon = <FontAwesomeIcon icon={faVolumeMute} />;
    }


    const togglePlay = () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };
        
        
        
        useEffect(() => {
            audioRef.current.volume = volume;
        }, [volume]);


    const[time, setTime] = useState(new Date())

    useEffect(() => {
        const timerId = setInterval(() => {
        setTime(new Date());
    }, 1000);

    return () => {
        clearInterval(timerId);
    };
    }, []);


    return (
        <div className={styles.footer}> 
            
        <div className={styles.nts}>
            <audio ref={audioRef} src="https://stream-relay-geo.ntslive.net/stream"></audio>
            <button onClick={togglePlay}>{playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</button>
            {volumeIcon}
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(e.target.value)}/>
        </div>
        <p className={styles.middleElement}>© 2023 Neo Cyberia</p>
            <div className={styles.sideElementFooter}>
            <p>Online Users: <span>{usersOnlineCount.usersOnlineCount}</span></p>
            <p>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
        </div>
    );
};



