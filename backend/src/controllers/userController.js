const prisma = require('../db/prisma');

// GET /api/users  (admin)
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { userId: true, userName: true, email: true, role: true }
        });
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Database error' });
    }
};

// PUT /api/users/:id/role  body: { role }  (admin)
const updateRole = async (req, res) => {
    const { role } = req.body;
    if (role !== 'user' && role !== 'admin') {
        return res.status(400).json({ message: 'Role must be user or admin' });
    }
    try {
        const user = await prisma.user.update({
            where: { userId: Number(req.params.id) },
            data: { role: role },
            select: { userId: true, userName: true, email: true, role: true }
        });
        res.json(user);
    } catch (err) {
        console.error('Error updating role:', err);
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUsers, updateRole };
