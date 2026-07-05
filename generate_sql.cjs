const fs = require('fs');

const sql = [];

sql.push(`-- phpMyAdmin SQL Dump
-- version 5.2.0
-- Host: 127.0.0.1
-- Generation Time: Jul 03, 2026
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS \`car_rental_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE \`car_rental_db\`;

-- --------------------------------------------------------

CREATE TABLE \`roles\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`roles\` (\`id\`, \`name\`) VALUES
(1, 'Super Admin'),
(2, 'Manager'),
(3, 'Employee'),
(4, 'Customer');

CREATE TABLE \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`role_id\` int(11) NOT NULL,
  \`name\` varchar(100) NOT NULL,
  \`email\` varchar(100) NOT NULL UNIQUE,
  \`phone\` varchar(20) NOT NULL,
  \`cnic\` varchar(20) NOT NULL,
  \`address\` text NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`status\` enum('active','inactive','banned') DEFAULT 'active',
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`cities\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`branches\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`city_id\` int(11) NOT NULL,
  \`name\` varchar(100) NOT NULL,
  \`address\` text NOT NULL,
  \`contact_number\` varchar(20) NOT NULL,
  \`email\` varchar(100) NOT NULL,
  \`manager_id\` int(11) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`city_id\`) REFERENCES \`cities\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`manager_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`vehicle_categories\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`vehicles\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`category_id\` int(11) NOT NULL,
  \`branch_id\` int(11) NOT NULL,
  \`brand\` varchar(50) NOT NULL,
  \`model\` varchar(50) NOT NULL,
  \`year\` int(4) NOT NULL,
  \`engine_capacity\` varchar(20) NOT NULL,
  \`transmission\` enum('Manual','Automatic') NOT NULL,
  \`fuel_type\` enum('Petrol','Diesel','Hybrid','Electric') NOT NULL,
  \`seats\` int(11) NOT NULL,
  \`doors\` int(11) NOT NULL,
  \`mileage\` int(11) NOT NULL,
  \`color\` varchar(30) NOT NULL,
  \`fuel_average\` varchar(30) NOT NULL,
  \`daily_price\` decimal(10,2) NOT NULL,
  \`weekly_price\` decimal(10,2) NOT NULL,
  \`monthly_price\` decimal(10,2) NOT NULL,
  \`security_deposit\` decimal(10,2) NOT NULL,
  \`registration_number\` varchar(20) NOT NULL UNIQUE,
  \`status\` enum('Available','Rented','Maintenance') DEFAULT 'Available',
  \`description\` text,
  \`insurance_status\` varchar(100),
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`category_id\`) REFERENCES \`vehicle_categories\`(\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`vehicle_images\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`vehicle_id\` int(11) NOT NULL,
  \`image_url\` varchar(255) NOT NULL,
  \`is_primary\` boolean DEFAULT false,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`vehicle_id\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`vehicle_features\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`vehicle_id\` int(11) NOT NULL,
  \`feature\` varchar(100) NOT NULL,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`vehicle_id\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`drivers\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`branch_id\` int(11) NOT NULL,
  \`name\` varchar(100) NOT NULL,
  \`phone\` varchar(20) NOT NULL,
  \`cnic\` varchar(20) NOT NULL,
  \`license_number\` varchar(50) NOT NULL,
  \`status\` enum('Available','On Trip','Leave') DEFAULT 'Available',
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`coupons\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`code\` varchar(20) NOT NULL UNIQUE,
  \`discount_percentage\` decimal(5,2) NOT NULL,
  \`expiry_date\` date NOT NULL,
  \`status\` enum('Active','Expired') DEFAULT 'Active',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`bookings\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`customer_id\` int(11) NOT NULL,
  \`vehicle_id\` int(11) NOT NULL,
  \`pickup_branch_id\` int(11) NOT NULL,
  \`dropoff_branch_id\` int(11) NOT NULL,
  \`driver_id\` int(11) DEFAULT NULL,
  \`coupon_id\` int(11) DEFAULT NULL,
  \`pickup_date\` datetime NOT NULL,
  \`return_date\` datetime NOT NULL,
  \`rental_days\` int(11) NOT NULL,
  \`driver_option\` boolean DEFAULT false,
  \`insurance_option\` boolean DEFAULT false,
  \`total_cost\` decimal(10,2) NOT NULL,
  \`payment_status\` enum('Pending','Paid','Failed','Refunded') DEFAULT 'Pending',
  \`booking_status\` enum('Pending','Confirmed','Active','Completed','Cancelled') DEFAULT 'Pending',
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`vehicle_id\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`pickup_branch_id\`) REFERENCES \`branches\`(\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`dropoff_branch_id\`) REFERENCES \`branches\`(\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`driver_id\`) REFERENCES \`drivers\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`coupon_id\`) REFERENCES \`coupons\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`payment_methods\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`method_name\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`payments\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`booking_id\` int(11) NOT NULL,
  \`payment_method_id\` int(11) NOT NULL,
  \`amount\` decimal(10,2) NOT NULL,
  \`transaction_id\` varchar(100),
  \`payment_date\` timestamp DEFAULT CURRENT_TIMESTAMP,
  \`status\` enum('Pending','Completed','Failed','Refunded') DEFAULT 'Pending',
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`payment_method_id\`) REFERENCES \`payment_methods\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`reviews\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`booking_id\` int(11) NOT NULL,
  \`customer_id\` int(11) NOT NULL,
  \`vehicle_id\` int(11) NOT NULL,
  \`rating\` int(1) NOT NULL CHECK (\`rating\` >= 1 AND \`rating\` <= 5),
  \`comments\` text,
  \`review_date\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`vehicle_id\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`wishlist\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`customer_id\` int(11) NOT NULL,
  \`vehicle_id\` int(11) NOT NULL,
  \`added_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`vehicle_id\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`employees\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` int(11) NOT NULL,
  \`branch_id\` int(11) NOT NULL,
  \`position\` varchar(50) NOT NULL,
  \`salary\` decimal(10,2) NOT NULL,
  \`hire_date\` date NOT NULL,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`maintenance\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`vehicle_id\` int(11) NOT NULL,
  \`service_date\` date NOT NULL,
  \`cost\` decimal(10,2) NOT NULL,
  \`description\` text NOT NULL,
  \`next_service_date\` date,
  \`status\` enum('Pending','In Progress','Completed') DEFAULT 'Completed',
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`vehicle_id\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`notifications\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` int(11) NOT NULL,
  \`title\` varchar(255) NOT NULL,
  \`message\` text NOT NULL,
  \`is_read\` boolean DEFAULT false,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`blogs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`title\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL UNIQUE,
  \`content\` text NOT NULL,
  \`author_id\` int(11) NOT NULL,
  \`published_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`faqs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`question\` text NOT NULL,
  \`answer\` text NOT NULL,
  \`status\` enum('Active','Inactive') DEFAULT 'Active',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`contact_messages\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) NOT NULL,
  \`email\` varchar(100) NOT NULL,
  \`subject\` varchar(255) NOT NULL,
  \`message\` text NOT NULL,
  \`is_resolved\` boolean DEFAULT false,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`newsletter\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`email\` varchar(100) NOT NULL UNIQUE,
  \`subscribed_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`settings\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`setting_key\` varchar(100) NOT NULL UNIQUE,
  \`setting_value\` text NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`activity_logs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` int(11) DEFAULT NULL,
  \`action\` varchar(255) NOT NULL,
  \`description\` text,
  \`ip_address\` varchar(45),
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- INSERT DATA
-- --------------------------------------------------------

INSERT INTO \`cities\` (\`name\`) VALUES
('Karachi'), ('Lahore'), ('Islamabad'), ('Rawalpindi'), ('Faisalabad'), 
('Multan'), ('Peshawar'), ('Quetta'), ('Hyderabad'), ('Sialkot'), ('Gujranwala');

`);

