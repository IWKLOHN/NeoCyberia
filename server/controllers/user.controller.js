import User from '../models/user.model.js';
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
        const result = await User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]});
        if (result) {
            const isMatch = bcrypt.compareSync(req.body.password, result.password);
            if (isMatch) {
                const payload ={
                    id: result._id,
                    username: result.username,
                    email: result.email,
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


export { registerUser, loginUser };