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
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegisterPackModal from "../RegisterPackModal/RegisterPackModal";
import { AddCircleOutline } from "@mui/icons-material";

function ManaPackGymCustomer() {
  const [gympack, setGymPack] = useState([]);
  const [filteredGymPack, setFilteredGymPack] = useState([]); // Lưu trữ dữ liệu sau khi tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    // Gọi API để lấy dữ liệu
    axios
      .get("http://localhost:8080/Backend/order-gympack/")
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setGymPack(response.data);
          setFilteredGymPack(response.data); // Đặt dữ liệu ban đầu cho bảng
        } else {
          throw new Error("Lấy thông tin thất bại");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm

    // Lọc dựa trên searchTerm
    const filteredData = gympack.filter((pack) =>
      pack.HoTen.toLowerCase().includes(searchValue)
    );
    setFilteredGymPack(filteredData);
  };


  const handleSort = (e) => {
    const sortOption = e.target.value;
    setSortType(sortOption);
    
    // Bắt đầu với dữ liệu gốc hoặc dữ liệu đã lọc
    let sortedData = [...gympack]; 
  
    // Lọc theo trạng thái thanh toán
    if (sortOption === "unpaid") {
      sortedData = sortedData.filter(item => item.TrangThaiThanhToan === "Chưa thanh toán");
    } else if (sortOption === "paid") {
      sortedData = sortedData.filter(item => item.TrangThaiThanhToan === "Đã Thanh Toán");
    } else if (sortOption === "expiring") {
      // Không cần lọc ở đây, sẽ sắp xếp toàn bộ theo ngày hết hạn
    }
  
    // Sắp xếp theo ngày hết hạn cho tùy chọn sắp xếp "Sắp hết hạn"
    if (sortOption === "expiring") {
      const today = new Date();
      sortedData.sort((a, b) => {
        const dateA = new Date(a.NgayHetHan);
        const dateB = new Date(b.NgayHetHan);
        return dateA - dateB; // Sắp xếp theo ngày hết hạn
      });
    }
  
    setFilteredGymPack(sortedData); // Cập nhật lại dữ liệu đã được lọc và sắp xếp
  };
  
  
  
  // Phân trang dữ liệu
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGymPack = filteredGymPack.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      {showModal && (
        <RegisterPackModal
          data={gympack}
          setShowModal={setShowModal}
          onPackAdded={(newPack) =>
            setGymPack((prevGymPack) => [...prevGymPack, newPack])
          }
        />
      )}

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Tìm kiếm khách hàng"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            sx={{
              marginLeft: "10px",
              marginRight: "20px",
              "& .MuiInputBase-root": {
                height: "40px !important",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiInputLabel-root": {
                top: "-4px",
                fontSize: "14px",
              },
              "& .MuiOutlinedInput-input": {
                padding: "10px 14px",
                height: "40px",
              },
            }}
          />

<FormControl
  sx={{
    marginRight: "20px",
    "& .MuiInputBase-root": {
      height: "40px",
      width: "180px",
    },
    "& .MuiInputLabel-root": {
      top: "-6px",
      fontSize: "14px",
    },
    "& .MuiSelect-select": {
      padding: "10px 14px",
      height: "40px",
      display: "flex",
      alignItems: "center",
    },
  }}
>
  <Select
    value={sortType}
    onChange={handleSort}
    displayEmpty
    inputProps={{ "aria-label": "Sắp xếp theo" }}
  >
    <MenuItem value="">Sắp xếp theo</MenuItem>
    <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
    <MenuItem value="paid">Đã thanh toán</MenuItem>
    <MenuItem value="expiring">Sắp hết hạn</MenuItem>
  </Select>
</FormControl>

        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          startIcon={<AddCircleOutline fontSize="small" />}
        >
          Thêm đăng ký mới
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Khách hàng
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Tên gói tập
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Ngày đăng ký
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Ngày hết hạn
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Trạng thái thanh toán
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGymPack.length > 0 ? (
              paginatedGymPack.map((value, index) => (
                <TableRow
                  key={value.HoTen}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "white" : "#f5f5f5",
                  }}
                >
                  <TableCell style={{ textAlign: "center" }}>
                    {value.HoTen}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {value.TenGoiTap}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {value.NgayDangKy}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {value.NgayHetHan}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {value.TrangThaiThanhToan}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ marginRight: "5px" }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                    <Button variant="outlined" color="error">
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  Không tìm thấy kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} style={{ marginTop: "20px", float: "right" }}>
        <Pagination
          count={Math.ceil(filteredGymPack.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </div>
  );
}

export default ManaPackGymCustomer;
