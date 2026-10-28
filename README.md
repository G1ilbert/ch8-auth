# ch8 Auth Todo (Login / Register / Guest · User · Admin)

Todo จากบทที่ 8 (ReactJs Authen)

- หน้า **Register**, **Login** (bcrypt + JWT) และ **Home**
- **Guest**: ดูเมนูพร้อมคะแนนเฉลี่ย อัปเดตอัตโนมัติทุก 5 วินาที (real-time)
- **User**: ให้คะแนนเมนู 1–5 (1 คนต่อ 1 เมนูได้ 1 คะแนน ให้ใหม่ = แก้คะแนนเดิม)
- **Admin**: เพิ่ม / ลบเมนู และสลับไปหน้าจัดการ user เพื่อเปลี่ยน role

```
backend/    Express + Prisma + bcrypt + jsonwebtoken (port 3000)
frontend/   React + react-router-dom + axios (port 5173)
database/   ch8_auth.sql
```

## 1. ฐานข้อมูล

XAMPP → Start **MySQL** → เปิด phpMyAdmin → แท็บ **Import** → เลือก `database/ch8_auth.sql`
(สร้างฐานข้อมูล `ch8_auth` พร้อมข้อมูลตัวอย่าง)

| บัญชีตัวอย่าง | รหัสผ่าน | role |
|---|---|---|
| admin | admin1234 | admin |
| Ann | 1234 | user |
| Bob | 1234 | user |

## 2. Backend

```bash
cd backend
cp .env.example .env      # ถ้า MySQL มีรหัสผ่าน แก้ DB_PASSWORD และ DATABASE_URL
npm install               # postinstall จะรัน prisma generate ให้
npm run dev
```

| Method | Path | สิทธิ์ | ใช้ทำ |
|---|---|---|---|
| POST | `/authen/register` | ทุกคน | สมัคร `{ userName, email, password }` → 201 / 409 ซ้ำ |
| POST | `/authen/login` | ทุกคน | `{ userName, password }` → 200 + token / 404 |
| GET | `/authen/home` | login | ข้อมูล user จาก token |
| GET | `/api/menu` | ทุกคน | เมนู + คะแนนเฉลี่ย |
| POST | `/api/menu/:id/rating` | login | ให้คะแนน `{ score: 1-5 }` |
| POST | `/api/menu` | admin | เพิ่มเมนู |
| DELETE | `/api/menu/:id` | admin | ลบเมนู |
| GET | `/api/users` | admin | รายชื่อ user |
| PUT | `/api/users/:id/role` | admin | เปลี่ยน role `{ role: "user" \| "admin" }` |

ส่ง token ใน header: `Authorization: Bearer <token>`

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

เปิด http://localhost:5173
