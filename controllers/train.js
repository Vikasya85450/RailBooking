import db from '../db.js';

export const addTrain = async (req, res) => {
    try {
        const {
            train_name,
            source,
            destination,
            departure_time,
            arrival_time,
            price,
            total_seats
        } = req.body;

        if (!train_name || !source || !destination || !departure_time || !arrival_time || !price || !total_seats) {
            return res.status(400).json({
                success: false,
                message: 'All train fields are required'
            });
        }

        const [result] = await db.raw(
            `INSERT INTO train (train_name, source, destination, departure_time, arrival_time, price, total_seats)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [train_name, source, destination, departure_time, arrival_time, price, total_seats]
        );

        return res.status(201).json({
            success: true,
            message: 'Train added successfully',
            data: {
                train_id: result.insertId
            }
        });
    } catch (error) {
        console.error('Error adding train:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add train'
        });
    }
};

