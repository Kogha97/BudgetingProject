import express from 'express';
import{ handleData, handleBalance, handleFlowIn } from '../controllers/bankingController.js'

const router = express.Router();

router.get('/data', handleData)
router.get('/balance', handleBalance)
router.get('/flowIn', handleFlowIn)

export default router