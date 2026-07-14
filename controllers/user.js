import db from '../db.js';
import bcrypt from "bcryptjs";
import { generateToken } from "../helper.js"
import dotenv from 'dotenv';
import RedisHelper from '../utils/redis.helper.js';
dotenv.config();


export const postUser = async (req, res) => {
  try {

    const { username, email, password, full_name, phone_number } = req.body;

    if (!username || !email || !password || !full_name || !phone_number) {
      return res.status(402).json({
        success: false,
        message: "all field requuired"
      })
    }

    const existingUser = await db.raw("select * from users where email = ?", [email]);
    if (existingUser[0].length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);




    const result = await db.raw('insert into  users(username,email,password,phone_number,full_name)values(?,?,?,?,?) ', [username, email, hashedpassword, phone_number, full_name]);
    if (result) {
      return res.status(201).json({
        sucess: true,
        data: "User registered successfully"
      })
    }
  }
  catch (error) {
    console.error("Error adding traveller:", error);
    res.status(500).json({ message: "Error adding traveller" });
  }
}

export const getUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    const [result] = await db.raw("select * from users where email = ?", [email]);
    result[0];


    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatched = await bcrypt.compare(password, result[0].password);



    if (!isMatched) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (isMatched) {
      const payload = {
        id: result[0].id,
        email: result[0].email
      }
      const token = generateToken(payload);
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        success: true,
        message: "User Login  Successful"

      })
    };

  }
  catch (error) {
    console.error("Error fetching traveller:", error);
    res.status(500).json({ message: "Error fetching traveller" });
  }
}


export const getProfile = async (req, res) => {
  try {

    const { id } = req.user.data;

    const cacheKey = `user:profile:${id}`;
    const cachedProfile = await RedisHelper.get(cacheKey);
    if (cachedProfile) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cachedProfile
      });
    }



    const [result] = await db.raw(
      `SELECT
          id,
          username,
          full_name,
          email,
          phone_number,
          created_at
       FROM users
       WHERE id = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await RedisHelper.set(cacheKey, result[0], 60 * 60);

    return res.status(200).json({
      success: true,
      source: "database",
      data: result[0]
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};



