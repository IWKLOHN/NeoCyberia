import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"],
        trim: true,
        minlength: 3
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
        minlength: 3
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
    profileCreated:{
        type: Boolean,
        default: false
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profiles', default: null
    }
    
}, {timestamps: true});

const User = mongoose.model('users', UserSchema);

export default User;