
import express from 'express';
import { postUser, getUser, getProfile, } from '../controllers/user.js';
import authMiddleware from '../utils/auth.middleware.js';


const router = express.Router();

router.post("/signup", postUser);
router.post("/login", getUser);


// protected route
router.get("/profile", authMiddleware, getProfile);

// router.post("/profile",postProfile  )


export default router;