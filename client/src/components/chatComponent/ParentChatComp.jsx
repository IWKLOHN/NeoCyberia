import { HeaderComponent } from "../../components/headerComponent/HeaderComponent";
import { ParentComponent } from "../../components/mainComponent/parentComponent/ParentComponent";
import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { ChatComponent } from "../../components/chatComponent/ChatComponent";
import { SocketContext } from "../../context/SocketContext";

export const ParentChatComp = () => {
    const [loggedUser, setLoggedUser] = useState(''); // Aqui guardando el usuario logueado.
    const [loggedUserId, setLoggedUserId] = useState(''); // Aqui guardando el id del usuario logueado.
    const [users, setUsers] = useState([]); // Aqui guardando todos los usuarios.
    const [user, setUser] = useState(null); // Aqui guardando un usuario.
    const [artistPhotos, setArtistPhotos] = useState([]);
    const [albumCovers, setAlbumCovers] = useState([]);
    const [songPreviews, setSongPreviews] = useState([]);

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
    

    
        const birthday = new Date(users.user?.profile?.birthday);
        const age = new Date().getFullYear() - birthday.getFullYear();
        








    useEffect(() => {
        getAllUsers();
        const token = Cookies.get('token');
        const decoded = jwtDecode(token);
        setLoggedUser(decoded.username);
        setLoggedUserId(decoded.id);
    }, []);


    

    useEffect(() => {
        if(user?.profile){
            const favArtists = user.profile.favoriteArtists[0].split(',');
            const favAlbums = user.profile.favoriteAlbums[0].split(/by|,/);
            const favSongs = user.profile.favoriteSongs[0].split(/by|,/);
            
        
        Promise.all(favArtists.map(name => getArtistPhotoAndLink(name)))
        .then(artists => {
            setArtistPhotos(artists);
            console.log('ARTISTS',artists)
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
    },[user]);


    const handleShowProfile = (userId) => {
        const selectedUser = users.find(user => user._id === userId);
        setUser(selectedUser);
        console.log('selected user', selectedUser);
    };

    return(
        <div>
            <div>
            <HeaderComponent/>
            </div>
            <div>
            <ChatComponent
                    handleShowProfile={handleShowProfile}
                    users={users} 
                    loggedUser={loggedUser}
                    loggedUserId={loggedUserId}
                    selectedUser={user}
                    artistPhotos={artistPhotos}
                    albumCovers={albumCovers}
                    songPreviews={songPreviews}
                    
                    />
            </div>
        </div>
    )
}
