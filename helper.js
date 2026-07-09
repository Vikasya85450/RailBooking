import jwt from 'jsonwebtoken';
const SECRET = process.env.SECRET;
console.log("Secret:", SECRET);

export const generateToken = (payload) => {
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 7),
        data: payload
    }, process.env.SECRET);

    return token;
}