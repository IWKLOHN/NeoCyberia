import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';




export const CreateProfileComponent = () => {
    
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        birthday: "",
        country: "",
        languages:[],
        currentObsession: "",
        profilePictureUrl: "",
        profilePictureFile: null,
        favoriteArtists: [],
        favoriteGenres: [],
        favoriteSongs: [],
        favoriteAlbums: [],
    });

    const handleInputChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };  


    const handleArrayChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value.split(","),
        }); 
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            profile.birthday === "" &&
            profile.country === "" &&
            profile.languages.length === 0 &&
            profile.currentObsession === "" &&
            (profile.profilePictureUrl === "" || profile.profilePictureFile === null) &&
            profile.favoriteArtists.length === 0 &&
            profile.favoriteGenres.length === 0 &&
            profile.favoriteSongs.length === 0 &&
            profile.favoriteAlbums.length === 0
        ) {
            alert("Please fill out all fields, including either profilePictureFile or profilePictureUrl");
            return;
        }
        let newProfile = new FormData();
        newProfile.append("birthday", profile.birthday);
        newProfile.append("country", profile.country);
        newProfile.append("languages", profile.languages);
        newProfile.append("currentObsession", profile.currentObsession);
        newProfile.append("profilePictureUrl", profile.profilePictureUrl);
        newProfile.append("favoriteArtists", profile.favoriteArtists);
        newProfile.append("favoriteGenres", profile.favoriteGenres);
        newProfile.append("favoriteSongs", profile.favoriteSongs);
        newProfile.append("favoriteAlbums", profile.favoriteAlbums);
        if(profile.profilePictureFile){
            newProfile.append("profilePicture", profile.profilePictureFile);
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
        <form onSubmit={handleSubmit}>
            <label htmlFor="birthday">
                Birthday:
                <input
                    type="date"
                    name="birthday"
                    value={profile.birthday}
                    onChange={handleInputChange}
                />
            </label>
            <label htmlFor="country">
                Country:
                <input
                    type="text"
                    name="country"
                    value={profile.country}
                    onChange={handleInputChange}
                />
            </label>
            <label htmlFor="languages">
                Languages:
                <input
                    type="text"
                    name="languages"
                    value={profile.languages}
                    onChange={handleArrayChange}
                />
            </label>
            <label htmlFor="currentObsession">
                Current Obsession:
                <input
                    type="text"
                    name="currentObsession"
                    value={profile.currentObsession}
                    onChange={handleInputChange}
                />
            </label>
            <label htmlFor="profilePictureUrl">
                Profile Picture URL:
                <input
                    type="text"
                    name="profilePictureUrl"
                    value={profile.profilePictureUrl}
                    onChange={handleInputChange}
                />
            </label>
            <label htmlFor="profilePicture">
                Profile Picture:
                <input
                    type="file"
                    accept='image/*'
                    name="profilePicture"
                    onChange={(e) => setProfile({...profile, profilePictureFile: e.target.files[0]})}
                />
            </label>
            <label htmlFor="favoriteArtists">
                Favorite Artists:
                <input
                    type="text"
                    name="favoriteArtists"
                    value={profile.favoriteArtists}
                    onChange={handleArrayChange}
                />
            </label>
            <label htmlFor="favoriteGenres">
                Favorite Genres:
                <input
                    type="text"
                    name="favoriteGenres"
                    value={profile.favoriteGenres}
                    onChange={handleArrayChange}
                />
            </label>
            <label htmlFor="favoriteAlbums">
                Favorite Albums:
                <input
                    type="text"
                    name="favoriteAlbums"
                    value={profile.favoriteAlbums}
                    onChange={handleArrayChange}
                />
            </label>
            <label htmlFor="favoriteSongs">
                Favorite Songs:
                <input
                    type="text"
                    name="favoriteSongs"
                    value={profile.favoriteSongs}
                    onChange={handleArrayChange}
                />
            </label>
            <button type="submit">Create Profile</button>
        </form>
    )
};