import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';


const DataTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');  // Lọc theo trạng thái
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  const findCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
};
  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie('jwt');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
        'PHPSESSID': findCookie("PHPSESSID")
      };
      axios.get("http://localhost:8080/Backend/admin/personalTrainer/request", { headers: headers })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            setData(response.data);  // Cập nhật dữ liệu từ API vào state data
          } else {
            throw new Error("Lấy thông tin đơn hàng thất bại!");
          }
        }).catch(error => {
          setError(true);
          setMessage(error.response?.data?.error || "Có lỗi xảy ra");
        });
    }
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredData = data.filter(row => row.HoTen.toLowerCase().includes(searchTerm.toLowerCase()));

  // Lọc theo trạng thái
  const filteredByStatus = statusFilter
    ? filteredData.filter(row => (statusFilter === 'processed' ? row.TrangThai === 'Đã xử lý' : row.TrangThai === 'Chưa xử lý'))
    : filteredData;

  const handleRequest = (id, action) => {
    // Handle action (accept/reject)
    console.log(`Request ID: ${id}, Action: ${action}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          style={{ width: '300px' }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="">
              <em>Tất cả</em>
            </MenuItem>
            <MenuItem value="processed">Đã xử lý</MenuItem>
            <MenuItem value="pending">Chưa xử lý</MenuItem>
          </Select>
        </FormControl>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>{message}</strong>
        </div>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ và Tên</TableCell>
              <TableCell>Dịch vụ đăng ký</TableCell>
              <TableCell>Giá thuê mong muốn</TableCell>
              <TableCell>Chứng chỉ liên quan</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredByStatus.map((row) => (
              <TableRow key={row.IDHLV}>
                <TableCell>{row.HoTen}</TableCell>
                <TableCell>{row.DichVu}</TableCell>
                <TableCell>{row.GiaThue.toLocaleString()} VND</TableCell>
                <TableCell>
                  <TextField
                    value={row.ChungChi}
                    multiline
                    fullWidth
                    rows={3}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                  />
                </TableCell>
                <TableCell>{row.TrangThai}</TableCell> {/* Cập nhật trạng thái theo dữ liệu API */}
                <TableCell>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleRequest(row.IDHLV, 'accept')}
                        fullWidth
                      >
                        Chấp nhận
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleRequest(row.IDHLV, 'reject')}
                        fullWidth
                      >
                        Từ chối
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
