import express from "express";
import {
    handleRegister,
    handleLogin,
    handleUpdate
} from '../controllers/userController.js'
import upload from "../middlewares/multer-cloudinary.js";
import uploadCloudinary from "../middlewares/multer-cloudinary.js"
const router =  express.Router();


router.post('/profile', uploadCloudinary.single('avatar'), handleUpdate)
router.post('/register', handleRegister);
router.post('/login', handleLogin);

export default router;