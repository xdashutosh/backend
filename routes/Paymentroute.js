import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { Buysub, cancelSubs, paymentvarification } from '../controllers/paymentcontroller.js';


const router = express.Router();

//buy subscription

router.route('/subscribe').get(isAuthenticated,Buysub);
router.route('/paymentvarification').post(isAuthenticated,paymentvarification);
router.route('/subscribe/cancel').post(isAuthenticated,cancelSubs);

export default router;