
import express from 'express';
import { postUser,getUser } from '../controllers/user.js';


const router = express.Router();

router.post("/signup",postUser );
router.post("/login", getUser);


export default router;