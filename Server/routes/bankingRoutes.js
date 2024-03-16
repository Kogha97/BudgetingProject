import express from 'express';
import{ handleData, handleBalance, handleFlowIn, handleFlowOut, handleSavings} from '../controllers/bankingController.js'
import auth from '../middlewares/auth.js';
const router = express.Router();

router.get('/data', auth, handleData)
router.get('/balance',auth, handleBalance)
router.get('/flowIn',auth, handleFlowIn)
router.get('/flowOut',auth, handleFlowOut)
router.get('/savings', auth, handleSavings)

export default router