import styles from './ChatComponent.module.css';
import { useState, useEffect, useRef, Fragment } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from "js-cookie";



export const MainComponent = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleShowProfile = (userId) => {
        setSelectedUser(prevUserId => {
            return prevUserId === userId ? null : userId;
        });
    };

    return (
        <Fragment>
        <ChatComponent handleShowProfile={handleShowProfile} />
        <RenderProfiles 
            selectedUser={selectedUser} 
            handleShowProfile={handleShowProfile} />
        </Fragment>
    )
}















const RenderProfiles = ({selectedUser, handleShowProfile}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [decodedToken, setDecodedToken] = useState(null)
    
    
    


    
    
    
    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };
    
    
    

    const decodeToken = () => {
        const token = Cookies.get("token");
        //console.log('Token: ', token);
        if(token){
            const decoded = jwtDecode(token);
            //console.log('Decoded Token: ', decoded);

            setDecodedToken(decoded)
        }else{
            console.log('No token found');
        }
    }

    useEffect(()=>{
        decodeToken()
    },[])
    
    
    
    
    
    
    
    return (
        
            
        <Draggable 
            position={position} 
            onDrag={handleDrag} 
            bounds="body" 
            handle='.handle'>
        
        <div className={styles.container}>
            <div className= {`${'handle'} ${styles.handle1}`}>Handle</div>
        </div>
        
    </Draggable>
    
    
            
    )
};






const ChatComponentOld = ({handleShowProfile}) => {

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
    const [messages, setMessages] = useState([]);
    
    //TABS
    const [activeTab, setActiveTab] = useState(1);
    // Funcion para cambiar de tab.
    const tabSwitch = (idx) => {    
        setActiveTab(idx);
    }
    
    
    
    //DRAGGABLE
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // Funcion para mover el componente.
    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };
    
    const [loggedUser, setLoggedUser] = useState(''); // Aqui guardando el usuario logueado.
    const [users, setUsers] = useState([]); // Aqui guardando todos los usuarios.
    const [user, setUser] = useState([]); // Aqui guardando un usuario.

    // Funcion para obtener todos los usuarios.
    const getAllUsers = async() => {
        const token = getCookie('token');
        try {
            const result = await axios.get('http://localhost:8080/getAllUsers',
            {headers: {Authorization: `Bearer ${token}`}});
            //console.log('Result: ', result.data.users);
    
            const usersWithProfilePictures = result.data.users.map(user => {
                const profilePictureUrl = user.profile.profilePictureUrl || null;
                const profilePicture = user.profile.profilePicture ? user.profile.profilePicture.data : null;
    
                if(profilePictureUrl){
                    return {...user, profilePicture: profilePictureUrl};
                }
                else if(profilePicture){
                    const blob = new Blob([new Uint8Array(profilePicture)], {type: 'image/png'});
                    const blobUrl = URL.createObjectURL(blob);
                    return {...user, profilePicture: blobUrl};
                }
    
                return user; // Return the user object as is if there's no profile picture
            });
    
            setUsers(usersWithProfilePictures);
        } catch (error) {
            console.log('Error en getAllProfiles= ',error);
        }
    }
    
    useEffect(() => {
        getAllUsers();
        const token = getCookie('token');
        const decoded = jwtDecode(token);
        setLoggedUser(decoded.username);
    }, []);
    
    






    // Aqui enviando mensajes a otro cliente.
    const handleSend = (e) => { 
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
    
    // Aqui recibiendo mensajes desde otro cliente.
    useEffect(() => { 
        if(socket){
        socket.on("message", recieveMessage);
        }
        return()=>{
            if(socket){
                socket.off("message", recieveMessage);
            }
        }
    }, [socket, recieveMessage])


    // const [selectedUser, setSelectedUser] = useState(null); // Aqui guardando el usuario seleccionado.

    // const handleShowProfile = (userId) => {
    //     setSelectedUser(prevUserId => prevUserId === userId ? null : userId);
    //     console.log(selectedUser);
    // }

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
                                                                onClick={() => handleShowProfile(user._id)}
                                                            />
                                                        </div>
                                                        {user.username}
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
};