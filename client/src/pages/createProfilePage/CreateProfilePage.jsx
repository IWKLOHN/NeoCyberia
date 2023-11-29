import styles from "./CreateProfilePage.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";




export const CreateProfilePage = () => {
    
    const navigate = useNavigate();

    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [country, setCountry] = useState("");
    const [languages, setLanguages] = useState([""]);
    const [currentObsession, setCurrentObsession] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [favoriteArtists, setFavoriteArtists] = useState([""]);
    const [favoriteAlbums, setFavoriteAlbums] = useState([""]);
    const [favoriteSongs, setFavoriteSongs] = useState([""]);
    const [favoriteGenres, setFavoriteGenres] = useState([""]);

    
    
    
    
    
    const years = Array.from(Array(100).keys()).map((year) => 2021 - year);
    const months = Array.from({ length: 12 }, (_, index) => {
        const monthNumber = index + 1;
        return monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
    });
    const days = Array.from({ length: 31 }, (_, index) => {
        const dayNumber = index + 1;
        return dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
    });
    
    
    
    const handleCreateProfile = async (e) => {
        e.preventDefault();

        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            .split("=")[1];

        if(year === '' || 
            month === '' || 
            day === '' || 
            country === '' || 
            languages === '' || 
            currentObsession === '' || 
            profilePictureUrl === '' || 
            favoriteArtists === '' || 
            favoriteAlbums === '' || 
            favoriteSongs === '' || 
            favoriteGenres === '') {
            alert('Please fill in all fields');
            return;
        }
        try {
            let newProfile = {
                "birthday": `${year}-${month}-${day}`,
                "country": country,
                "languages": languages,
                "currentObsession": currentObsession,
                "profilePictureUrl": profilePictureUrl,
                "favoriteArtists": favoriteArtists,
                "favoriteAlbums": favoriteAlbums,
                "favoriteSongs": favoriteSongs,
                "favoriteGenres": favoriteGenres,
            };
            let result = await axios.post("http://localhost:8080/create", newProfile,
            { headers: { Authorization: `Bearer ${token}` } });
            if(result.status !== 201) {
                alert('Something went wrong');
                return;
            }
            
            navigate('/profile');
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    
    
    
    
    return (
        <div className={styles.mainContainer}>
            <h1>Create Your Profile</h1>
            <div>
                <form>
                    {/* BIRTHDAY SELECT*/ }
                    <div>
                        <label htmlFor="birthday">Birthday:</label>
                        <select name="" id="">
                            <label htmlFor="year">Year:</label>
                                <select id="year" value={year} onChange={(e) => setYear (e.target.value)}></select>
                                <option value="" disabled>
                                    Select Year
                                </option>
                                {
                                    years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))
                                }
                        </select>
                        <select name="" id="">
                            <label htmlFor="month">Month:</label>
                                <select id="month" value={month} onChange={(e) => setMonth (e.target.value)}></select>
                                <option value="" disabled>
                                    Select Month
                                </option>
                                {
                                    months.map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))
                                }
                        </select>
                        <select name="" id="">
                            <label htmlFor="day">Day:</label>
                                <select id="day" value={day} onChange={(e) => setDay (e.target.value)}></select>
                                <option value="" disabled>
                                    Select Day
                                </option>
                                {
                                    days.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))
                                }
                            </select>
                    </div>

                    <div>
                        <label htmlFor="country">Country:</label>
                        <input type="text" id="country" name="country" placeholder="Country" 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)} /> 
                        <label htmlFor="languages">Languages:</label>
                        <input type="text" id="languages" name="languages" placeholder="Languages" 
                            value={languages} 
                            onChange={(e) => setLanguages(e.target.value)} /> 
                        <label htmlFor="currentObsession">Current Obsesion:</label>
                        <input type="text" id="currentObsession" name="currentObsession" placeholder="Current Obsession" 
                            value={currentObsession} 
                            onChange={(e) => setCurrentObsession(e.target.value)} /> 
                        <label htmlFor="profilePictureUrl">Profile Picture URL:</label>
                        <input type="text" id="profilePictureUrl" name="profilePictureUrl" placeholder="Profile Picture URL" 
                            value={profilePictureUrl} 
                            onChange={(e) => setProfilePictureUrl(e.target.value)} />
                        <label htmlFor="favoriteArtists">Favorite Artists:</label>
                        <input type="text" id="favoriteArtists" name="favoriteArtists" placeholder="Favorite Artists" 
                            value={favoriteArtists} 
                            onChange={(e) => setFavoriteArtists(e.target.value)} />
                        <label htmlFor="favoriteAlbums">Favorite Albums:</label>
                        <input type="text" id="favoriteAlbums" name="favoriteAlbums" placeholder="Favorite Albums" 
                            value={favoriteAlbums} 
                            onChange={(e) => setFavoriteAlbums(e.target.value)} />
                        <label htmlFor="favoriteSongs">Favorite Songs:</label>
                        <input type="text" id="favoriteSongs" name="favoriteSongs" placeholder="Favorite Songs" 
                            value={favoriteSongs} 
                            onChange={(e) => setFavoriteSongs(e.target.value)} />
                        <label htmlFor="favoriteGenres">Favorite Genres:</label>
                        <input type="text" id="favoriteGenres" name="favoriteGenres" placeholder="Favorite Genres" 
                            value={favoriteGenres} 
                            onChange={(e) => setFavoriteGenres(e.target.value)} />
                        
                    </div>
                        
                    <button onClick={handleCreateProfile}>Create Profile</button>   
                </form>
            </div>
        </div>
    );
};