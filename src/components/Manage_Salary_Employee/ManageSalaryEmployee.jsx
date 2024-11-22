import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  TablePagination,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
// import UpdateSalaryModal from "./UpdateSalaryModal"; // Import a modal component for updating salary

const mockEmployeeData = [
  { id: 1, name: "John Doe", position: "Developer", salary: 5000, bonus: 500 },
  { id: 2, name: "Jane Smith", position: "Designer", salary: 4500, bonus: 300 },
  { id: 3, name: "Alice Johnson", position: "Manager", salary: 6000, bonus: 700 },
  { id: 4, name: "Bob Brown", position: "Developer", salary: 4800, bonus: 400 },
  { id: 5, name: "Carol White", position: "Analyst", salary: 4700, bonus: 350 },
  // Add more mock employees if needed for testing pagination
];

const ManageEmployeeSalary = () => {
  const [employees, setEmployees] = useState(mockEmployeeData);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updateSalary, setUpdateSalary] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setUpdateSalary(true);
  };

  const handleDeleteClick = (employeeId) => {
    setSelectedEmployee(employeeId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== selectedEmployee));
    setOpenConfirmDialog(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <TextField
        label="Tìm kiếm theo tên"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{
          marginTop: "15px",
          marginBottom:"15px",
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

      <TableContainer component={Paper} >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{fontWeight:"bold"}}>STT</TableCell>
              <TableCell align="center" sx={{fontWeight:"bold"}}>Họ và tên</TableCell>
              <TableCell align="center" sx={{fontWeight:"bold"}}>Vị trí</TableCell>
              <TableCell align="center" sx={{fontWeight:"bold"}}>Lương tháng</TableCell>
              <TableCell align="center" sx={{fontWeight:"bold"}}>Thưởng thêm</TableCell>
              <TableCell align="center" sx={{fontWeight:"bold"}}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy nhân viên.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell align="center">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center">{employee.name}</TableCell>
                  <TableCell align="center">{employee.position}</TableCell>
                  <TableCell align="center">{employee.salary}</TableCell>
                  <TableCell align="center">{employee.bonus}</TableCell>
                  <TableCell align="center">
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(employee)}
                      style={{ marginRight: "5px" }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(employee.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                  </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* {updateSalary && (
        <UpdateSalaryModal
          employee={selectedEmployee}
          onClose={() => setUpdateSalary(false)}
        />
      )} */}

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #ddd" }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{paddingTop:"15px"}}>
          Bạn có chắc chắn muốn xóa bản ghi lương của nhân viên này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
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
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </div>
  );
};

export default ManageEmployeeSalary;
