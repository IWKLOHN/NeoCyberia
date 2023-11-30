import axios from 'axios';
import styles from './headerComponent.module.css';
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';



export const HeaderComponent = () => {

    const navigate = useNavigate();
    
    const [data, setData] = useState([]);
    
    
    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/');
    };
    
    const getUserAndProfile = async () => {
        const token = Cookies.get("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        try {
            let result = await axios.get(`http://localhost:8080/getUserAndProfileById/${userId}`,
                {headers: {"Authorization": `Bearer ${token}`}}); 
            const profilePicture = result.data.user.profile.profilePicture.data; 
            const blob = new Blob([new Uint8Array(profilePicture)], {type: 'image/png'});
            const blobURL = URL.createObjectURL(blob);
            //console.log(blobURL);
            setData({...result.data, profilePicture: blobURL});
        } catch (error) {
            console.log(error);
        }
    };
    
            
    
            
    
            
    


    useEffect(() => {
        getUserAndProfile();

    }, []);




    return(
        <header className={styles.mainContainer}>
            <nav className={styles.navContainer}>
                <div className={styles.left}>
                    <a className={styles.imgContainer} href=''>
                        <img src={data.profilePicture}
                            alt='Profile Picture' />
                    </a>
                    {data.user &&<a href=''>{data.user.username}</a>}
                </div>
                <h1 className={styles.center}>Neo Cyberia</h1>
                <button className={styles.right} onClick={handleLogout}>Logout</button>
            </nav>
        </header>
    )
};