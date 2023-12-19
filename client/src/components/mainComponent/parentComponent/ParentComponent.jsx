import axios from "axios";
import { Fragment, useEffect, useState, useRef } from "react";
import {jwtDecode} from 'jwt-decode';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import styles from './ParentComponent.module.css';

import { ChatComponent } from "../../chatComponent/ChatComponent.jsx";





export const ParentComponent = () => {

    const ref = useRef();
    const [loggedUser, setLoggedUser] = useState(''); // Aqui guardando el usuario logueado.
    const [loggedUserId, setLoggedUserId] = useState(''); // Aqui guardando el id del usuario logueado.
    const [users, setUsers] = useState([]); // Aqui guardando todos los usuarios.
    const [user, setUser] = useState([]); // Aqui guardando un usuario.
    const navigate = useNavigate();


    const getAllUsers = async() => {
        const token = Cookies.get('token');
        try {
            const result = await axios.get('http://localhost:8080/getAllUsers',
            {headers: {Authorization: `Bearer ${token}`}});
    
            const usersWithProfilePictures = result.data.users.map(user => {
                if (user.profile) {
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
                }
    
                return user; 
            });
    
            setUsers(usersWithProfilePictures);
        } catch (error) {
            console.log('Error en getAllProfiles= ',error);
        }
    };

    useEffect(() => {
        getAllUsers();
        const token = Cookies.get('token');
        const decoded = jwtDecode(token);
        setLoggedUser(decoded.username);
        setLoggedUserId(decoded.id);
    }, []);



    const handleShowProfile = (userId) => {
        navigate(`/others-profile/${userId}`);
    };


    
    
    return(
        <Fragment>
            <div className={styles.parentContainer} ref={ref}>
            
            <ChatComponent
            handleShowProfile={handleShowProfile}
            users={users} 
            loggedUser={loggedUser}
            loggedUserId={loggedUserId}/>
            
            
            
            </div>
        </Fragment>
    )
};