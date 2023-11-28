import express from 'express';
import * as profileController from '../controllers/profile.controller.js';

const router = express.Router();

router.post('/create', profileController.createProfile);
router.get('/get/:id', profileController.getProfileById);
router.get('/get', profileController.getAllProfiles);
router.put('/update/:id', profileController.updateProfile);
router.delete('/delete/:id', profileController.deleteProfile);

export {router};