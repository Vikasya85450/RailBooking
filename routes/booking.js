
import express from 'express';


const router = express.Router();

router.post("/",createBooking);
router.get("/", BookingHistory);
router.delete("/:id", CancelBooking);




export default router;