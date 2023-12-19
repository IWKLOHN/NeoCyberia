import express from 'express';
import multer from "multer";
import * as profileController from '../controllers/profile.controller.js';
import * as middlewareJwt from '../middleware/middlewareJwt.js';


const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            cb(new Error("Only JPEG and PNG files are allowed"), false);
        } else {
            cb(null, true);
        }
    },
        
});

const router = express.Router();

router.post('/create/:id', middlewareJwt.authJwt ,upload.single('profilePicture'),  profileController.createProfile);
router.get('/getProfile/:id', middlewareJwt.authJwt ,profileController.getProfileById);
router.get('/getProfiles', middlewareJwt.authJwt, profileController.getAllProfiles);
router.put('/updateProfile/:id', middlewareJwt.authJwt ,upload.single('profilePicture'), profileController.updateProfile);
router.delete('/delete/:id', middlewareJwt.authJwt ,profileController.deleteProfile);





export {router};

