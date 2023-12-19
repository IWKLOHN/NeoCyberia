import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import styles from './CreateProfileComponent.module.css';






export const CreateProfileComponent = () => {
    // console.log("CreateProfileComponent rendered");
    
    const navigate = useNavigate();
    

    const [birthday, setBirthday] = useState("");
    const [country, setCountry] = useState("");
    const [languages, setLanguages] = useState([]);
    const [currentObsession, setCurrentObsession] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [favoriteArtists, setFavoriteArtists] = useState([]);
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [favoriteAlbums, setFavoriteAlbums] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const tabSwitch = (tabNumber, e) => {
        e.stopPropagation()
        setActiveTab(tabNumber);
    };
    const [activeTab, setActiveTab] = useState(1);


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

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            birthday === "" &&
            country === "" &&
            languages.length === 0 &&
            currentObsession === "" &&
            (profilePictureUrl === "" || profilePictureFile === null) &&
            favoriteArtists.length === 0 &&
            favoriteSongs.length === 0 &&
            favoriteAlbums.length === 0
        ) {
            alert("Please fill out all fields, including either profilePictureFile or profilePictureUrl");
            return;
        }
        let newProfile = new FormData();
        newProfile.append("birthday", birthday);
        newProfile.append("country", country);
        newProfile.append("languages", languages);
        newProfile.append("currentObsession", currentObsession);
        newProfile.append("profilePictureUrl", profilePictureUrl);
        newProfile.append("favoriteArtists", favoriteArtists);
        newProfile.append("favoriteSongs", favoriteSongs);
        newProfile.append("favoriteAlbums", favoriteAlbums);
        if(profilePictureFile){
            newProfile.append("profilePicture", profilePictureFile);
        }
        
        
        const token = Cookies.get("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        
        try {
            const res = await axios.post(
                `http://localhost:8080/create/${userId}`,
                newProfile,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
                

            );
            console.log(res);
            navigate("/main");
        } catch (err) {
            console.log(err);
        }
    };
    

    
    
    
    return (
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
<form onSubmit={handleSubmit}>


<div className={activeTab === 1 ? styles.activeContent : styles.content}> 
<div className={styles.flexSeparator}>
<label htmlFor="birthday" className={styles.bio}>
Birthday:</label>
<input
type="date"
name="birthday"
value={birthday}
onChange={(e) => setBirthday(e.target.value)}

/>
</div>
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
<button type="submit">Create Profile</button>
</form>
</div>
</div>
</div>
    )
};



