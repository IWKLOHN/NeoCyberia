import axios from 'axios';
import styles from './HeaderOtherProfiles.module.css';
import {useNavigate, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';







export const HeaderOtherProfile = () => {

    const navigate = useNavigate();
    const params = useParams();
    const otherId = params.id;
    const [data, setData] = useState([]);
    

    
    
    
    





    
    const getUserAndProfile = async () => {
        const token = Cookies.get("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        try {
            let result = await axios.get(`http://localhost:8080/getUserAndProfileById/${otherId}`,
                {headers: {"Authorization": `Bearer ${token}`}}); 
            //console.log(result);
            const profilePictureUrl = result.data.user.profile.profilePictureUrl || null;
            const profilePicture = result.data.user.profile.profilePicture ? result.data.user.profile.profilePicture.data : null;
            //const profilePicture = result.data.user.profile.profilePicture.data
            
            if (profilePictureUrl) {
                setData({...result.data, profilePicture: profilePictureUrl});
                return;
            }else if (profilePicture) 
            {const blob = new Blob([new Uint8Array(profilePicture)], {type: 'image/png'});
            const blobURL = URL.createObjectURL(blob);
            //console.log(blobURL);
            setData({...result.data, profilePicture: blobURL});
        }
        } catch (error) {
            console.log(error);
        }
    };
    


    useEffect(() => {
        getUserAndProfile();

    }, []);

    
    const goToHome = () => {
        navigate("/main");
    }

    const handleLogout = () => {
        Cookies.remove("token");
        navigate("/");
    }


















    return(
        <header className={styles.mainContainer}>
            <nav className={styles.navContainer}>
                <div className={styles.left}>
                    <button onClick={goToHome} className={styles.btnEdit}>HOME</button>
                </div>
                {data.user &&<h1 className={styles.center}>{data.user.username}</h1>}
                <button className={styles.right} onClick={handleLogout}>Logout</button>

                
            </nav>
            
            
            
            
            
            
            
            
            
            
            
            
            


        </header>
    )
};
            
    
            
    
            
    
            
    
