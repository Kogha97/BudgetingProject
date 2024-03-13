import express from "express";
import {
    handleRegister,
    handleLogin,
    handleUpdate,
    handleBudgetTargets,
    handleGetBudgetTargets,
    handleBudgetCurrent,
    handleGetBudgetCurrent,
    handleLogout
} from '../controllers/userController.js'
import uploadCloudinary from "../middlewares/multer-cloudinary.js"
import auth from "../middlewares/auth.js";
const router =  express.Router();


router.post('/profile',auth, uploadCloudinary.single('avatar'), handleUpdate)
router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.put('/:userId/budgetTargets', auth, handleBudgetTargets)
router.get('/:userId/budgetTargets', auth, handleGetBudgetTargets)
router.put('/:userId/budgetCurrent', auth, handleBudgetCurrent)
router.get('/:userId/budgetCurrent', auth, handleGetBudgetCurrent)
router.get('/logout',auth, handleLogout)


export default router;