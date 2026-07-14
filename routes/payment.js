
import express from 'express';


const router = express.Router();

router.POST("/create",createOrder);
router.get("/verify", verifyPayment);





export default router;