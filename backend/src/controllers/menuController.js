const prisma = require('../db/prisma');

// GET /api/menu  พร้อมคะแนนเฉลี่ย (ทุกคนเรียกได้)
const getMenus = async (req, res) => {
    try {
        const menus = await prisma.menu.findMany({
            include: { rating: true }
        });
        const result = menus.map((m) => {
            const total = m.rating.reduce((sum, r) => sum + r.score, 0);
            return {
                menuId: m.menuId,
                name: m.name,
                price: m.price,
                isBestSeller: m.isBestSeller,
                avgRating: m.rating.length ? (total / m.rating.length).toFixed(1) : '-'
            };
        });
        res.json(result);
    } catch (err) {
        console.error('Error fetching menu:', err);
        res.status(500).json({ message: 'Database error' });
    }
};

// POST /api/menu  (admin)
const createMenu = async (req, res) => {
    const { name, price, isBestSeller } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }
    try {
        const newMenu = await prisma.menu.create({
            data: {
                name: name,
                price: Number(price),
                isBestSeller: isBestSeller === true || isBestSeller === 'true'
            }
        });
        res.status(201).json(newMenu);
    } catch (err) {
        console.error('Error creating menu:', err);
        res.status(500).json({ message: 'Database error' });
    }
};

// DELETE /api/menu/:id  (admin)
const deleteMenu = async (req, res) => {
    const menuId = Number(req.params.id);
    try {
        await prisma.rating.deleteMany({ where: { menuId: menuId } }); // ลบคะแนนของเมนูนี้ก่อน
        await prisma.menu.delete({ where: { menuId: menuId } });
        res.json({ message: 'Menu deleted successfully', id: menuId });
    } catch (err) {
        console.error('Error deleting menu:', err);
        res.status(404).json({ message: 'Menu not found' });
    }
};

// POST /api/menu/:id/rating  body: { score }  (user ที่ login)
const rateMenu = async (req, res) => {
    const menuId = Number(req.params.id);
    const score = Number(req.body.score);
    if (!score || score < 1 || score > 5) {
        return res.status(400).json({ message: 'Score must be 1-5' });
    }
    try {
        // เคยให้คะแนนเมนูนี้แล้ว → แก้คะแนนเดิม, ยังไม่เคย → เพิ่มใหม่
        const old = await prisma.rating.findFirst({ where: { userId: req.userId, menuId: menuId } });
        if (old) {
            await prisma.rating.update({ where: { ratingId: old.ratingId }, data: { score: score } });
        } else {
            await prisma.rating.create({ data: { userId: req.userId, menuId: menuId, score: score } });
        }
        res.json({ message: 'Rating saved' });
    } catch (err) {
        console.error('Error saving rating:', err);
        res.status(404).json({ message: 'Menu not found' });
    }
};

module.exports = { getMenus, createMenu, deleteMenu, rateMenu };
