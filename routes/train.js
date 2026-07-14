
import express from 'express';
import { addTrain, deleteTrain, getAllTrains, getTrainById } from '../controllers/train.js';
import authMiddleware from '../utils/auth.middleware.js';



const router = express.Router();

router.post('/',authMiddleware,  addTrain);
router.get("/",getAllTrains);
router.get("/:id", getTrainById);
// router.get("/search", searchTrain);
router.delete("/:id",deleteTrain)




export default router;