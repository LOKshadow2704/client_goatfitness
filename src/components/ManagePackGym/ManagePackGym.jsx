import React, { useEffect, useState } from "react";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
// import RegisterPackModal from "../RegisterPackModal/RegisterPackModal";
import AddPackGym from "../AddPackGym/AddPackGym";
import UpdateGymPackModal from "../UpdateGymPackModal/UpdateGymPackModal";
import { useAnnouncement } from "../../contexts/Announcement";
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
  MenuItem,
  Select,
  FormControl,
  Stack,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

function ManagePackGym() {
  const [gympack, setGymPack] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng item mỗi trang
  const { setSuccess, setError, setMessage } = useAnnouncement();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [gympackToDelete, setGymPackToDelete] = useState(null);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/Backend/gympack")
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setGymPack(response.data);
        } else {
          throw new Error("Lấy thông tin thất bại");
        }
      })
      .catch((error) => {
        setError(true);
        setMessage(error.response.data.error);
      });
  }, [update, rerender, showModal, setError, setMessage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const handleSort = (e) => {
    setSortType(e.target.value);
  };

  const handleEdit = (pack) => {
    setSelectedPack(pack);
    setUpdate(true);
  };

  // Nhấn nút xóa
  const handleDeleteClick = (gympackId) => {
    setGymPackToDelete(gympackId);
    setOpenConfirmDialog(true);
  };

  //Xác nhận xóa
  const handleConfirmDelete = () => {
    handleDelete(gympackToDelete);
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
        .delete("http://localhost:8080/Backend/gympack/delete", {
          data: { IDGoiTap: id },
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
  // Xử lý sắp xếp và lọc
  const sortedGymPack = gympack
    .filter((pack) =>
      pack.TenGoiTap.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "priceAsc") {
        return a.Gia - b.Gia;
      } else if (sortType === "priceDesc") {
        return b.Gia - a.Gia;
      } else if (sortType === "durationAsc") {
        return a.ThoiHan - b.ThoiHan;
      } else if (sortType === "durationDesc") {
        return b.ThoiHan - a.ThoiHan;
      }
      return 0;
    });

  // Phân trang dữ liệu
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGymPack = sortedGymPack.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* {showModal && <AddPackGym data={gympack} setShowModal={setShowModal} />} */}
      {showModal && (
        <AddPackGym
          data={gympack}
          setShowModal={setShowModal}
          onPackAdded={(newPack) =>
            setGymPack((prevGymPack) => [...prevGymPack, newPack])
          }
        />
      )}

      {update && (
        <UpdateGymPackModal data={selectedPack} setShowModal={setUpdate} />
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
            label="Tìm kiếm gói tập"
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
            {/* <InputLabel>Sắp xếp theo</InputLabel> */}
            <Select
              value={sortType}
              onChange={handleSort}
              displayEmpty
              inputProps={{ "aria-label": "Sắp xếp theo" }}
            >
              <MenuItem value="">Sắp xếp theo</MenuItem>
              <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
              <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
              <MenuItem value="durationAsc">Thời hạn tăng dần</MenuItem>
              <MenuItem value="durationDesc">Thời hạn giảm dần</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          startIcon={<AddCircleOutline fontSize="small" />}
        >
          Thêm gói tập mới
        </Button> */}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                ID Gói Tập
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Tên gói tập
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Thời hạn
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Giá
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGymPack.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  Không tìm thấy gói tập.
                </TableCell>
              </TableRow>
            ) : (
              paginatedGymPack.map((value, index) => (
                <TableRow
                  key={value.IDGoiTap}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "white" : "#f5f5f5", // Hàng lẻ màu trắng, hàng chẵn màu xám
                  }}
                >
                  <TableCell style={{ textAlign: "center" }}>
                    {value.IDGoiTap}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {value.TenGoiTap}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {value.ThoiHan} ngày
                  </TableCell>
                  <TableCell style={{ textAlign: "center", color: "red" }}>
                    {value.Gia.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(value)}
                      style={{ marginRight: "5px" }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(value.IDGoiTap)}
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

      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title" sx={{borderBottom: '1px solid #ddd'}}>Xác nhận xóa</DialogTitle>
        <DialogContentText
          id="confirm-dialog-description"
          style={{ padding: "20px" }}
        >
          Bạn có chắc chắn muốn xóa gói tập này không?
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
      <Stack spacing={2} style={{ marginTop: "20px", float: "right" }}>
        <Pagination
          count={Math.ceil(sortedGymPack.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </div>
  );
}

export default ManagePackGym;
