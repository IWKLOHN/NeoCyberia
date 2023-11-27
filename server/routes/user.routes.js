import express from 'express';
import cookieParser from 'cookie-parser';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.use(cookieParser());

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

export {router};