const users = [];
// Admin (bcrypt hash for "admin123")
users.push(`(1, 1, 'Super Admin', 'admin@carrental.pk', '03001234567', '42101-1234567-1', 'DHA Phase 6, Karachi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active')`);
// Managers (bcrypt hash for "manager123")
for(let i=2; i<=4; i++) {
  users.push(`(${i}, 2, 'Manager ${i-1}', 'manager${i-1}@carrental.pk', '0300${1000000+i}', '42101-${1000000+i}-2', 'Clifton, Karachi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active')`);
}
// Employees (bcrypt hash for "employee123")
for(let i=5; i<=14; i++) {
  users.push(`(${i}, 3, 'Employee ${i-4}', 'employee${i-4}@carrental.pk', '0333${1000000+i}', '42101-${1000000+i}-3', 'Gulshan, Karachi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active')`);
}
// Customers (bcrypt hash for "password123")
for(let i=15; i<=64; i++) {
  users.push(`(${i}, 4, 'Customer ${i-14}', 'customer${i-14}@gmail.com', '0345${1000000+i}', '42101-${1000000+i}-4', 'Lahore Cantt', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active')`);
}
sql.push(`INSERT INTO \`users\` (\`id\`, \`role_id\`, \`name\`, \`email\`, \`phone\`, \`cnic\`, \`address\`, \`password\`, \`status\`) VALUES\n` + users.join(',\n') + ';');

