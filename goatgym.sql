-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 27, 2024 at 10:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `goatgym`
--

-- --------------------------------------------------------

--
-- Table structure for table `checkin`
--

CREATE TABLE `checkin` (
  `TenDangNhap` varchar(30) NOT NULL,
  `ThoiGian` date NOT NULL,
  `CheckOut` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chitietdonhang`
--

CREATE TABLE `chitietdonhang` (
  `IDSanPham` int(11) NOT NULL,
  `IDDonHang` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chitietdonhang`
--

INSERT INTO `chitietdonhang` (`IDSanPham`, `IDDonHang`, `SoLuong`) VALUES
(1, 82, 1),
(1, 83, 1),
(1, 84, 1),
(11, 85, 2),
(10, 85, 2),
(1, 86, 1),
(11, 87, 4),
(1, 88, 1),
(10, 89, 2),
(1, 89, 1),
(11, 90, 1),
(10, 91, 1),
(11, 92, 2),
(11, 93, 1),
(10, 94, 1),
(11, 94, 1),
(11, 95, 1),
(11, 96, 1),
(10, 97, 1),
(10, 98, 1),
(11, 99, 1),
(11, 100, 1),
(11, 101, 1),
(10, 102, 1),
(10, 103, 1),
(10, 104, 1),
(10, 105, 1),
(10, 106, 1),
(10, 107, 1),
(10, 108, 1),
(10, 109, 1),
(10, 110, 1),
(10, 111, 1),
(10, 112, 1),
(10, 113, 1),
(11, 114, 1),
(11, 115, 1),
(11, 116, 1),
(15, 117, 1),
(15, 118, 1),
(11, 119, 1),
(11, 120, 1),
(11, 121, 1),
(16, 122, 1);

-- --------------------------------------------------------

--
-- Table structure for table `donhang`
--

CREATE TABLE `donhang` (
  `IDDonHang` int(11) NOT NULL,
  `IDKhachHang` int(11) NOT NULL,
  `IDHinhThuc` int(11) NOT NULL,
  `NgayDat` date NOT NULL,
  `NgayGiaoDuKien` date NOT NULL,
  `TrangThaiThanhToan` varchar(100) NOT NULL,
  `DiaChi` text NOT NULL,
  `ThanhTien` bigint(20) NOT NULL,
  `TrangThai` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donhang`
--

INSERT INTO `donhang` (`IDDonHang`, `IDKhachHang`, `IDHinhThuc`, `NgayDat`, `NgayGiaoDuKien`, `TrangThaiThanhToan`, `DiaChi`, `ThanhTien`, `TrangThai`) VALUES
(82, 4, 1, '2024-05-25', '2024-05-29', 'Chưa thanh toán', '13 nguyễn văn bảo', 154000, 'Chưa xác nhận'),
(83, 4, 2, '2024-05-26', '2024-05-29', 'Chưa thanh toán', '13 nguyễn văn bảo', 154000, 'Chưa xác nhận'),
(84, 4, 2, '2024-05-26', '2024-05-29', 'Chưa thanh toán', '13 nguyễn văn bảo', 154000, 'Chưa xác nhận'),
(85, 7, 1, '2024-05-26', '2024-05-29', 'Chưa thanh toán', '13 nguyễn văn bảo', 3980000, 'Chưa xác nhận'),
(86, 7, 1, '2024-05-26', '2024-05-29', 'Chưa thanh toán', '13 nguyễn văn bảo', 154000, 'Chưa xác nhận'),
(87, 7, 2, '2024-05-28', '2024-05-31', 'Đã Thanh Toán', '13 nguyễn văn bảo', 1600000, 'Chưa xác nhận'),
(88, 7, 1, '2024-05-29', '2024-06-01', 'Chưa thanh toán', '13 nguyễn văn bảo', 1540000, 'Chưa xác nhận'),
(89, 7, 2, '2024-05-29', '2024-06-01', 'Chưa thanh toán', '13 nguyễn văn bảo', 4720000, 'Chưa xác nhận'),
(90, 7, 1, '2024-06-08', '2024-06-11', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Đã xác nhận'),
(91, 12, 2, '2024-06-23', '2024-06-26', 'Đã Thanh Toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(92, 7, 1, '2024-07-05', '2024-07-08', 'Chưa thanh toán', '13 nguyễn văn bảo', 800000, 'Chưa xác nhận'),
(93, 7, 2, '2024-07-05', '2024-07-08', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(94, 7, 1, '2024-07-05', '2024-07-08', 'Chưa thanh toán', '13 nguyễn văn bảo', 1990000, 'Chưa xác nhận'),
(95, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(96, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(97, 16, 1, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(98, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(99, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(100, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(101, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(102, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(103, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(104, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(105, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(106, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(107, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(108, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(109, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(110, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(111, 16, 1, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(112, 16, 1, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(113, 16, 1, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 1590000, 'Chưa xác nhận'),
(114, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(115, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(116, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(117, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 250000, 'Chưa xác nhận'),
(118, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 250000, 'Chưa xác nhận'),
(119, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(120, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(121, 16, 2, '2024-07-15', '2024-07-18', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận'),
(122, 16, 2, '2024-07-17', '2024-07-20', 'Chưa thanh toán', '13 nguyễn văn bảo', 400000, 'Chưa xác nhận');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_product`
--

CREATE TABLE `feedback_product` (
  `IDKhachHang` int(11) NOT NULL,
  `comment` text NOT NULL,
  `rate` int(11) NOT NULL,
  `IDSanPham` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback_pt`
--

CREATE TABLE `feedback_pt` (
  `IDHLV` int(11) NOT NULL,
  `IDKhachHang` int(11) NOT NULL,
  `comment` text NOT NULL,
  `rate` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `giohang`
--

CREATE TABLE `giohang` (
  `IDKhachHang` int(11) NOT NULL,
  `IDSanPham` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `giohang`
--

INSERT INTO `giohang` (`IDKhachHang`, `IDSanPham`, `SoLuong`) VALUES
(4, 1, 1),
(12, 10, 51),
(12, 11, 89),
(12, 15, 49),
(12, 1, 7),
(12, 16, 2),
(7, 1, 2),
(7, 10, 2),
(16, 15, 1),
(16, 16, 1),
(7, 15, 1);

-- --------------------------------------------------------

--
-- Table structure for table `goitap`
--

CREATE TABLE `goitap` (
  `IDGoiTap` int(11) NOT NULL,
  `TenGoiTap` varchar(100) NOT NULL,
  `ThoiHan` int(11) NOT NULL,
  `Gia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `goitap`
--

INSERT INTO `goitap` (`IDGoiTap`, `TenGoiTap`, `ThoiHan`, `Gia`) VALUES
(1, 'classic-1', 30, 2000000),
(2, 'classic-3', 90, 5000000),
(3, 'classic-6', 180, 8000000),
(4, 'royal-12', 360, 14000000),
(5, 'royal-30', 900, 28000000);

-- --------------------------------------------------------

--
-- Table structure for table `hinhthucthanhtoan`
--

CREATE TABLE `hinhthucthanhtoan` (
  `IDHinhThuc` int(11) NOT NULL,
  `TenHinhThuc` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hinhthucthanhtoan`
--

INSERT INTO `hinhthucthanhtoan` (`IDHinhThuc`, `TenHinhThuc`) VALUES
(1, 'VNPay '),
(2, 'Thanh toán khi nhận hàng');

-- --------------------------------------------------------

--
-- Table structure for table `hlv`
--

CREATE TABLE `hlv` (
  `IDHLV` int(11) NOT NULL,
  `DichVu` varchar(50) NOT NULL,
  `GiaThue` int(11) NOT NULL,
  `ChungChi` text NOT NULL,
  `DanhGia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hlv`
--

INSERT INTO `hlv` (`IDHLV`, `DichVu`, `GiaThue`, `ChungChi`, `DanhGia`) VALUES
(1, 'Gym', 300000, 'NASM– National Academy of Sports Medicine', 4);

-- --------------------------------------------------------

--
-- Table structure for table `hoadonthuegoitap`
--

CREATE TABLE `hoadonthuegoitap` (
  `IDHoaDon` int(11) NOT NULL,
  `IDKhachHang` int(11) NOT NULL,
  `IDGoiTap` int(11) NOT NULL,
  `TrangThaiThanhToan` varchar(100) NOT NULL,
  `NgayDangKy` date NOT NULL,
  `NgayHetHan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hoadonthuegoitap`
--

INSERT INTO `hoadonthuegoitap` (`IDHoaDon`, `IDKhachHang`, `IDGoiTap`, `TrangThaiThanhToan`, `NgayDangKy`, `NgayHetHan`) VALUES
(57, 4, 1, 'Chưa thanh toán', '2024-05-24', '2024-06-23'),
(60, 7, 5, 'Chưa thanh toán', '2024-05-29', '2026-11-15'),
(61, 16, 4, 'Chưa thanh toán', '2024-07-16', '2025-07-11');

-- --------------------------------------------------------

--
-- Table structure for table `hoadonthuept`
--

CREATE TABLE `hoadonthuept` (
  `IDHoaDon` int(11) NOT NULL,
  `IDKhachHang` int(11) NOT NULL,
  `IDHLV` int(11) NOT NULL,
  `TrangThaiThanhToan` varchar(50) NOT NULL,
  `NgayDangKy` datetime NOT NULL,
  `NgayHetHan` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hoadonthuept`
--

INSERT INTO `hoadonthuept` (`IDHoaDon`, `IDKhachHang`, `IDHLV`, `TrangThaiThanhToan`, `NgayDangKy`, `NgayHetHan`) VALUES
(24, 7, 1, 'Chưa thanh toán', '2024-05-29 12:00:00', '2024-05-29 13:00:00'),
(25, 7, 1, 'Chưa thanh toán', '2024-07-05 08:00:00', '2024-07-05 09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `khachhang`
--

CREATE TABLE `khachhang` (
  `IDKhachHang` int(11) NOT NULL,
  `TenDangNhap` varchar(30) NOT NULL,
  `IDHLV` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `khachhang`
--

INSERT INTO `khachhang` (`IDKhachHang`, `TenDangNhap`, `IDHLV`) VALUES
(4, 'locplayer', NULL),
(7, 'locplayer27', NULL),
(9, 'ThanhKhacHang', NULL),
(10, 'thanhabcxyz', 1),
(11, 'nguyenloca', NULL),
(12, 'khachhangloc', NULL),
(13, 'khachhangdfdfs', NULL),
(14, 'nguyenthanhloc', NULL),
(15, 'adminnguyen1', NULL),
(16, 'khachhangloc1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kho`
--

CREATE TABLE `kho` (
  `IDSanPham` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kho`
--

INSERT INTO `kho` (`IDSanPham`, `SoLuong`) VALUES
(1, 99997),
(10, 9999979),
(11, 99999977),
(15, 99997),
(16, 99998);

-- --------------------------------------------------------

--
-- Table structure for table `loaisanpham`
--

CREATE TABLE `loaisanpham` (
  `IDLoaiSanPham` int(11) NOT NULL,
  `TenLoaiSanPham` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loaisanpham`
--

INSERT INTO `loaisanpham` (`IDLoaiSanPham`, `TenLoaiSanPham`) VALUES
(1, 'Whey Protein'),
(2, 'Gloves - Găng tay'),
(3, 'Belts - Thắt lưng'),
(4, 'Shaker - Bình lắc'),
(5, 'Clothing - Quần áo');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `TenDangNhap` varchar(255) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `agent` varchar(7) NOT NULL DEFAULT 'WEB',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `TenDangNhap`, `refresh_token`, `agent`, `created_at`, `expires_at`) VALUES
(33, 'locplayer27', '2aecd64d1281b7308d49f1616f3bea3eece4d9dc85579e79c8b9edc49f9b03e4', 'WEB', '2024-09-27 08:40:37', '2024-10-27 15:40:37');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `IDVaiTro` int(11) NOT NULL,
  `TenVaiTro` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`IDVaiTro`, `TenVaiTro`) VALUES
(1, 'admin'),
(2, 'employee'),
(3, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `sanpham`
--

CREATE TABLE `sanpham` (
  `IDSanPham` int(11) NOT NULL,
  `IDLoaiSanPham` int(11) NOT NULL,
  `TenSP` varchar(100) NOT NULL,
  `Mota` text NOT NULL,
  `DonGia` int(11) NOT NULL,
  `IMG` text NOT NULL,
  `Discount` int(2) NOT NULL,
  `DaBan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sanpham`
--

INSERT INTO `sanpham` (`IDSanPham`, `IDLoaiSanPham`, `TenSP`, `Mota`, `DonGia`, `IMG`, `Discount`, `DaBan`) VALUES
(1, 1, 'BPI ISO HD 100  Pure Isolate Protein, 5 Lbs (69 Servings)', '<table>\r\n<colgroup>\r\n	<col>\r\n	<col>\r\n</colgroup>\r\n<tbody>\r\n<tr>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">Thành phần chính</span></p></td>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">100% Whey Protein Isolate</span></p></td>\r\n</tr>\r\n<tr>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">Giá trị dinh dưỡng</span></p></td>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">25g Protein, 120 calo, 5,5g BCAA</span></p></td>\r\n</tr>\r\n<tr>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">Hương vị</span></p></td>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">Vanilla Cookie, Chocolate Brownie, Cookie Cream</span></p></td>\r\n</tr>\r\n<tr>\r\n	<td><span style=\"font-size:14px;\">Đóng gói</span></td>\r\n	<td><span style=\"font-size:14px;\">Hộp 2.2kg ~ 69 servings</span></td>\r\n</tr>\r\n<tr>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">Serving Size</span></p></td>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">1 serving = 1 muỗng = 32g</span></p></td>\r\n</tr>\r\n<tr>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">Xuất xứ</span></p></td>\r\n	<td>\r\n	<p dir=\"ltr\"><span style=\"font-size:14px;\">BPI Sports - Mỹ</span></p></td>\r\n</tr>\r\n</tbody></table>', 1540000, 'https://i.ibb.co/vVckGgH/BPI-ISO-HD-100-Pure-Isolate-Protein-5-Lbs-69-Servings.png', 0, 0),
(10, 1, 'ON Whey Gold Standard 100  Whey Protein, 5 Lbs', 'Whey Gold sử dụng Whey Protein Isolate là thành phần chính. Vì vậy nguồn Whey Protein trong sản phẩm có chất lượng cao được tách hoàn toàn 100% Carbohydrate, chất béo và lactose bằng công nghệ lọc độc quyền của hãng.\n\n \n\nĐồng thời đi kèm với Whey Protein Concentrate đã được áp dụng công nghệ siêu lọc cao cấp của hãng để có thể tạo nên 24g Protein siêu tinh khiết, giá trị sinh học cao giúp xây dựng cơ bắp của bạn sau khi tập luyện.\n\n \n\nWhey ON Gold Standard dễ dàng hòa tan đi kèm với hương vị thơm ngon tự nhiên kể cả khi pha với nước lọc. \n\n \n\n✓ 24g Protein hấp thụ nhanh giúp phát triển, phục hồi cơ bắp hiệu quả. \n\n✓ 5.5g BCAA tăng khả năng tổng hợp Protein sau tập, đồng thời giúp phục hồi và chống dị hóa cơ bắp sau tập. \n\n✓ Không Gluten \n\n✓ Không có hormone nhân tạo \n\n✓ Đạt chứng nhận Informed Choice về chất lượng sản phẩm ', 1590000, 'https://i.ibb.co/ScjX0yd/ON-Whey-Gold-Standard-100-Whey-Protein-5-Lbs.png', 0, 0),
(11, 4, 'Bình giữ nhiệt GOZEN Normal 355ml', 'FDA Hoa Kỳ chứng nhận chất lượng.\nNắp chai được thiết kế đặc biệt: Công nghệ Twist-Free với 3 điểm chạm \nSiêu chống tràn có thể xoay bình 360 độ mà không lo rò rỉ.\nGiữ nhiệt số 1: 36 giờ lạnh và 18h nóng.\nChống sốc nhiệt khi cầm trên tay\nChịu được va đập tương đối.\nVan xả khí: thoải mái đựng được mọi đồ uống như bia hơi, nước có gas.', 400000, 'https://i.ibb.co/VQKqbFD/B-nh-gi-nhi-t-GOZEN-Normal-355ml.png', 0, 0),
(15, 2, 'Găng tay Aolike Gloves Pro Wrist Wrap', 'Găng tay Aolike Gloves Pro Wrist Wrap · Đối tượng sử dụng: Gym, Yoga, đạp xe, leo núi, thể dục dụng cụ · Chất liệu: Nylon, silicon · Bổ sung thêm dây cuốn trợ', 250000, 'https://i.ibb.co/BPSrWkx/G-ng-tay-t-p-Gym-n-Women-KHUY-N-M-I-U-I.png', 0, 0),
(16, 2, 'Găng tay tập Gym nam Gofit Men\'s Xtrainer', 'Găng tay tăng cường thêm một lớp lót co dãn bên trong, đôi găng tay này sẽ giúp bạn tăng cường độ bám khi luyện tập đồng thời giảm áp lực lên nhiều điểm trên lòng bàn tay.', 400000, 'https://i.ibb.co/8PXywYK/G-ng-tay-t-p-Gym-nam-Gofit-Men-s-Xtrainer.png', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `taikhoan`
--

CREATE TABLE `taikhoan` (
  `TenDangNhap` varchar(30) NOT NULL,
  `MatKhau` varchar(100) NOT NULL,
  `IDVaiTro` int(11) NOT NULL,
  `HoTen` varchar(50) NOT NULL,
  `DiaChi` text NOT NULL,
  `Email` varchar(100) NOT NULL,
  `SDT` varchar(10) NOT NULL,
  `TrangThai` varchar(100) NOT NULL,
  `avt` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `taikhoan`
--

INSERT INTO `taikhoan` (`TenDangNhap`, `MatKhau`, `IDVaiTro`, `HoTen`, `DiaChi`, `Email`, `SDT`, `TrangThai`, `avt`) VALUES
('adminnguyen', '1dd9b89e6192a21fc35a2762593b2b9a403a3f7b852129edc1a15138b3d1c964', 1, 'Nguyễn Thành Lộc admin', 'Phan Văn Trị', '11111x1y1x1y@gmail.com', '0395056638', 'Offline', 'https://i.ibb.co/vHxk2vv/Ao-tanktop-rong-nach-nam.jpg'),
('adminnguyen1', '1dd9b89e6192a21fc35a2762593b2b9a403a3f7b852129edc1a15138b3d1c964', 3, '1fsafdfsa fdsaf', '12 nguễn văn bảo', 'nguyenlocface@gmail.com', '0359653324', '0', 'https://i.imgur.com/2MUWzRp.jpg'),
('khachhangdfdfs', '1dd9b89e6192a21fc35a2762593b2b9a403a3f7b852129edc1a15138b3d1c964', 3, '1fsafdfsa fdsaf', 'wtewtrewt', 'nguyenlocface@gmail.com', '0328058832', '0', 'https://i.imgur.com/2MUWzRp.jpg'),
('khachhangloc', 'b34ff998d1e6e2a6bce30b8138d1cf4599a65548827720548d5f1b1e3aa5ffa9', 3, 'Nguyễn Thành Lộc', '13 nguyễn văn bảo', 'nguyenlocface@gmail.com', '0323287238', 'Offline', 'https://i.ibb.co/8sxDsJq/79d7c8985525f65ca5055d386b3c4131.jpg'),
('khachhangloc1', '1dd9b89e6192a21fc35a2762593b2b9a403a3f7b852129edc1a15138b3d1c964', 3, 'nguyen loc', '13 nguyễn văn bảo', 'nguyenlocface@gmail.com', '0328058832', 'Online', 'https://i.imgur.com/2MUWzRp.jpg'),
('locplayer', '1dd9b89e6192a21fc35a2762593b2b9a403a3f7b852129edc1a15138b3d1c964', 2, 'Nguyễn Thành Lộc Employee', 'Mỹ Long', 'lhh25062002@gmail.com', '0328058832', 'Online', 'https://i.ibb.co/qFnjhBx/G-ng-tay-Aolike-Gloves-Pro-Wrist-Wrap.png'),
('locplayer27', '1dd9b89e6192a21fc35a2762593b2b9a403a3f7b852129edc1a15138b3d1c964', 3, 'Lộc Khách Hàng 1', '13 nguyễn văn bảo', 'lhh25062002@gmail.com', '0359653324', 'Online', 'https://i.ibb.co/jhm89hB/pt-cr7.jpg'),
('nguyenloca', '9a289d4841f64e6546a887f537224f2348bffbb310e13a84e1013993a7ce36b0', 3, 'Nguyễn Thành Lộc', '13 nguyễn văn bảo', 'nguyenlocface@gmail.com', '0312342342', 'Offline', 'https://i.imgur.com/2MUWzRp.jpg'),
('nguyenthanhloc', '1dd9b89e6192a21fc35a2762593b2b9a403a3f7b852129edc1a15138b3d1c964', 3, '1fsafdfsa fdsaf', 'wtewtrewt', 'nguyenlocface@gmail.com', '0328058832', '0', 'https://i.imgur.com/2MUWzRp.jpg'),
('thanhabcxyz', '9a289d4841f64e6546a887f537224f2348bffbb310e13a84e1013993a7ce36b0', 3, 'Nguyễn Văn Thanh', 'fdsfs', 'nguyenlocface@gmail.com', '0328058832', '0', 'https://i.imgur.com/Yh9YN2A.jpg'),
('ThanhKhacHang', '9a289d4841f64e6546a887f537224f2348bffbb310e13a84e1013993a7ce36b0', 3, 'Nguyen Tien Thanh', 'fdgf', 'nguyentienthanh@gmail.com', '0123123123', '0', 'https://i.imgur.com/2MUWzRp.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `thongbao`
--

CREATE TABLE `thongbao` (
  `ID` int(11) NOT NULL,
  `TieuDe` varchar(100) NOT NULL,
  `NoiDung` text NOT NULL,
  `TenDangNhap` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `checkin`
--
ALTER TABLE `checkin`
  ADD KEY `TenDangNhap` (`TenDangNhap`);

--
-- Indexes for table `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD KEY `IDDonHang` (`IDDonHang`),
  ADD KEY `IDSanPham` (`IDSanPham`);

--
-- Indexes for table `donhang`
--
ALTER TABLE `donhang`
  ADD PRIMARY KEY (`IDDonHang`),
  ADD KEY `IDKhachHang` (`IDKhachHang`),
  ADD KEY `IDHinhThuc` (`IDHinhThuc`);

--
-- Indexes for table `feedback_product`
--
ALTER TABLE `feedback_product`
  ADD KEY `IDKhachHang` (`IDKhachHang`),
  ADD KEY `IDSanPham` (`IDSanPham`);

--
-- Indexes for table `feedback_pt`
--
ALTER TABLE `feedback_pt`
  ADD KEY `IDHLV` (`IDHLV`),
  ADD KEY `IDKhachHang` (`IDKhachHang`);

--
-- Indexes for table `giohang`
--
ALTER TABLE `giohang`
  ADD KEY `IDKhachHang` (`IDKhachHang`),
  ADD KEY `IDSanPham` (`IDSanPham`);

--
-- Indexes for table `goitap`
--
ALTER TABLE `goitap`
  ADD PRIMARY KEY (`IDGoiTap`);

--
-- Indexes for table `hinhthucthanhtoan`
--
ALTER TABLE `hinhthucthanhtoan`
  ADD PRIMARY KEY (`IDHinhThuc`);

--
-- Indexes for table `hlv`
--
ALTER TABLE `hlv`
  ADD PRIMARY KEY (`IDHLV`);

--
-- Indexes for table `hoadonthuegoitap`
--
ALTER TABLE `hoadonthuegoitap`
  ADD PRIMARY KEY (`IDHoaDon`),
  ADD KEY `IDGoiTap` (`IDGoiTap`),
  ADD KEY `IDKhachHang` (`IDKhachHang`);

--
-- Indexes for table `hoadonthuept`
--
ALTER TABLE `hoadonthuept`
  ADD PRIMARY KEY (`IDHoaDon`),
  ADD KEY `IDHLV` (`IDHLV`),
  ADD KEY `IDKhachHang` (`IDKhachHang`);

--
-- Indexes for table `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`IDKhachHang`),
  ADD KEY `IDH` (`IDHLV`),
  ADD KEY `TenDangNhap` (`TenDangNhap`);

--
-- Indexes for table `kho`
--
ALTER TABLE `kho`
  ADD KEY `IDSanPham` (`IDSanPham`);

--
-- Indexes for table `loaisanpham`
--
ALTER TABLE `loaisanpham`
  ADD PRIMARY KEY (`IDLoaiSanPham`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TenDangNhap` (`TenDangNhap`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`IDVaiTro`);

--
-- Indexes for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`IDSanPham`),
  ADD KEY `IDLoaiSanPham` (`IDLoaiSanPham`);

--
-- Indexes for table `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`TenDangNhap`),
  ADD KEY `IDVaiTro` (`IDVaiTro`);

--
-- Indexes for table `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `donhang`
--
ALTER TABLE `donhang`
  MODIFY `IDDonHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT for table `goitap`
--
ALTER TABLE `goitap`
  MODIFY `IDGoiTap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `hinhthucthanhtoan`
--
ALTER TABLE `hinhthucthanhtoan`
  MODIFY `IDHinhThuc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `hlv`
--
ALTER TABLE `hlv`
  MODIFY `IDHLV` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `hoadonthuegoitap`
--
ALTER TABLE `hoadonthuegoitap`
  MODIFY `IDHoaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `hoadonthuept`
--
ALTER TABLE `hoadonthuept`
  MODIFY `IDHoaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `IDKhachHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `loaisanpham`
--
ALTER TABLE `loaisanpham`
  MODIFY `IDLoaiSanPham` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `IDVaiTro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `IDSanPham` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `thongbao`
--
ALTER TABLE `thongbao`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `checkin`
--
ALTER TABLE `checkin`
  ADD CONSTRAINT `checkin_ibfk_1` FOREIGN KEY (`TenDangNhap`) REFERENCES `taikhoan` (`TenDangNhap`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD CONSTRAINT `chitietdonhang_ibfk_1` FOREIGN KEY (`IDDonHang`) REFERENCES `donhang` (`IDDonHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chitietdonhang_ibfk_2` FOREIGN KEY (`IDSanPham`) REFERENCES `sanpham` (`IDSanPham`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`IDKhachHang`) REFERENCES `khachhang` (`IDKhachHang`),
  ADD CONSTRAINT `donhang_ibfk_2` FOREIGN KEY (`IDHinhThuc`) REFERENCES `hinhthucthanhtoan` (`IDHinhThuc`);

--
-- Constraints for table `feedback_product`
--
ALTER TABLE `feedback_product`
  ADD CONSTRAINT `feedback_product_ibfk_1` FOREIGN KEY (`IDKhachHang`) REFERENCES `khachhang` (`IDKhachHang`),
  ADD CONSTRAINT `feedback_product_ibfk_2` FOREIGN KEY (`IDSanPham`) REFERENCES `sanpham` (`IDSanPham`);

--
-- Constraints for table `feedback_pt`
--
ALTER TABLE `feedback_pt`
  ADD CONSTRAINT `feedback_pt_ibfk_1` FOREIGN KEY (`IDHLV`) REFERENCES `hlv` (`IDHLV`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `feedback_pt_ibfk_2` FOREIGN KEY (`IDKhachHang`) REFERENCES `khachhang` (`IDKhachHang`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `giohang`
--
ALTER TABLE `giohang`
  ADD CONSTRAINT `giohang_ibfk_1` FOREIGN KEY (`IDKhachHang`) REFERENCES `khachhang` (`IDKhachHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `giohang_ibfk_2` FOREIGN KEY (`IDSanPham`) REFERENCES `sanpham` (`IDSanPham`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hoadonthuegoitap`
--
ALTER TABLE `hoadonthuegoitap`
  ADD CONSTRAINT `hoadonthuegoitap_ibfk_1` FOREIGN KEY (`IDGoiTap`) REFERENCES `goitap` (`IDGoiTap`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hoadonthuegoitap_ibfk_2` FOREIGN KEY (`IDKhachHang`) REFERENCES `khachhang` (`IDKhachHang`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hoadonthuept`
--
ALTER TABLE `hoadonthuept`
  ADD CONSTRAINT `hoadonthuept_ibfk_1` FOREIGN KEY (`IDHLV`) REFERENCES `hlv` (`IDHLV`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hoadonthuept_ibfk_2` FOREIGN KEY (`IDKhachHang`) REFERENCES `khachhang` (`IDKhachHang`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `khachhang`
--
ALTER TABLE `khachhang`
  ADD CONSTRAINT `khachhang_ibfk_1` FOREIGN KEY (`IDHLV`) REFERENCES `hlv` (`IDHLV`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `khachhang_ibfk_2` FOREIGN KEY (`TenDangNhap`) REFERENCES `taikhoan` (`TenDangNhap`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kho`
--
ALTER TABLE `kho`
  ADD CONSTRAINT `kho_ibfk_1` FOREIGN KEY (`IDSanPham`) REFERENCES `sanpham` (`IDSanPham`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`TenDangNhap`) REFERENCES `taikhoan` (`TenDangNhap`);

--
-- Constraints for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`IDLoaiSanPham`) REFERENCES `loaisanpham` (`IDLoaiSanPham`);

--
-- Constraints for table `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `taikhoan_ibfk_1` FOREIGN KEY (`IDVaiTro`) REFERENCES `role` (`IDVaiTro`);

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `delete_old_refresh_tokens` ON SCHEDULE EVERY 1 DAY STARTS '2024-08-30 22:54:23' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM refresh_tokens WHERE expires_at <= NOW()$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
