import express from 'express';
import{ handleData, handleBalance, handleFlowIn, handleFlowOut } from '../controllers/bankingController.js'
import auth from '../middlewares/auth.js';
const router = express.Router();

router.get('/data', auth, handleData)
router.get('/balance',auth, handleBalance)
router.get('/flowIn',auth, handleFlowIn)
router.get('/flowOut',auth, handleFlowOut)

export default router