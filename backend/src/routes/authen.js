const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');
const { verifyToken } = require('../middleware/auth');

// POST /authen/register
router.post('/register', async (req, res) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    try {
        // หา user ที่ username หรือ email ซ้ำ
        const getUser = await prisma.user.findMany({
            where: { OR: [{ userName: userName }, { email: email }] }
        });
        if (getUser.length > 0) {
            return res.status(409).json({ message: "Duplicate Username or Email" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { userName: userName, email: email, password: hashPassword }
        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

// POST /authen/login
router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const getUser = await prisma.user.findUnique({ where: { userName: userName || '' } });
        if (!getUser) {
            return res.status(404).json({ message: "Unknown Username" });
        }
        const isMatch = await bcrypt.compare(password || '', getUser.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Password Incorrect" });
        }
        // login success → สร้าง token (สไลด์ใช้ '1m' ไว้ทดสอบว่าหมดอายุ)
        const token = jwt.sign(
            { userId: getUser.userId },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
        return res.status(200).json({ message: "Login Success", token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

// GET /authen/home  (ต้องส่ง token มาด้วย)
router.get('/home', verifyToken, async (req, res) => {
    try {
        const getUser = await prisma.user.findMany({
            where: { userId: req.userId },
            select: { userId: true, userName: true, email: true, role: true }
        });
        if (getUser.length == 0) {
            return res.status(404).json({ message: "User not exist" });
        }
        return res.status(200).json({ user: getUser });
    } catch {
        return res.status(500).json({ message: "server error" });
    }
});

module.exports = router;
