import express from "express";
import {
    handleRegister,
    handleLogin,
    handleUpdate,
    handleBudgetTargets,
    handleGetBudgetTargets,
    handleBudgetCurrent,
    handleGetBudgetCurrent,
    handleLogout,
    handleEmailConfirm,

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
router.get('/logout', handleLogout)
router.get('/emailconfirm/:token', handleEmailConfirm)


export default router;