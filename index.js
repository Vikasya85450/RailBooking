import express from "express";
import db from "./db.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import trainRouter from "./routes/train.js";

import cookieParser from "cookie-parser";
import authMiddleware from "./utils/auth.middleware.js";
import Redis from "ioredis";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());


const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/", (req, res) => {
  res.send("Hello, World!");


});

app.get("/redis", async (req, res) => {
  try {
    const reply = await redis.ping();
    console.log("Redis ping response:", reply);
    res.status(200).json({ message: "Redis is working", reply });
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    res.status(500).json({ message: "Error connecting to Redis" });
  }
});


app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/train', trainRouter);

app.get("/traveller", async (req, res) => {
  try {
    const [result] = await db.raw("select * from traveller");
    res.status(201).json(
      {
        success: true,
        data: result
      }
    )
  }

  catch (error) {
    console.log("Error fetching traveller:", error);
    res.status(500).json({ message: "Error fetching traveller" });
  }
})



app.listen(8003, () => {
  console.log("Server is running on port 8003");
}) 