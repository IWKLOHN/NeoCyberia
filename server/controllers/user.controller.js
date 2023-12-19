import User from '../models/user.model.js';
import Profile from '../models/profile.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        userData.password = bcrypt.hashSync(userData.password, 10);
        const user = await User.create(userData);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Unable to register", error });
    }
};
    
const loginUser = async (req, res) => {
    try {
        const result = await User.findOne({$or: [
            {username: req.body.username}, 
            {email: req.body.email}]});
        if (result) {
            const isMatch = bcrypt.compareSync(req.body.password, result.password);
            if (isMatch) {
                const payload ={
                    id: result._id,
                    username: result.username,
                    email: result.email,
                    profileCreated: result.profileCreated,
                };
                const token = jwt.sign(payload, "jwt-secret-key")
                res.cookie("token", token, {secure: false, sameSite: 'lax'})
                res.status(200).json({ message: "User logged in successfully", token });
            } else {
                res.status(401).json({ message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Unable to login", error });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('profile');
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve users", error });
    }
};


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve user", error });
    }
};

const getUserAndProfileById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).populate('profile');
        if(!user){
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve user", error });
    }
};

const deleteUserAndProfile = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByIdAndDelete(userId).populate('profile');
        if(user){
            if(user.profile){
                await Profile.findByIdAndDelete(user.profile._id);
            }
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Unable to delete user", error });
    }
};


const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Unable to delete user", error });
    }
};

export { registerUser, loginUser, getAllUsers, getUserById, deleteUserById, getUserAndProfileById, deleteUserAndProfile };