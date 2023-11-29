import express from 'express';
import cookieParser from 'cookie-parser';
import * as userController from '../controllers/user.controller.js';
import * as middlewareJwt from '../middleware/middlewareJwt.js';

const router = express.Router();

router.use(cookieParser());

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserById/:id',middlewareJwt.authJwt, userController.getUserById);
router.get('/getUserAndProfileById/:id',middlewareJwt.authJwt, userController.getUserAndProfileById);
router.delete('/deleteUserById/:id',middlewareJwt.authJwt, userController.deleteUserById);
router.delete('/deleteUserAndProfile/:id', middlewareJwt.authJwt, userController.deleteUserAndProfile);

export {router};