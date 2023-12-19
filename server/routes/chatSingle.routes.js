import express from 'express';
import { getPrivateMessages } from '../controllers/chatSingle.controller.js';
import * as middlewareJwt from '../middleware/middlewareJwt.js';

const router = express.Router();

router.get('/api/chatHistory/:roomId', middlewareJwt.authJwt  ,getPrivateMessages);

export { router };