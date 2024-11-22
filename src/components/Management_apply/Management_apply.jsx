import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Pagination,
  Stack,
} from "@mui/material";
import { Alert } from "@mui/material";

const ManageRegisterPT = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };
      axios
        .get("http://localhost:8080/Backend/admin/personalTrainer/request", {
          headers: headers,
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setData(response.data);
          } else {
            throw new Error("Lấy thông tin đơn hàng thất bại!");
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response?.data?.error || "Có lỗi xảy ra");
        });
    }
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value); // Lưu giá trị XacNhan
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Lọc dữ liệu theo tên và trạng thái
  const filteredData = data.filter((row) =>
    row.HoTen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByStatus = statusFilter
    ? filteredData.filter(
        (row) =>
          row.Xacnhan !== undefined && row.Xacnhan.toString() === statusFilter
      )
    : filteredData;

  // const noDataFound = filteredByStatus.length === 0;

  // Phân trang
  const paginatedData = filteredByStatus.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRequest = (id, action) => {
    const jwt = findCookie("jwt");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
      PHPSESSID: findCookie("PHPSESSID"),
    };
    const url =
      action === "accept"
        ? `http://localhost:8080/Backend/admin/personalTrainer/request/accept?id=${id}`
        : `http://localhost:8080/Backend/admin/personalTrainer/request/reject?id=${id}`;

    axios
      .put(url, {}, { headers })
      .then(() => {
        setData((prevData) =>
          prevData.map((row) =>
            row.IDHLV === id
              ? {
                  ...row,
                  Xacnhan: action === "accept" ? 1 : 2,
                  hideActions: true,
                }
              : row
          )
        );
      })
      .catch((error) => {
        setError(true);
        setMessage(
          error.response?.data?.error || "Có lỗi xảy ra khi thực hiện hành động"
        );
      });
  };

  return (
    <div>
      <Box sx={{ marginBottom: 3, marginTop: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            label="Tìm kiếm"
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
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              <MenuItem value="0">Chờ xử lý</MenuItem>
              <MenuItem value="1">Đã chấp nhận</MenuItem>
              <MenuItem value="2">Đã từ chối</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(false)}>
          {message}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ textAlign: "center" }}>
                <strong>Họ và Tên</strong>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <strong>Dịch vụ đăng ký</strong>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <strong>Giá thuê mong muốn</strong>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <strong>Chứng chỉ liên quan</strong>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <strong>Trạng thái</strong>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <strong>Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.IDHLV}>
                <TableCell sx={{ textAlign: "center" }}>{row.HoTen}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{row.DichVu}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.GiaThue.toLocaleString()} VND
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <TextField
                    value={row.ChungChi}
                    multiline
                    fullWidth
                    rows={3}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip
                    label={
                      row.Xacnhan === 0
                        ? "Chờ xử lý"
                        : row.Xacnhan === 1
                        ? "Đã chấp nhận"
                        : "Đã từ chối"
                    }
                    color={
                      row.Xacnhan === 1
                        ? "success"
                        : row.Xacnhan === 2
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {!row.hideActions && row.Xacnhan === 0 && (
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Xác nhận">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleRequest(row.IDHLV, "accept")}
                        >
                          Xác nhận
                        </Button>
                      </Tooltip>
                      <Tooltip title="Từ chối">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRequest(row.IDHLV, "reject")}
                        >
                          Từ chối
                        </Button>
                      </Tooltip>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredByStatus.length / rowsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: 2, float:"right" }}
      />
    </div>
  );
};

export default ManageRegisterPT;
