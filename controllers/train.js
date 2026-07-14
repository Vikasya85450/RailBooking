import db from "../db.js";
import RedisHelper from "../utils/redis.helper.js";

export const addTrain = async (req, res) => {
    try {

        const {
            train_number,
            train_name,
            source,
            destination,
            departure_time,
            arrival_time
        } = req.body;

        if (
            !train_number ||
            !train_name ||
            !source ||
            !destination ||
            !departure_time ||
            !arrival_time
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check duplicate train number
        const [existing] = await db.raw(
            "SELECT id FROM train WHERE train_number = ?",
            [train_number]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Train already exists"
            });
        }

        // Insert train
        const [result] = await db.raw(
            `INSERT INTO train
            (
                train_number,
                train_name,
                source,
                destination,
                departure_time,
                arrival_time
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                train_number,
                train_name,
                source,
                destination,
                departure_time,
                arrival_time
            ]
        );
         await RedisHelper.del("trains:all");
        return res.status(201).json({
            success: true,
            message: "Train added successfully",
            data: {
                train_id: result.insertId
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllTrains = async (req, res) => {
    try {

        const cacheKey = "trains:all";

        const cachedTrains = await RedisHelper.get(cacheKey);

        if (cachedTrains) {
            return res.status(200).json({
                success: true,
                source: "cache",
                data: cachedTrains
            });
        }

        const [trains] = await db.raw("SELECT * FROM train");

        await RedisHelper.set(cacheKey, trains, 300); // Cache for 5 minutes

        return res.status(200).json({
            success: true,
            source: "database",
            data: trains
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getTrainById = async (req, res) => {
    try {

        const { id } = req.params;

        const cacheKey = `train:${id}`;

        const cachedTrain = await RedisHelper.get(cacheKey);

        if (cachedTrain) {
            return res.status(200).json({
                success: true,
                source: "cache",
                data: cachedTrain
            });
        }

        const [train] = await db.raw(
            "SELECT * FROM train WHERE id = ?",
            [id]
        );

        if (train.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Train not found"
            });
        }

        await RedisHelper.set(cacheKey, train[0], 300);

        return res.status(200).json({
            success: true,
            source: "database",
            data: train[0]
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteTrain = async (req, res) => {

    try {

        const { id } = req.params;

        const [train] = await db.raw(
            "SELECT id FROM train WHERE id=?",
            [id]
        );

        if (train.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Train not found"
            });
        }

        await db.raw(
    "DELETE FROM train WHERE id=?",
    [id]
);

// Remove cache
await RedisHelper.del(`train:${id}`);
await RedisHelper.del("trains:all");

        res.status(200).json({
            success: true,
            message: "Train deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};