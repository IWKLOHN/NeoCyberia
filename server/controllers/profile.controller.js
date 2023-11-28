import Profile from "../models/profile.model.js";
import mongoose from "mongoose";

const createProfile = async (req, res) => {
    try {
        const profileData = req.body;
        const profile = await Profile.create(profileData);
        res.status(201).json({ message: "Profile created successfully", profile });
    } catch (error) {
        res.status(500).json({ message: "Unable to create profile", error });
    }
};

/*const getProfileById = async (req, res) => {
    try {
        
        const profile = await Profile.findById({userId : req.params.id});
        if(!profile){
            res.status(404).json({ message: "Profile not found"})
        }
        res.status(200).json({ message: "Profile retrieved successfully", profile });
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve profile", error });
    }
}*/

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

const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.status(200).json({ message: "Profiles retrieved successfully", profiles });
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve profiles", error });
    }
};

const updateProfile = async (req, res) => {
    try {
        const profileData = req.body;
        const profile = await Profile.findByIdAndUpdate(req.params.id, profileData, { new: true , runValidators: true});
        res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        res.status(500).json({ message: "Unable to update profile", error });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Profile deleted successfully", profile });
    } catch (error) {
        res.status(500).json({ message: "Unable to delete profile", error });
    }
};

export {createProfile, getProfileById, getAllProfiles, updateProfile, deleteProfile};