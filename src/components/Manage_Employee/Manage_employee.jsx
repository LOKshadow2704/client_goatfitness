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
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import UpdateEmployeeModal from "../Update_employee_info/Update_employee_info";

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [uniqueServices, setUniqueServices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [update, setUpdate] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { setSuccess, setError, setMessage } = useAnnouncement();
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8080/Backend/employee/getall");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEmployees(data);

        // Lấy danh sách dịch vụ duy nhất
        const services = [...new Set(data.map((employee) => employee.DichVu))];
        setUniqueServices(services);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [rerender, update, setError]);

  //Hàm sửa
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setUpdate(true);
  };

  // Nhấn nút xóa
  const handleDeleteClick = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setOpenConfirmDialog(true);
  };

  //Xác nhận xóa
  const handleConfirmDelete = () => {
    handleDelete(employeeToDelete);
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
        .delete("http://localhost:8080/Backend/employee/delete", {
          data: { TenDangNhap: id },
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedService("");
    setPage(0); // Reset trang về 0 khi đặt lại
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset trang về 0 khi thay đổi số hàng mỗi trang
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  // Lọc nhân viên theo từ khóa tìm kiếm và dịch vụ
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.HoTen.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesService = selectedService
      ? employee.DichVu === selectedService
      : true;
    return matchesSearch && matchesService;
  });

  // Thực hiện phân trang
  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <Grid
        container
        spacing={2}
        style={{ marginBottom: "15px", marginTop: "5px" }}
      >
        <Grid item>
          <TextField
            label="Tìm kiếm theo tên"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
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
        </Grid>
        <Grid item>
          <FormControl
            variant="outlined"
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
            <InputLabel>Dịch Vụ</InputLabel>
            <Select
              value={selectedService}
              onChange={handleServiceChange}
              label="Dịch Vụ"
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              {uniqueServices.map((service, index) => (
                <MenuItem key={index} value={service}>
                  {service}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {update && (
            <UpdateEmployeeModal
              data={selectedEmployee}
              setShowModal={setUpdate}
            />
          )}
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleReset}>
            Đặt lại
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ margin: "10px", width: "98%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                STT
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Họ tên
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Số điện thoại
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Dịch vụ
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{ textAlign: "center", padding: "20px" }}
                >
                  Không tìm thấy nhân viên.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                  }}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee.HoTen}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee.Email}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee.SDT}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee.DichVu}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee.TrangThai}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(employee)}
                      style={{ marginRight: "5px" }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(employee.TenDangNhap)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle
          id="confirm-dialog-title"
          sx={{ borderBottom: "1px solid #ddd" }}
        >
          Xác nhận xóa
        </DialogTitle>
        <DialogContentText
          id="confirm-dialog-description"
          style={{ padding: "20px" }}
        >
          Bạn có chắc chắn muốn xóa nhân viên này không?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ManageEmployee;
