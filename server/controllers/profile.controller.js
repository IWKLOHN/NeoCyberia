import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";




/*const createProfile = async (req, res) => {
    try {
        const profileData = req.body;
        if(req.file){
            profileData.profilePicture = req.file.buffer;
        }
        const profile = await Profile.create(profileData);
    } catch (error) {
        res.status(500).json({ message: "Unable to create profile", error });
    }
};*/


const createProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const profileData = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if(user.profile){
            return res.status(400).json({message: "Profile already exists"});
        }
        if(req.file){
            profileData.profilePicture = req.file.buffer;
        }
        const profile = await Profile.create(profileData);
        
        user.profileCreated = true;
        user.profile = profile._id;
        await user.save();
        res.status(201).json({ message: "Profile created successfully", profile });
    } catch (error) {
        res.status(500).json({ message: "Unable to create profile", error });
    }
}




const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.status(200).json({ message: "Profiles retrieved successfully", profiles });
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve profiles", error });
    }
};



const getProfileById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if userId is not provided or is not a valid ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile retrieved successfully', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to retrieve profile', error });
    }
};


const updateProfile = async (req, res) => {
    try {
        const profileId = req.params.id;
        const profileData = req.body;
        if(req.file){
            profileData.profilePicture = req.file.buffer;
        }
        const profile = await Profile.findByIdAndUpdate(profileId, profileData, { new: true , runValidators: true});
        res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        res.status(500).json({ message: "Unable to update profile", error });
    }
};


const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const profile = await Profile.findOneAndDelete({userId});
        res.status(200).json({ message: "Profile deleted successfully", profile });
    } catch (error) {
        res.status(500).json({ message: "Unable to delete profile", error });
    }
};








export {createProfile, getProfileById, getAllProfiles, updateProfile, deleteProfile};