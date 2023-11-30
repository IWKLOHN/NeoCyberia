import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterLoginComponent.module.css';
import {jwtDecode} from 'jwt-decode';



export const RegisterLoginComponent = () => {
    
    axios.defaults.withCredentials = true;

    const navigate = useNavigate();

    {/**REGISTER STATES */}
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    {/**LOGIN STATES */}
    const [loginInput, setLoginInput] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    {/**MODAL/TABS STATES */}
    const [activeTab, setActiveTab] = useState(1);
    const [modal, setModal] = useState(false);
    
    
    const handleRegister = async (e) => {
        e.preventDefault();
        if(username === '' || email === '' || password === '' || confirmPassword === '') {
            alert('Please fill in all fields');
            return;
        }
        if(password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            let newUser = {
                "username": username,
                "email": email,
                "password": password,
            };
            let result = await axios.post("http://localhost:8080/register", newUser);
            if(result.status !== 201) {
                alert('Something went wrong');
                return;
            }
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            showModal();
            setActiveTab(1);
        } catch (error) {
            alert(error.response.data.message);
        }
        
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if(loginInput === '' || loginPassword === '') {
            alert('Please fill in all fields');
            return;
        }
        let user ={
            "username": loginInput,
            "email": loginInput,
            "password": loginPassword,
        };
        try {
            let result = await axios.post("http://localhost:8080/login", user);
            console.log(result);
            if(result.status !== 200) {
                alert('Something went wrong');
                return;
            }
            const decoded = jwtDecode(result.data.token);
            
            if(decoded.profileCreated === false){
                navigate('/create-profile');
                
            }else{
                navigate('/main');
            }
        } catch (error) {
            alert(error);
        }
    }
    
    const tabSwitch = (idx) => {
        setActiveTab(idx);
    }
    
    const showModal = () => {
        setModal(!modal);
    }


    return (
        <div className={styles.mainContainer}>
            
            {/* TABS */ }
            <div className={styles.tabContainer}>
                <button onClick={() => tabSwitch(1)} 
                    className={activeTab === 1 ? styles.activeTab : styles.tab}>Login</button>
                <button onClick={() => tabSwitch(2)} 
                    className={activeTab === 2 ? styles.activeTab : styles.tab}>Register</button>
            </div>
                
                
                
        
                {/* LOGIN */ }
            
                <form onSubmit={handleLogin} 
                    className={activeTab === 1 ? styles.activeContent : styles.content}>
                    <label htmlFor="loginInput">Username or Email:</label>
                        <input type="text" 
                            placeholder='Enter Username or Email'
                            value={loginInput} 
                            onChange={(e) => setLoginInput(e.target.value)} />
                    <label htmlFor="loginPassword">Password:</label>
                        <input type="password" 
                            placeholder='Enter Password'
                            value={loginPassword} 
                            onChange={(e) => setLoginPassword(e.target.value)} />
                    <button>Login</button>
                </form>
                                    
                
                {/* REGISTER */ }
                <form onSubmit={handleRegister} 
                    className={ activeTab === 2 ? styles.activeContent : styles.content} >
                    <label htmlFor="username">Username:</label>
                        <input type="text" 
                            placeholder='Enter Username'
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="email">Email:</label>
                        <input type="email" 
                            placeholder='Enter Email'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password">Password:</label>
                        <input type="password" 
                            placeholder='Enter Password'
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input type="password" 
                            placeholder='Confirm Password'
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button>Register</button>
                </form>

                {/* MODAL */ }
                {modal && (
                    <div className={styles.modal}>
                    <div onClick= {showModal} className={styles.overlay}></div>
                    <div className={styles.modalContent}>
                        <h1>Registration Succesful, please log in</h1>
                        <button 
                        onClick={showModal}
                        className={`${styles.closeModal} ${styles.btnModal}`}>
                            Go To Login</button>
                    </div>
                </div>
                ) }
                
                
                
            
                
                
                
                
                
        </div>
    )
}

