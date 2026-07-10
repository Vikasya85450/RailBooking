
import express from 'express';
import { postUser,getUser, postProfile,  } from '../controllers/user.js';


const router = express.Router();

router.post("/signup",postUser );
router.post("/login", getUser);

router.post("/profile",postProfile  )


export default router;