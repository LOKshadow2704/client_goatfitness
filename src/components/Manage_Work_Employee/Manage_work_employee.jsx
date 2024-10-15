import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
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
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateInvoiceModal from "../UpdateInvoiceGympack/UpdateInvoiceGympack";
import RegisterPackModal from "../RegisterPackModal/RegisterPackModal";
import { AddCircleOutline } from "@mui/icons-material";

function ManageWorkEmployee() {
  const [workemployee, setWorkEmployee] = useState([]);
  const [filteredWorkEmployee, setFilteredWorkEmployee] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [update, setUpdate] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [workEmployeeToDelete, setWorkEmployeeToDelete] = useState(null);
  const { setSuccess, setError, setMessage } = useAnnouncement();
  const [rerender, setRerender] = useState(false);
  const [selectedService, setSelectedService] = useState('');



  useEffect(() => {
    // Gọi API để lấy dữ liệu
    axios
      .get("http://localhost:8080/Backend/PT")
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setWorkEmployee(response.data);
          setFilteredWorkEmployee(response.data); 
        } else {
          throw new Error("Lấy thông tin thất bại");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [update, rerender, showModal]);

  //Hàm tìm kiếm
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase(); // Lấy giá trị tìm kiếm
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm

    // Lọc dựa trên tên HLV (TenHLV)
    const filteredData = workemployee.filter((pack) =>
        pack.TenHLV.toLowerCase().includes(searchValue)
    );

    setFilteredWorkEmployee(filteredData);
  };

  //Hàm lọc
  const handleFilter = (e) => {
    const selectedService = e.target.value; // Lấy dịch vụ được chọn
    setSelectedService(selectedService);

    // Nếu không chọn dịch vụ, hiển thị tất cả
    if (!selectedService) {
        setFilteredWorkEmployee(workemployee);
    } else {
        // Lọc theo dịch vụ
        const filteredData = workemployee.filter((pack) => pack.DichVu === selectedService);
        setFilteredWorkEmployee(filteredData);
    }
};


  //Hàm sửa
  const handleEdit = (pack) => {
    setSelectedPack(pack);
    setUpdate(true);
  };

  // Nhấn nút xóa
  const handleDeleteClick = (workemployeeId) => {
    setWorkEmployeeToDelete(workemployeeId);
    setOpenConfirmDialog(true);
  };

  //Xác nhận xóa
  const handleConfirmDelete = () => {
    handleDelete(workEmployeeToDelete);
    setOpenConfirmDialog(false);
  };
  //Hủy xóa
  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };
  //Hàm xóa
  const handleDelete = (id) => {
    const findCookie = (name) => {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    };
    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };
      axios
        .delete("http://localhost:8080/Backend/order-gympack/delete", {
          data: { IDHoaDon: id },
          headers: headers,
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setSuccess(true);
            setMessage("Xóa thành công");
            setRerender(!rerender);
          } else {
            throw new Error("Xóa thất bại");
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data.error);
        });
    }
  };

 
  // Phân trang dữ liệu
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWorkEmployee = filteredWorkEmployee.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      {showModal && (
        <RegisterPackModal
          data={workemployee}
          setShowModal={setShowModal}
          onPackAdded={(newPack) =>
            setWorkEmployee((prevWorkEmployee) => [...prevWorkEmployee, newPack])
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
            label="Tìm kiếm nhân viên"
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
        value={selectedService} 
        onChange={handleFilter} 
        displayEmpty
        inputProps={{ "aria-label": "Chọn dịch vụ" }}
    >
        <MenuItem value="">Tất cả dịch vụ</MenuItem>
        <MenuItem value="Boxing">Boxing</MenuItem>
        <MenuItem value="Gym">Gym</MenuItem>
        <MenuItem value="Yoga">Yoga</MenuItem>
        {/* Thêm các dịch vụ khác nếu có */}
    </Select>
</FormControl>

          {update && (
            <UpdateInvoiceModal data={selectedPack} setShowModal={setUpdate} />
          )}
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
        Tên nhân viên
      </TableCell>
      <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
        Dịch vụ
      </TableCell>
      <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
        Giá thuê
      </TableCell>
      <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
        Số điện thoại
      </TableCell>
      <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
        Tên khách hàng
      </TableCell>
      <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
        Ngày đăng ký
      </TableCell>
      <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
        Ngày hết hạn
      </TableCell>
      <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
        Hành động
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {paginatedWorkEmployee.length > 0 ? (
      paginatedWorkEmployee.map((value) => (
        <TableRow
          key={value.TenHLV} 
          sx={{
            backgroundColor: value.TenHLV % 2 === 0 ? "white" : "#f5f5f5", // Áp dụng màu nền xen kẽ
          }}
        >
          <TableCell style={{ textAlign: "center" }}>{value.TenHLV}</TableCell>
          <TableCell style={{ textAlign: "center" }}>{value.DichVu}</TableCell>
          <TableCell style={{ textAlign: "center" }}>{value.GiaThue}</TableCell>
          <TableCell style={{ textAlign: "center" }}>{value.SdtHLV}</TableCell>
          <TableCell style={{ textAlign: "center" }}>{value.TenKhachHang}</TableCell>
          <TableCell style={{ textAlign: "center" }}>{value.NgayDangKy}</TableCell>
          <TableCell style={{ textAlign: "center" }}>{value.NgayHetHan}</TableCell>
          <TableCell style={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              color="primary"
              // onClick={() => handleEdit(value)} 
              style={{ marginRight: "5px" }}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
            <Button
              variant="outlined"
              color="error"
              // onClick={() => handleDeleteClick(value.IDHoaDon)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={8} style={{ textAlign: "center" }}>
          Không tìm thấy kết quả.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

      </TableContainer>
     
      <Stack spacing={2} style={{ marginTop: "20px", float: "right" }}>
        <Pagination
          count={Math.ceil(filteredWorkEmployee.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </div>
  );
}

export default ManageWorkEmployee;
