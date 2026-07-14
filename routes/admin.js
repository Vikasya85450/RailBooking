
import express from 'express';
import { isAuthAndAdmin } from '../helper.js';
import { addTrain } from '../controllers/train.js';

const router = express.Router();

router.post('/', isAuthAndAdmin, addTrain);

router.put('/:id', isAuthAndAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Admin access confirmed for editing train'
    });
});

export default router;