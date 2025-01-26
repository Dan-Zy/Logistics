import express from 'express';
import { registerUser } from '../controllers/userControllers/registerUser.js';
import { verifyToken } from './../middleware/authorization.js';
import { verifyEmail } from '../controllers/userControllers/verifyEmail.js';
import { loginUser } from '../controllers/userControllers/loginUser.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/verify-email', verifyToken, verifyEmail);

router.post('/login', loginUser);


export default router;