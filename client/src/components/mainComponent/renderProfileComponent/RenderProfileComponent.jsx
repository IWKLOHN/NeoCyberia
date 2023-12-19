import Draggable from "react-draggable"
import styles from './RenderProfileComponent.module.css';
import {Fragment, useEffect, useState} from 'react';



export const RenderProfileComponent = ({user, loggedUser, handleShowProfile, selectedUser, position, getRandomPosition, componentWidth, componentHeight}) => {

    const [currentPosition, setCurrentPosition] = useState(position);
    const handleDrag = (e, data) => {
        setCurrentPosition({ x: data.x, y: data.y });
    };
    
    const birthday = new Date(user?.profile?.birthday);
    const age = new Date().getFullYear() - birthday.getFullYear();
    

    
    
    
    
    
    return(
        <Fragment>
            
            {user? (
                <Draggable 
                position={currentPosition} 
                onDrag={handleDrag} 
                bounds="body" 
                handle='.handle'>
                <div className={styles.container}>
                    <div className= {`${'handle'} ${styles.handle1}`}>{user.username}</div>
                        <div className={styles.flexContainer}>
                        <div>
                    <h1 className={styles.subTitles}>Bio</h1>
                    <hr />
                    <p className={styles.bio}>{`Age: ${age}`}</p>
                    <p className={styles.bio}>{`Birthday: ${new Date (user?.profile?.birthday).toLocaleDateString()}`}</p>
                    <p className={styles.bio}>{`Country: ${user?.profile?.country}`}</p>
                    <p className={styles.bio}>{`Languages: ${user?.profile?.languages}`}</p>
                    <p className={styles.bio}>{`Current Obesession: ${user?.profile.currentObsession}`}</p>
                    
                </div> 
                            
                            
                            <div className={styles.buttonContainer}>
                                <button className={styles.button} onClick={()=> handleShowProfile(user._id)}>Close</button>
                            </div>
                        </div>
                </div>
                </Draggable>
            ) : null}
            
            

            
        
    </Fragment>
    )
}