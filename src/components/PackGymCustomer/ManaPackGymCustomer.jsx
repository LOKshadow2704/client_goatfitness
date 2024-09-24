import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
} from "@mui/material";

function ManaPackGymCustomer() {
  const [gympack, setGymPack] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng item mỗi trang

  useEffect(() => {
    // Gọi API để lấy dữ liệu
    axios
      .get("http://localhost:8080/Backend/order-gympack/")
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setGymPack(response.data);
        } else {
          throw new Error("Lấy thông tin thất bại");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // Phân trang dữ liệu
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGymPack = gympack.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Khách hàng</TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Tên gói tập</TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Ngày đăng ký</TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Ngày hết hạn</TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Trạng thái thanh toán</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGymPack.map((value, index) => (
              <TableRow
                key={value.IDGoiTap}
                sx={{
                  backgroundColor: index % 2 === 0 ? "white" : "#f5f5f5", // Hàng lẻ màu trắng, hàng chẵn màu xám
                }}
              >
                <TableCell style={{ textAlign: "center" }}>{value.HoTen}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{value.TenGoiTap}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{value.NgayDangKy}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{value.NgayHetHan}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{value.TrangThaiThanhToan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} style={{ marginTop: "20px", float: "right" }}>
        <Pagination
          count={Math.ceil(gympack.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </div>
  );
}

export default ManaPackGymCustomer;
