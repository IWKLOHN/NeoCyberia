import mongoose from "mongoose";



const isValidUrl = (v) => {
    try {
        new URL(v);
        return true;
    } catch (err) {
        return false;
    }
};






const ProfileSchema = new mongoose.Schema({
    
    birthday:{
        type: Date,
        required: [true, "Birthday is required"]
    },
    country:{
        type: String,
        required: [true, "Country is required"]
    },
    languages:{
        type: [String],
        validate: {
            validator: function(v){
                return v.length <= 3 && v.length >= 1;
            },
            message: "At least one language is required."
        },
        required: [true, "At least one language is required"]
    },
    currentObsession:{
        type: String,
        required: true
    },
    profilePictureUrl:{
        type: String,
        validate: [
            {
                validator: function(v){
                    return this.profilePicture || v || v === "";
                },
                message: "Profile picture is required."
            },
            {
                validator: function (v){
                    return v === "" || isValidUrl(v);
                },
                message: "Invalid URL"
            }
                
        ]
        
    },
    profilePicture:{
        type: Buffer,
        contentType: String,
        validate: {
            validator: function(v){
                return this.profilePictureUrl || v;
            },
            message: "Profile picture is required."
        }
    },
    favoriteArtists:{
        type: [String],
        validate: {
            validator: function(v){
                return v.length <= 3 && v.length >= 1;
            },
            message: "At least one artist is required."
        }
    
    },
    favoriteGenres:{
        type: [String],
        validate: {
            validator: function(v){
                return v.length <= 3 && v.length >= 1;
            },
            message: "At least one genre is required."
        }
    },
    favoriteSongs:{
        type: [String],
        validate: {
            validator: function(v){
                return v.length <= 3 && v.length >= 1;
            },
            message: "At least one song is required."
        }
    },
    favoriteAlbums:{
        type: [String],
        validate: {
            validator: function(v){
                return v.length <= 3 && v.length >= 1;
            },
            message: "At least one album is required."
        }
    },

});

const Profile = mongoose.model('profiles', ProfileSchema);

export default Profile;