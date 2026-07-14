
import express from 'express';


const router = express.Router();

router.get("/",getTicket);
router.get("/:id", DownloadTicket);





export default router;