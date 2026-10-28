const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');

// ตรวจ token จาก header  Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (token == "null") {
            return res.status(403).json({ message: "no token provide" });
        }
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decode.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// ใช้ต่อจาก verifyToken: ให้ผ่านเฉพาะ admin
const isAdmin = async (req, res, next) => {
    const user = await prisma.user.findUnique({ where: { userId: req.userId } });
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin only" });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