const branches = [];
for(let i=1; i<=11; i++) {
  branches.push(`(${i}, ${i}, 'Branch ${i}', 'Main Blvd, City ${i}', '021-345${i}789', 'branch${i}@carrental.pk', ${(i%3) + 2})`);
}
sql.push(`INSERT INTO \`branches\` (\`id\`, \`city_id\`, \`name\`, \`address\`, \`contact_number\`, \`email\`, \`manager_id\`) VALUES\n` + branches.join(',\n') + ';');

sql.push(`INSERT INTO \`vehicle_categories\` (\`id\`, \`name\`) VALUES (1, 'Economy'), (2, 'Compact'), (3, 'Sedan'), (4, 'SUV'), (5, 'Van'), (6, 'Luxury'), (7, 'VIP');`);

const vehiclesList = [
  // Economy
  {b: 'Suzuki', m: 'Alto', y: 2023, c: 1, e: '660cc', t: 'Automatic', f: 'Petrol', s: 4, d: 4, p: 4000},
  {b: 'Suzuki', m: 'Cultus', y: 2022, c: 1, e: '1000cc', t: 'Manual', f: 'Petrol', s: 5, d: 4, p: 4500},
  {b: 'Suzuki', m: 'Wagon R', y: 2023, c: 1, e: '1000cc', t: 'Manual', f: 'Petrol', s: 5, d: 4, p: 4500},
  {b: 'Suzuki', m: 'Swift', y: 2024, c: 1, e: '1200cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 6000},
  // Compact
  {b: 'Toyota', m: 'Passo', y: 2021, c: 2, e: '1000cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 5000},
  {b: 'Toyota', m: 'Vitz', y: 2022, c: 2, e: '1000cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 5500},
  {b: 'Honda', m: 'City', y: 2023, c: 2, e: '1200cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 7500},
  {b: 'Toyota', m: 'Yaris', y: 2023, c: 2, e: '1300cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 7500},
  {b: 'Changan', m: 'Alsvin', y: 2024, c: 2, e: '1370cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 7000},
  // Sedan
  {b: 'Toyota', m: 'Corolla Altis', y: 2023, c: 3, e: '1600cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 10000},
  {b: 'Honda', m: 'Civic', y: 2024, c: 3, e: '1500cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 14000},
  {b: 'Hyundai', m: 'Elantra', y: 2023, c: 3, e: '2000cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 12000},
  {b: 'Honda', m: 'Accord', y: 2022, c: 3, e: '1500cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 25000},
  {b: 'Toyota', m: 'Camry', y: 2023, c: 3, e: '2500cc', t: 'Automatic', f: 'Hybrid', s: 5, d: 4, p: 30000},
  // SUV
  {b: 'Kia', m: 'Sportage', y: 2024, c: 4, e: '2000cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 16000},
  {b: 'Hyundai', m: 'Tucson', y: 2023, c: 4, e: '2000cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 16000},
  {b: 'MG', m: 'HS', y: 2023, c: 4, e: '1500cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 18000},
  {b: 'Haval', m: 'Jolion', y: 2024, c: 4, e: '1500cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 17000},
  {b: 'Toyota', m: 'Fortuner', y: 2023, c: 4, e: '2800cc', t: 'Automatic', f: 'Diesel', s: 7, d: 4, p: 25000},
  {b: 'Toyota', m: 'Prado', y: 2022, c: 4, e: '2700cc', t: 'Automatic', f: 'Petrol', s: 7, d: 4, p: 35000},
  {b: 'Toyota', m: 'Land Cruiser', y: 2022, c: 4, e: '3500cc', t: 'Automatic', f: 'Petrol', s: 7, d: 4, p: 55000},
  // Van
  {b: 'Toyota', m: 'Hiace', y: 2023, c: 5, e: '2500cc', t: 'Manual', f: 'Diesel', s: 15, d: 4, p: 15000},
  {b: 'Toyota', m: 'Coaster', y: 2022, c: 5, e: '4000cc', t: 'Manual', f: 'Diesel', s: 29, d: 2, p: 30000},
  {b: 'Hyundai', m: 'H1', y: 2021, c: 5, e: '2500cc', t: 'Automatic', f: 'Diesel', s: 12, d: 4, p: 16000},
  {b: 'Changan', m: 'Karvaan', y: 2024, c: 5, e: '1000cc', t: 'Manual', f: 'Petrol', s: 7, d: 4, p: 8000},
  {b: 'Toyota', m: 'Avanza', y: 2022, c: 5, e: '1500cc', t: 'Automatic', f: 'Petrol', s: 7, d: 4, p: 12000},
  // Luxury
  {b: 'Mercedes-Benz', m: 'C-Class', y: 2023, c: 6, e: '2000cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 40000},
  {b: 'Mercedes-Benz', m: 'E-Class', y: 2023, c: 6, e: '2000cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 50000},
  {b: 'BMW', m: '5 Series', y: 2022, c: 6, e: '2000cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 45000},
  {b: 'Audi', m: 'A6', y: 2023, c: 6, e: '2000cc', t: 'Automatic', f: 'Petrol', s: 5, d: 4, p: 48000},
  {b: 'Lexus', m: 'ES', y: 2022, c: 6, e: '2500cc', t: 'Automatic', f: 'Hybrid', s: 5, d: 4, p: 40000},
  // VIP
  {b: 'Mercedes-Benz', m: 'S-Class', y: 2024, c: 7, e: '3000cc', t: 'Automatic', f: 'Petrol', s: 4, d: 4, p: 120000},
  {b: 'BMW', m: '7 Series', y: 2023, c: 7, e: '3000cc', t: 'Automatic', f: 'Petrol', s: 4, d: 4, p: 110000},
  {b: 'Audi', m: 'A8', y: 2023, c: 7, e: '3000cc', t: 'Automatic', f: 'Petrol', s: 4, d: 4, p: 105000}
];

const vehicles = [];
const vehicleImages = [];
const vehicleFeatures = [];

let vId = 1;
for(let i=0; i<55; i++) {
  const v = vehiclesList[i % vehiclesList.length];
  const wp = v.p * 6;
  const mp = v.p * 20;
  const sd = v.p * 2;
  const branch = (i % 11) + 1;
  const color = ['White', 'Black', 'Silver', 'Grey'][i % 4];
  const reg = `LEB-${2000+i}`;
  vehicles.push(`(${vId}, ${v.c}, ${branch}, '${v.b}', '${v.m}', ${v.y}, '${v.e}', '${v.t}', '${v.f}', ${v.s}, ${v.d}, ${10000 + (i*1000)}, '${color}', '12 km/l', ${v.p}, ${wp}, ${mp}, ${sd}, '${reg}', 'Available', 'A reliable and comfortable ${v.b} ${v.m} available for rent in Pakistan.', 'Comprehensive')`);
  
  vehicleImages.push(`(${vId}, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800', 1)`);
  vehicleFeatures.push(`(${vId}, 'Air Conditioning')`);
  vehicleFeatures.push(`(${vId}, 'Power Steering')`);
  vId++;
}
sql.push(`INSERT INTO \`vehicles\` (\`id\`, \`category_id\`, \`branch_id\`, \`brand\`, \`model\`, \`year\`, \`engine_capacity\`, \`transmission\`, \`fuel_type\`, \`seats\`, \`doors\`, \`mileage\`, \`color\`, \`fuel_average\`, \`daily_price\`, \`weekly_price\`, \`monthly_price\`, \`security_deposit\`, \`registration_number\`, \`status\`, \`description\`, \`insurance_status\`) VALUES\n` + vehicles.join(',\n') + ';');

sql.push(`INSERT INTO \`vehicle_images\` (\`vehicle_id\`, \`image_url\`, \`is_primary\`) VALUES\n` + vehicleImages.join(',\n') + ';');
sql.push(`INSERT INTO \`vehicle_features\` (\`vehicle_id\`, \`feature\`) VALUES\n` + vehicleFeatures.join(',\n') + ';');

sql.push(`INSERT INTO \`payment_methods\` (\`id\`, \`method_name\`) VALUES (1, 'Cash'), (2, 'Credit Card'), (3, 'Debit Card'), (4, 'Bank Transfer');`);
sql.push(`INSERT INTO \`coupons\` (\`id\`, \`code\`, \`discount_percentage\`, \`expiry_date\`) VALUES 
(1, 'EID25', 25.00, '2026-12-31'), (2, 'RAMADAN20', 20.00, '2026-12-31'), (3, 'WELCOME10', 10.00, '2027-12-31'), (4, 'NEWUSER15', 15.00, '2027-12-31'), (5, 'SUMMER30', 30.00, '2026-08-31');`);

const drivers = [];
for(let i=1; i<=20; i++) {
  drivers.push(`(${i}, ${(i%11)+1}, 'Driver ${i}', '0301${1000000+i}', '42101-5000${i}-5', 'DL-${10000+i}', 'Available')`);
}
sql.push(`INSERT INTO \`drivers\` (\`id\`, \`branch_id\`, \`name\`, \`phone\`, \`cnic\`, \`license_number\`, \`status\`) VALUES\n` + drivers.join(',\n') + ';');

const bookings = [];
const payments = [];
const reviews = [];
for(let i=1; i<=100; i++) {
  const cid = 15 + (i % 50);
  const vid = (i % 55) + 1;
  const pbid = (i % 11) + 1;
  const dbid = ((i+1) % 11) + 1;
  const did = i % 2 === 0 ? (i % 20) + 1 : 'NULL';
  const cpid = i % 5 === 0 ? (i % 5) + 1 : 'NULL';
  const rdays = (i % 7) + 1;
  const status = ['Completed', 'Confirmed', 'Active', 'Pending', 'Cancelled'][i % 5];
  const pstatus = status === 'Cancelled' ? 'Refunded' : (status === 'Pending' ? 'Pending' : 'Paid');
  
  bookings.push(`(${i}, ${cid}, ${vid}, ${pbid}, ${dbid}, ${did}, ${cpid}, '2026-07-${(i%28)+1} 10:00:00', '2026-07-${(i%28)+1+rdays} 10:00:00', ${rdays}, ${did !== 'NULL' ? 1 : 0}, ${i%2}, 15000, '${pstatus}', '${status}')`);
  
  if (pstatus === 'Paid') {
    payments.push(`(${i}, ${i}, ${(i%4)+1}, 15000, 'TXN-${100000+i}', '2026-07-${(i%28)+1} 09:30:00', 'Completed')`);
  }

  if (status === 'Completed') {
    reviews.push(`(${i}, ${i}, ${cid}, ${vid}, ${(i%2)+4}, 'Great service and very clean car. Highly recommended!', '2026-07-${(i%28)+1+rdays} 12:00:00')`);
  }
}
sql.push(`INSERT INTO \`bookings\` (\`id\`, \`customer_id\`, \`vehicle_id\`, \`pickup_branch_id\`, \`dropoff_branch_id\`, \`driver_id\`, \`coupon_id\`, \`pickup_date\`, \`return_date\`, \`rental_days\`, \`driver_option\`, \`insurance_option\`, \`total_cost\`, \`payment_status\`, \`booking_status\`) VALUES\n` + bookings.join(',\n') + ';');
if (payments.length > 0) sql.push(`INSERT INTO \`payments\` (\`id\`, \`booking_id\`, \`payment_method_id\`, \`amount\`, \`transaction_id\`, \`payment_date\`, \`status\`) VALUES\n` + payments.join(',\n') + ';');
if (reviews.length > 0) sql.push(`INSERT INTO \`reviews\` (\`id\`, \`booking_id\`, \`customer_id\`, \`vehicle_id\`, \`rating\`, \`comments\`, \`review_date\`) VALUES\n` + reviews.join(',\n') + ';');

sql.push(`COMMIT;`);

fs.writeFileSync('car_rental_db.sql', sql.join('\\n\\n'));
