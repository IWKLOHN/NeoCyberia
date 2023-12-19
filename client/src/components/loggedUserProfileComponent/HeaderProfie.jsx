import axios from 'axios';
import styles from './HeaderProfile.module.css';
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';







export const HeaderProfile = () => {

    const navigate = useNavigate();
    
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [birthday, setBirthday] = useState("");
    const [country, setCountry] = useState("");
    const [languages, setLanguages] = useState([]);
    const [currentObsession, setCurrentObsession] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [favoriteArtists, setFavoriteArtists] = useState([]);
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [favoriteAlbums, setFavoriteAlbums] = useState([]);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const[profileId, setProfileId] = useState('');

    
    const tabSwitch = (tabNumber, e) => {
        e.stopPropagation()
        setActiveTab(tabNumber);
    };

    
    
    
    
    const handleAddLanguage = (e) => {
        e.preventDefault();
        const inputLanguage = document.getElementById('language').value.trim();
        if (inputLanguage && languages.length < 3) {
            setLanguages([...languages, inputLanguage]);
            document.getElementById('language').value = '';
            setErrorMessage('');
        } else {
            setErrorMessage('Max three languages allowed');
        }
    };

    const handleRemoveLanguage = (index) => {
        const updatedLanguages = [...languages];
        updatedLanguages.splice(index, 1);
        setLanguages(updatedLanguages);
    };

    const handleAddArtist = (e) => {
        e.preventDefault();
        const inputFavoriteArtist = document.getElementById('favArtists').value.trim();
        if (inputFavoriteArtist && favoriteArtists.length < 3) {
            setFavoriteArtists([...favoriteArtists, inputFavoriteArtist]);
            document.getElementById('favArtists').value = '';
            setErrorMessage('');
        } else {
            setErrorMessage('Max three languages allowed');
        }
    };
    
    const handleRemoveArtist = (index) => {
        const updatedFavoriteArtists = [...favoriteArtists];
        updatedFavoriteArtists.splice(index, 1);
        setFavoriteArtists(updatedFavoriteArtists);
    };


    const handleAddFavoriteSong = (e) => {
        e.preventDefault();
        const songName = document.getElementById('songName').value.trim();
        const artistName = document.getElementById('artistNameSong').value.trim();
        if (songName && artistName && favoriteSongs.length < 3) {
            const concatenatedValue = `${songName} by ${artistName}`;
            setFavoriteSongs([...favoriteSongs, concatenatedValue]);
            console.log(favoriteSongs);
            document.getElementById('songName').value = '';
            document.getElementById('artistNameSong').value = '';
            setErrorMessage('');
        } else {
            setErrorMessage('Max three favorite songs allowed');
        }
    };

    const handleRemoveFavoriteSong = (index) => {
        const updatedFavoriteSongs = [...favoriteSongs];
        updatedFavoriteSongs.splice(index, 1);
        setFavoriteSongs(updatedFavoriteSongs);
    };
    
    const handleAddFavoriteAlbum = (e) => {
        e.preventDefault();
        const albumName = document.getElementById('albumName').value.trim();
        const artistName = document.getElementById('artistName').value.trim();
        if (albumName && artistName && favoriteAlbums.length < 3) {
            const concatenatedValue = `${albumName} by ${artistName}`;
            setFavoriteAlbums([...favoriteAlbums, concatenatedValue]);
            console.log(favoriteAlbums);
            document.getElementById('albumName').value = '';
            document.getElementById('artistName').value = '';
            setErrorMessage('');
        } else {
            setErrorMessage('Max three favorite albums allowed');
        }
    };

    const handleRemoveFavoriteAlbum = (index) => {
        const updatedFavoriteAlbums = [...favoriteAlbums];
        updatedFavoriteAlbums.splice(index, 1);
        setFavoriteAlbums(updatedFavoriteAlbums);
    };
    

    
    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/');
    };

    const goToHome = () => {
        navigate('/main');
    };
    
    const getUserAndProfile = async () => {
        const token = Cookies.get("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        try {
            let result = await axios.get(`http://localhost:8080/getUserAndProfileById/${userId}`,
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
    
    const deleteAccount = async () => {
        const token = Cookies.get("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        try {
            let result = await axios.delete(`http://localhost:8080/deleteUserAndProfile/${userId}`,
                {headers: {"Authorization": `Bearer ${token}`}}); 
            console.log(result);
            handleLogout();
        } catch (error) {
            console.log(error);
        }
    };

    const openModal = () => {
        setShowModal(true);
    };
    
    
    const closeModal = () => {
        setShowModal(false);
    };


    
    const handleEditProfile = async (e) => {
        e.preventDefault();
        const token = Cookies.get("token");
        const decoded = jwtDecode(token);
        // const userId = decoded.id;
        const formData = new FormData();
        formData.append('birthday', birthday);
        formData.append('country', country);
        formData.append('currentObsession', currentObsession);
        formData.append('profilePictureUrl', profilePictureUrl);
        formData.append('profilePicture', profilePictureFile);
        formData.append('languages', JSON.stringify(languages));
        formData.append('favoriteArtists', favoriteArtists.join(', '));
        formData.append('favoriteSongs', favoriteSongs.join(', '));
        formData.append('favoriteAlbums', favoriteAlbums.join(', '));
        try {
            let result = await axios.put(`http://localhost:8080/updateProfile/${profileId}`, formData,
                {headers: {"Authorization": `Bearer ${token}`}});
            closeModalEdit();

        } catch (error) {
            console.log(error);
        }
    };















    useEffect(() => {
        getUserAndProfile();

    }, []);


    useEffect(() => {
        if (data.user) {
            setBirthday(data.user.profile.birthday);
            setCountry(data.user.profile.country);
            setLanguages(data.user.profile.languages[0].split(', '));
            setCurrentObsession(data.user.profile.currentObsession);
            setProfilePictureUrl(data.user.profile.profilePictureUrl);
            setProfilePictureFile(data.user.profile.profilePicture);
            setFavoriteArtists(data.user.profile.favoriteArtists[0].split(','));
            setFavoriteSongs(data.user.profile.favoriteSongs[0].split(','));
            setFavoriteAlbums(data.user.profile.favoriteAlbums[0].split(','));
            setProfileId(data.user.profile._id);

            if (data.user.profile.profilePicture) {
                const blob = new Blob([new Uint8Array(data.user.profile.profilePicture.data)], {type: 'image/png'});
                const blobURL = URL.createObjectURL(blob);
                setProfilePictureFile(blobURL);
            }
            // console.log('Alkbums', data.user.profile.favoriteAlbums);
            // console.log('Songs', data.user.profile.favoriteSongs);
            // console.log(data.user.profile.favoriteArtists);
        }
    }, [data]);

    const openModalEdit = () => {
        
        setShowModalEdit(true);
    };

    const closeModalEdit = () => {
        setShowModalEdit(false);
    };



    return(
        <header className={styles.mainContainer}>
            <nav className={styles.navContainer}>
                <div className={styles.left}>
                    <button className={styles.btnDelete} onClick={openModal}>DELETE ACCOUNT</button>
                    <button className={styles.btnEdit} onClick={openModalEdit}>EDIT PROFILE</button>
                    <button onClick={goToHome} className={styles.btnEdit}>HOME</button>
                </div>
                {data.user &&<h1 className={styles.center}>{data.user.username}</h1>}
                <button className={styles.right} onClick={handleLogout}>Logout</button>

                {showModal && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                            <h2>Are you sure you want to delete your account?</h2>
                            <button onClick={deleteAccount} className={styles.btnDeleteAcc}>Yes, delete my account</button>
                            <button onClick={closeModal} className={styles.btnNormal}>No, keep my account</button>
                            </div>
                        </div>
                )}
            </nav>
            
            {showModalEdit && (
                        <div className={styles.modalEdit}>
                            <div className={styles.modalContentEdit}>
                            <div className={styles.tabContainer}>
        <button onClick={(e) => tabSwitch(1, e)} className={activeTab === 1 ? styles.activeTab : styles.tab}>
            Bio
        </button>
        
        <button  onClick={(e) => tabSwitch(2, e)} className={activeTab === 2 ? styles.activeTab : styles.tab}>
            Favorite Artists
        </button>
        <button onClick={(e) => tabSwitch(3, e)} className={activeTab === 3 ? styles.activeTab : styles.tab}>
            Favorite Albums
        </button>
        <button  onClick={(e) => tabSwitch(4, e)} className={activeTab === 4 ? styles.activeTab : styles.tab}>
            Favorite Songs
        </button>
        </div>
            <div>
        <form onSubmit={handleEditProfile}>
        
            
            <div className={activeTab === 1 ? styles.activeContent : styles.content}> 
            <div className={styles.flexSeparator}>
            <label htmlFor="country" className={styles.bio}>
                Country:</label>
                <input
                    type="text"
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder='Enter Country'
                />
            </div>
            <div>
                <div className={styles.doubleInputLanguages}>
                <label className={styles.bio} htmlFor="language">Language:</label >
                <div className={styles.stackInputLanguages}>
                <input type="text" id="language" name="language" />
                </div>
                <button type="button" onClick={handleAddLanguage}>Add Language</button>
                </div>
                <ul>
                    {languages.map((language, index) => (
                        <div className={styles.pruebaFlexLanguages}>
                        <li key={index}>
                            {language}
                        </li>
                            <button type="button" onClick={() => handleRemoveLanguage(index)}>Remove</button>
                        </div>
                    ))}
                </ul>
            </div>
            <div className={styles.flexSeparator}>
            <label htmlFor="currentObsession" className={styles.bio}>
                Current Obsession:</label>
                
                <input
                    type="text"
                    name="currentObsession"
                    value={currentObsession}
                    onChange={(e) => setCurrentObsession(e.target.value)}
                    placeholder='Enter Current Obsession'
                />
            </div>
            <div className={styles.flexSeparator}>
            <label className={styles.bio} htmlFor="profilePictureUrl">
                Profile Picture URL:</label>
                <input
                    type="text"
                    name="profilePictureUrl"
                    value={profilePictureUrl}
                    onChange={(e) => setProfilePictureUrl(e.target.value)}
                    placeholder='Enter Profile Picture URL'
                />
            </div>
            <div  className={styles.flexSeparator}>
            <label className={styles.bio} htmlFor="profilePictureFile">
                Profile Picture File:</label>
                <img style={{height:'100px', borderRadius: '50%', marginRight:'50px'}} src={profilePictureFile ? profilePictureFile : defaultImage} alt="Profile" />
                <p>{profilePictureFile ? 'File uploaded' : 'No file uploaded'}</p>
                <input
                    type="file"
                    name="profilePictureFile"
                    onChange={(e) => setProfilePictureFile(e.target.files[0])}
                    
                />
            </div>
            </div>
            <div className={activeTab === 2 ? styles.activeContent : styles.content}>
            
            <div>
            <div className={styles.doubleInput}>
                <label className={styles.bio} htmlFor="favArtists">Favorite Artists:</label>
                <div className={styles.stackInput}>
                <input type="text" id="favArtists" name="favArtists" placeholder='Enter artist name' />
                </div>
                <button type="button" onClick={handleAddArtist}>Add Artist</button>
                </div>  
                <ul>
                    {favoriteArtists.map((artist, index) => (
                        <div className={styles.pruebaFlex}>
                        <li key={index}>
                            {artist}
                        </li>
                            <button type="button" onClick={() => handleRemoveArtist(index)}>Remove</button>
                        </div>                    
                    ))}
                </ul>
            </div>
            </div>
            <div className={activeTab === 3 ? styles.activeContent : styles.content} >
            
            <div>
            <div className={styles.doubleInput}>
                <label className={styles.bio} htmlFor="albumName">Favorite Albums:</label>
                <div className={styles.stackInput}>
                    <input type="text" id="albumName" name="albumName" placeholder='Enter album name' />
                    <label htmlFor="artistName">by</label>
                    <input type="text" id="artistName" name="artistName" placeholder='Enter artist name' />
                </div>
                    <button type="button" onClick={handleAddFavoriteAlbum}>Add</button>
                </div>
                <ul>
                    {favoriteAlbums.map((song, index) => (
                        <div className={styles.pruebaFlex}>
                        <li key={index}>
                            {song}
                            </li>
                            <button type="button" onClick={() => handleRemoveFavoriteAlbum(index)}>Remove</button>
                            </div>
                        
                    ))}
                </ul>
            </div>
            </div>
            <div className={activeTab === 4 ? styles.activeContent : styles.content} >
            
            <div>
                <div className={styles.doubleInput}>
                    <label className={styles.bio} htmlFor="songName">Favorite Songs:</label>
                    <div className={styles.stackInput}>
                    <input type="text" id="songName" name="songName" placeholder='Enter song name' />
                    <label  htmlFor="artistNameSong">by</label>
                    <input type="text" id="artistNameSong" name="artistNameSong" placeholder='Enter artist name' />
                    </div>
                    <button type="button" onClick={handleAddFavoriteSong}>Add</button>
                </div>
                <ul>
                    {favoriteSongs.map((song, index) => (
                        <div className={styles.pruebaFlex}>
                        <li key={index} className={styles.bio}>
                            {song}
                        </li>
                            <button type="button" onClick={() => handleRemoveFavoriteSong(index)}>Remove</button>
                            </div>
                    ))}
                </ul>
            </div>
            </div>
            <button onClick={closeModalEdit}>Close</button>
            <button type="submit">Update Profile</button>
        </form>
        </div>
        </div>
        </div>
            
            
            )} 
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            


        </header>
    )
};
            
    
            
    
            
    
            
    
