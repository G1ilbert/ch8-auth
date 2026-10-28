-- ฐานข้อมูลสำหรับ ch8 Todo (user + menu + rating)
-- วิธีใช้: XAMPP → Start MySQL → phpMyAdmin → Import ไฟล์นี้
-- รันซ้ำได้: ลบตารางเดิมในฐานข้อมูล ch8_auth แล้วสร้างใหม่พร้อมข้อมูลตัวอย่าง
-- บัญชีตัวอย่าง: admin / admin1234 (admin) · Ann / 1234 (user) · Bob / 1234 (user)

CREATE DATABASE IF NOT EXISTS ch8_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE ch8_auth;

DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS menu;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
  userId INT NOT NULL AUTO_INCREMENT,
  userName VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user',
  PRIMARY KEY (userId),
  UNIQUE KEY userName (userName),
  UNIQUE KEY email (email)
) ENGINE=InnoDB;

CREATE TABLE menu (
  menuId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  isBestSeller TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (menuId)
) ENGINE=InnoDB;

-- 1 คนให้คะแนน 1 เมนูได้ครั้งเดียว (ให้ใหม่ = แก้คะแนนเดิม)
CREATE TABLE rating (
  ratingId INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  menuId INT NOT NULL,
  score INT NOT NULL,
  PRIMARY KEY (ratingId),
  UNIQUE KEY user_menu (userId, menuId),
  KEY menuId (menuId),
  CONSTRAINT rating_ibfk_1 FOREIGN KEY (userId) REFERENCES user (userId) ON DELETE CASCADE,
  CONSTRAINT rating_ibfk_2 FOREIGN KEY (menuId) REFERENCES menu (menuId) ON DELETE CASCADE
) ENGINE=InnoDB;

-- รหัสผ่านเก็บเป็น bcrypt hash (admin1234 และ 1234)
INSERT INTO user (userId, userName, email, password, role) VALUES
  (1, 'admin', 'admin@gmail.com', '$2b$10$s2Ql0GTK1NAJUM8bcwydJOSGkcnzlYKdWLz74PdtlztPSGErRSf1m', 'admin'),
  (2, 'Ann', 'Ann@gmail.com', '$2b$10$RO3Idxrausd3NrjeLDlWdeNyPufImuvL7KvHYpWr2hnoRoRPmDDnm', 'user'),
  (3, 'Bob', 'Bob@gmail.com', '$2b$10$RO3Idxrausd3NrjeLDlWdeNyPufImuvL7KvHYpWr2hnoRoRPmDDnm', 'user');

INSERT INTO menu (menuId, name, price, isBestSeller) VALUES
  (1, 'cake', 35, 1),
  (2, 'bread', 25, 0),
  (3, 'milk', 15, 1),
  (4, 'donut', 45, 0),
  (5, 'cookie', 55, 1);

INSERT INTO rating (userId, menuId, score) VALUES
  (2, 1, 4), (3, 1, 3),
  (2, 2, 5), (3, 2, 4),
  (2, 3, 4),
  (3, 5, 3);
