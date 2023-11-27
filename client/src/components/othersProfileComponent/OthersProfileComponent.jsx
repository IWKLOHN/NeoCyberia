import styles from './OthersProfileComponent.module.css';
import {jwtDecode} from 'jwt-decode';
import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import Cookies from "js-cookie";



export const OthersProfileComponent = () => {
    
    
    
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [decodedToken, setDecodedToken] = useState(null)
    
    
    


    
    
    
    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };
    
    
    

    const decodeToken = () => {
        const token = Cookies.get("token");
        console.log('Token: ', token);
        if(token){
            const decoded = jwtDecode(token);
            console.log('Decoded Token: ', decoded);

            setDecodedToken(decoded)
        }else{
            console.log('No token found');
        }
    }

    
    
    
    
    useEffect(()=>{
        decodeToken()
    },[])
    
    
    
    return (
        <div>
            {decodedToken &&(
    <Draggable position={position} onDrag={handleDrag} bounds="body" handle='.handle'>
        
        <div className={styles.container}>
            <div className= {`${'handle'} ${styles.handle1}`}>{decodedToken.username}</div>
        </div>
        
    </Draggable>
    )}
    </div>
            
    )
};