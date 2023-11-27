import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    username:{
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    birthdate:{
        type: Date,
        required: [true, "Birthdate is required"]
    },
    country:{
        type: String,
        required: [true, "Country is required"]
    },
    languages:{
        type: String,
        required: [true, "At least one language is required"]
    },
    currentObsession:{
        type: String,
        required: true
    },
    profilePictureUrl:{
        type: String,
        
    },
    profilePicture:{
        type: Buffer,
        contentType: String
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