import express from 'express';
import { getAllUsers } from '../controllers/usercontroller.js';
const router = express.Router();

router.route("/users").get(getAllUsers);


export default router;