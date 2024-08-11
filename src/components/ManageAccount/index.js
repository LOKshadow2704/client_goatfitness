import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, FormControl,
  InputLabel, Select, MenuItem, TextField,
  Button, TablePagination
} from '@mui/material';
import { faPenToSquare, faPlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import CreateUserModal from "../CreateUserModal";
import UpdateRoleModal from "../UpdateRoleModal";
import { useAnnouncement } from "../../contexts/Announcement";
import style from './style.module.css';

function ManageAccount({ data }) {
  const [accounts, setAccounts] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalUpdate, setModalUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { setError, setMessage } = useAnnouncement();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
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
    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie('jwt');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
        'PHPSESSID': findCookie("PHPSESSID")
      };
      axios.get('http://localhost:88/Backend/admin/getAllAccount', { headers: headers })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            setAccounts(response.data);
          } else {
            throw new Error("Lấy thông tin thất bại");
          }
        }).catch(error => {
          setError(true);
          setMessage(error.response.data.error);
        });
    }
  }, [modalUpdate, modalAdd, setError, setMessage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredAccounts = accounts.filter(account =>
    account.TenDangNhap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === "name") {
    filteredAccounts.sort((a, b) => a.TenDangNhap.localeCompare(b.TenDangNhap));
  } else if (sortBy === "name_desc") {
    filteredAccounts.sort((a, b) => b.TenDangNhap.localeCompare(a.TenDangNhap));
  }

  const handleClickUpdate = (user) => {
    setSelectedUser(user);
    setModalUpdate(true);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={style.wrap}>
      {modalAdd && <CreateUserModal setShowModal={setModalAdd} />}
      {modalUpdate && <UpdateRoleModal setShowModal={setModalUpdate} data={selectedUser} />}
      <div className={style.header}>
        <div className={style.action1}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <TextField
            type="text"
            id="search"
            placeholder="Tìm kiếm tài khoản"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
          />
        </div>
        <div className={style.action2}>
          <FormControl fullWidth>
            <InputLabel id="sort_label">Sắp xếp theo</InputLabel>
            <Select
              labelId="sort_label"
              id="sort"
              value={sortBy}
              label="Sắp xếp theo"
              onChange={handleSortChange}
            >
              <MenuItem value="">Sắp xếp theo...</MenuItem>
              <MenuItem value="name">Tên từ A-Z</MenuItem>
              <MenuItem value="name_desc">Tên từ Z-A</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Button
  variant="contained"
  color="primary"
  startIcon={<FontAwesomeIcon icon={faPlus} />}
  onClick={() => setModalAdd(true)}
  className={style.createaccount} 
>
  Tạo tài khoản
</Button>

      </div>
      <TableContainer component={Paper}>
  <Table className={style.table}>
    <TableHead>
      <TableRow>
        <TableCell className={style.tableCellMargin}>Tên đăng nhập</TableCell>
        <TableCell className={style.tableCellMargin}>Loại tài khoản</TableCell>
        <TableCell className={style.tableCellMargin2}>Hành động</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value) => (
        <TableRow key={value.IDSanPham}>
          <TableCell className={style.tableCellMargin1}>{value.TenDangNhap}</TableCell>
          <TableCell className={style.tableCellMargin1}>{value.TenVaiTro}</TableCell>
          <TableCell className={style.tableCellMargin1}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FontAwesomeIcon icon={faPenToSquare} />}
              onClick={() => handleClickUpdate(value)}
            >
              Chỉnh sửa
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAccounts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default ManageAccount;
