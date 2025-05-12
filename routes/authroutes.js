import express from 'express';

import {
    forgotPassword,
    login,
    logout,
    resetPassword,
    signup, //728951 //747632 //138669
    verifyemail,
    checkAuth
} from '../Auth/controller.js';

import {authenticateUser} from '../utils/verifyToken.js';

const router = express.Router();

//Authication check for valid userrs 
router.get('/auth-check', authenticateUser, checkAuth);

//Register Account:
router.post('/auth/signup', signup)
router.post('/auth/verify-email', verifyemail)

//Log in:
router.post('/auth/login', login)
router.post('/auth/logout', logout);

//Forgot Password ?
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password/:token', resetPassword);

export default router;