
import express from 'express';


const router = express.Router();

router.get("/",getalltrain);
router.get("/:id", getTrainById);
router.get("/search", searchTrain);




export default router;