import axios from 'axios';
import { useEffect, useState, useRef } from 'react';


export const PruebaApi = () => {
    
    
    const [albumCover, setAlbumCover] = useState('');
    const [artistPhoto, setArtistPhoto] = useState('');
    const [artistPhotos, setArtistPhotos] = useState([]);
    const [songPreview, setSongPreview] = useState('');



    const getAlbumCover = async (albumName, artistName) => {
        try {
            const response = await axios.get(`http://localhost:8080/deezer/search/album?q=${albumName}`);
            if (response.data.data.length > 0) {
                const album = response.data.data.find(album => album.artist.name.toLowerCase() === artistName.toLowerCase());
                if (album) {
                    let cover = album.cover;
                    cover = cover.replace('-small', '-xl');
                    return cover;
                } else {
                    console.log('No album found by that artist');
                }
            } else {
                console.log('No album found');
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const getArtistPhoto = async (artistName) => {
        try {
        const response = await axios.get(`http://localhost:8080/deezer/search/artist?q=${artistName}`);
        if (response.data.data.length > 0) {
            let picture = response.data.data[0].picture;
            picture = picture.replace('-small', '-xl');
            return picture;
        } else {
            console.log('No artist found');
        }
        } catch (error) {
        console.log(error);
        }
    };

    const getSongPreview = async (songName, artistName) => {
        try {
            const response = await axios.get(`http://localhost:8080/deezer/search/track?q=track:"${songName}" artist:"${artistName}"`);
            const song = response.data.data.find(song => song.title.toLowerCase() === songName.toLowerCase() && song.artist.name.toLowerCase() === artistName.toLowerCase());
            if (song) {
                return song.preview;
            } else {
                console.log('No song found');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const artistNames = ['sega bodega', 'Björk', 'Rosalia'];
    
    useEffect(() => {
        getAlbumCover('Blue' , 'Joni Mitchell').then(cover => setAlbumCover(cover));
        Promise.all(artistNames.map(name => getArtistPhoto(name)))
        .then(photos => setArtistPhotos(photos));
        getSongPreview('la noche de anoche', 'Bad Bunny').then(preview => setSongPreview(preview));
    }, []);
    
    
    const [playing, setPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [volume, setVolume] = useState(1.0);
const audioRef = useRef();

const togglePlay = () => {
    if (playing) {
        audioRef.current.pause();
    } else {
        audioRef.current.play();
    }
    setPlaying(!playing);
};
    
    useEffect(() => {
        const audio = audioRef.current;
        const updateTime = () => setCurrentTime(audio.currentTime);
        audio.addEventListener('timeupdate', updateTime);
        return () => audio.removeEventListener('timeupdate', updateTime);
    }, []);
    
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);
    
    
    
    
    return (
        <div>
            <img src={albumCover} alt="Album Cover" style={{height: '100px'}} />
            {artistPhotos.map((photo, index) => (
            <img key={index} src={photo} alt="Artist Photo" style={{height: '100px'}} />
        ))}
        <audio src={songPreview} controls/>
        <div>HOLA</div>
        <input type="text"  placeholder="Song Name" />
        <label style={{ margin: '0 10px' }}>by</label>
        <input type="text" placeholder="Artist Name" />
        <audio ref={audioRef} src="https://stream-relay-geo.ntslive.net/stream"></audio>
        <button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button>
        <div>Current time: {currentTime.toFixed(2)} seconds</div>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(e.target.value)} />
        </div>
    )
};