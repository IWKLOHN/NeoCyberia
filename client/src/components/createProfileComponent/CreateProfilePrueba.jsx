import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const CreateProfilePrueba = () => {
    const navigate = useNavigate();
    const [birthday, setBirthday] = useState('');
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState('');
    const [currentObsession, setCurrentObsession] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [favoriteArtists, setFavoriteArtists] = useState([]);
    const [favoriteGenres, setFavoriteGenres] = useState([]);
    const [favoriteAlbums, setFavoriteAlbums] = useState([]);
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submitting', favoriteSongs);
    };

    const handleAddFavoriteSong = (e) => {
        e.preventDefault();
        const songName = document.getElementById('songName').value.trim();
        const artistName = document.getElementById('artistName').value.trim();
        if (songName && artistName && favoriteSongs.length < 3) {
            const concatenatedValue = `${songName} by ${artistName}`;
            setFavoriteSongs([...favoriteSongs, concatenatedValue]);
            console.log(favoriteSongs);
            document.getElementById('songName').value = '';
            document.getElementById('artistName').value = '';
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



    useEffect(() => {
        // console.log(languages);
        console.log(favoriteSongs, favoriteAlbums);
    }, [favoriteSongs, favoriteAlbums]);

    return(
        <div>
            <form onSubmit={handleSubmit}>
        
                
            <label htmlFor="songName">Song Name:</label>
                <input type="text" id="songName" name="songName" />
                <label htmlFor="artistName">by</label>
                <input type="text" id="artistName" name="artistName" />
                <button type="button" onClick={handleAddFavoriteSong}>Add Song</button>

                <ul>
                    {favoriteSongs.map((song, index) => (
                        <li key={index}>
                            {song}
                            <button type="button" onClick={() => handleRemoveFavoriteSong(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                <label htmlFor="albumName">Album Name:</label>
                <input type="text" id="albumName" name="albumName" />
                <label htmlFor="artistName">by</label>
                <input type="text" id="artistName" name="artistName" />
                <button type="button" onClick={handleAddFavoriteAlbum}>Add Album</button>

                <ul>
                    {favoriteAlbums.map((song, index) => (
                        <li key={index}>
                            {song}
                            <button type="button" onClick={() => handleRemoveFavoriteAlbum(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            
        
            
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                <button>Create Profile</button>
            </form>
        </div>
    )
};