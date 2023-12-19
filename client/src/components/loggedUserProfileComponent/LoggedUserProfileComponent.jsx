import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import styles from './LoggedUserProfileComponent.module.css';
import { HeaderProfile } from './HeaderProfie';



export const LoggedUserProfileComponent = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [artistPhotos, setArtistPhotos] = useState([]);
    const [albumCovers, setAlbumCovers] = useState([]);
    const [songPreviews, setSongPreviews] = useState([]);
    const [showSongPreviews, setShowSongPreviews] = useState(false);
    const [showFavoriteAlbums, setShowFavoriteAlbums] = useState(false);
    const [showFavoriteArtists, setShowFavoriteArtists] = useState(false);

    const songPreviewsRef = useRef(null);
    const favoriteArtistsRef = useRef(null);
    const favoriteAlbumsRef = useRef(null);

    const getUserAndProfile = async () => {
        const token = Cookies.get("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        try {
            let result = await axios.get(`http://localhost:8080/getUserAndProfileById/${userId}`,
                {headers: {"Authorization": `Bearer ${token}`}}); 
            
            const profilePictureUrl = result.data.user.profile.profilePictureUrl || null;
            const profilePicture = result.data.user.profile.profilePicture ? result.data.user.profile.profilePicture.data : null;
            
            if (profilePictureUrl) {
                setData({...result.data, profilePicture: profilePictureUrl});
                return;
            }else if (profilePicture) 
            {const blob = new Blob([new Uint8Array(profilePicture)], {type: 'image/png'});
            const blobURL = URL.createObjectURL(blob);
            
            setData({...result.data, profilePicture: blobURL});
            
        }
        
        } catch (error) {
            console.log(error);
        }
    };
    
    

    

    const getAlbumCoverAndLink = async (albumName, artistName) => {
        try {
            const response = await axios.get(`http://localhost:8080/deezer/search/album?q=${albumName}`);
            if (response.data.data.length > 0) {
                const album = response.data.data.find(album => album.artist.name.toLowerCase() === artistName.toLowerCase());
                if (album) {
                    let cover = album.cover;
                    cover = cover.replace('-small', '-xl');
                    const link = album.link; // Get the album's link
                    return { 
                        cover, 
                        albumName: album.title, 
                        artistName: album.artist.name, 
                        link // Return the link
                    }; 
                } else {
                    console.log('No album found by that artist');
                    return {
                        error: true,
                        albumName: albumName,
                        artistName: artistName
                    };
                }
            } else {
                console.log('No album found');
                return {
                    error: true,
                    albumName: albumName,
                    artistName: artistName
                };
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const getArtistPhotoAndLink = async (artistName) => {
        try {
            const response = await axios.get(`http://localhost:8080/deezer/search/artist?q=${artistName}`);
            if (response.data.data.length > 0) {
                const artist = response.data.data[0];
                let picture = artist.picture;
                picture = picture.replace('-small', '-xl');
                const link = artist.link; 
                return { picture, artistName, link }; 
            } else {
                console.log('No artist found');
                return {
                    error: true,
                    artistName: artistName
                };
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getSongPreviewAndLink = async (songName, artistName) => {
        try {
            const response = await axios.get(`http://localhost:8080/deezer/search?q=${songName}`);
            if (response.data.data.length > 0) {
                const song = response.data.data.find(song => song.artist.name.toLowerCase() === artistName.toLowerCase());
                if (song) {
                    return { 
                        preview: song.preview, 
                        songName: song.title, 
                        artistName: song.artist.name, 
                        link: song.link 
                    };
                } else {
                    console.log('No song found by that artist');
                    return {
                        error: true,
                        songName: songName,
                        artistName: artistName
                    };
                }
            } else {
                console.log('No song found');
                return {
                    error: true,
                    songName: songName,
                    artistName: artistName
                };
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const birthday = new Date(data.user?.profile?.birthday);
    const age = new Date().getFullYear() - birthday.getFullYear();

    useEffect(() => {
        getUserAndProfile()
        console.log(data);

    }, []);


    
    useEffect(() => {
        if(data?.user?.profile){
        const favArtists = data.user.profile.favoriteArtists[0].split(',');
        const favAlbums = data.user.profile.favoriteAlbums[0].split(/by|,/);
        console.log(favAlbums);
        const favSongs = data.user.profile.favoriteSongs[0].split(/by|,/);
        
        Promise.all(favArtists.map(name => getArtistPhotoAndLink(name)))
        .then(artists => {
            setArtistPhotos(artists);
        });
        
        const albumCoversPromises = [];
        for (let i = 0; i < favAlbums.length; i += 2) {
            const albumName = favAlbums[i].trim();
            const artistName = favAlbums[i + 1].trim();
            albumCoversPromises.push(getAlbumCoverAndLink(albumName, artistName));
        }
        Promise.all(albumCoversPromises)
            .then(albums => {
                setAlbumCovers(albums);
            });
        
            const songPreviewsPromises = [];
            for (let i = 0; i < favSongs.length; i += 2) {
                const songName = favSongs[i].trim();
                const artistName = favSongs[i + 1].trim();
                songPreviewsPromises.push(getSongPreviewAndLink(songName, artistName));
            }
            Promise.all(songPreviewsPromises)
    .then(songsInfo => {
        const validSongsInfo = songsInfo.filter(song => song !== undefined);
        setSongPreviews(validSongsInfo);
            });
        }
    },[data]);


    useEffect(() => {
        if (showSongPreviews && songPreviewsRef.current) {
            songPreviewsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showSongPreviews]);
        
    useEffect(() => {
        if (showFavoriteArtists && favoriteArtistsRef.current) {
            favoriteArtistsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showFavoriteArtists]);
    
    useEffect(() => {
        if (showFavoriteAlbums && favoriteAlbumsRef.current) {
            favoriteAlbumsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showFavoriteAlbums]);



    

    return (
        <div>
            
            <HeaderProfile/>
            <div className={styles.container}>
                <div className={styles.mainFlexContainer}>
                    
                    
                    
                    
                    <div className={styles.imgContainer}>
                        <img src={data.profilePicture ? data.profilePicture : data.profilePictureUrl}
                            alt='Profile Picture' />
                    </div>
                



















            <div className={styles.leftContents}>
                <div>
                    <h1 className={styles.subTitles}>Bio</h1>
                    <hr />
                    <p className={styles.bio}>{`Age: ${age}`}</p>
                    <p className={styles.bio}>{`Birthday: ${new Date (data.user?.profile?.birthday).toLocaleDateString()}`}</p>
                    <p className={styles.bio}>{`Country: ${data.user?.profile?.country}`}</p>
                    <p className={styles.bio}>{`Languages: ${data.user?.profile?.languages}`}</p>
                    <p className={styles.bio}>{`Current Obesession: ${data.user?.profile.currentObsession}`}</p>
                    
                </div>
                
            <button className={styles.subTitles} onClick={() => setShowFavoriteArtists(!showFavoriteArtists)}>Favorite Artists</button>
                <hr />
                <div className={styles.leftContentArtist} ref={favoriteArtistsRef}>
            {/* GET ARTIST PHOTO */}
            {showFavoriteArtists && artistPhotos.map((artist, index) => (
            <div key={index} className={`${styles.artist} ${showFavoriteArtists ? styles.showArtist : ''}`}>
                {artist.error ? (
                    <p>Could not retrieve artist "{artist.artistName}"</p>
                ) : (
                    <>
                        <p>{artist.artistName}</p>
                        <a href={artist.link} target="_blank" rel="noopener noreferrer" className= {styles.imgAnimation}>
                            <img src={artist.picture} alt={`Picture of ${artist.artistName}`} />
                        </a>
                        
                    </>
                )}
            </div>
        ))}
            </div>
            <button className={styles.subTitles} onClick={() => setShowFavoriteAlbums(!showFavoriteAlbums)}>Favorite Albums</button>
            <hr />
            <div className={styles.leftContentAlbum} ref={favoriteAlbumsRef}>
        {/* GET ALBUM COVERS */}
        {showFavoriteAlbums && albumCovers.map((album, index) => (
            <div key={index} className={`${styles.album} ${showFavoriteAlbums ? styles.showAlbum : ''}`}>
                {album.error ? (
                    <p>Could not retrieve album "{album.albumName}" by "{album.artistName}"</p>
                ) : (
                    <>
                        <p>{album.albumName}</p>
                        <label>{album.artistName}</label>
                        <a href={album.link} target="_blank" rel="noopener noreferrer" className= {styles.imgAnimation}>
                            <img src={album.cover} alt={`Cover of ${album.albumName}`} />
                        </a>
                        
                    </>
                )}
            </div>
        ))}
        </div>
        <button className={styles.subTitles} onClick={() => setShowSongPreviews(!showSongPreviews) }>Favorite Songs</button>
        <hr />
        <div className={styles.leftContentSongs} ref={songPreviewsRef}>
        {/* GET SONG PREVIEWS */}
        {showSongPreviews && songPreviews.map((song, index) => (
            <div key={index} className={`${styles.songPreview} ${showSongPreviews ? styles.showSongPreview : ''}`}>
                {song.error ? (
                    <p>Could not retrieve song "{song.songName}" by "{song.artistName}"</p>
                ) : (
                    <>
                        <div>
                        <p>{song.songName} - <span>{song.artistName}</span></p>
                        
                        </div>
                        
                        <div>
                        <audio controls>
                            <source src={song.preview} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        </div>
                        <a href={song.link} target="_blank" rel="noopener noreferrer">Listen to full song</a>
                    </>
                )}
            </div>
        ))}
        </div>
            </div>
            
            </div>
        </div>
    </div>


    )
}





