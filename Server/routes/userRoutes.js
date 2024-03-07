import express from "express";
import {
    handleRegister,
    handleLogin,
    handleUpdate,
    handleBudgetTargets,
    handleGetBudgetTargets,
    handleBudgetCurrent,
    handleGetBudgetCurrent,
} from '../controllers/userController.js'
import upload from "../middlewares/multer-cloudinary.js";
import uploadCloudinary from "../middlewares/multer-cloudinary.js"
const router =  express.Router();


router.post('/profile', uploadCloudinary.single('avatar'), handleUpdate)
router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.put('/:userId/budgetTargets', handleBudgetTargets)
router.get('/:userId/budgetTargets', handleGetBudgetTargets)
router.put('/:userId/budgetCurrent', handleBudgetCurrent)
router.get('/:userId/budgetCurrent', handleGetBudgetCurrent)


export default router;