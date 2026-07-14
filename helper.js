import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const generateToken = (payload) => {
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 7),
        data: payload
    }, SECRET);

    return token;
};

export const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded.data || decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export const isAdmin = (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    const isAdminUser = user.role === 'admin' || user.isAdmin === true;

    if (!isAdminUser) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }

    next();
};

export const isAuthAndAdmin = (req, res, next) => {
    isAuth(req, res, () => {
        isAdmin(req, res, next);
    });
};