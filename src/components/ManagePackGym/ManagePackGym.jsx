import React, { useEffect, useState } from "react";
import { faPenToSquare,faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import RegisterPackModal from "../RegisterPackModal/RegisterPackModal";
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
  InputLabel,
  FormControl,
  Stack,
  Pagination,
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
  const { setError, setMessage } = useAnnouncement();

  useEffect(() => {
    axios
      .get("http://localhost:8080/Backend/gympack/")
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
  }, [update]);

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
      {showModal && <RegisterPackModal data={gympack} setShowModal={setShowModal} />}
      {update && <UpdateGymPackModal data={selectedPack} setShowModal={setUpdate} />}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
      width:"180px"
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
    }
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          startIcon={<AddCircleOutline fontSize="small" />}
        >
          Thêm gói tập mới
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>ID Gói Tập</TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Tên gói tập</TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Thời hạn</TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Giá</TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Hành động</TableCell>
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
                <TableCell style={{ textAlign: "center" }}>{value.IDGoiTap}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{value.TenGoiTap}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{value.ThoiHan} ngày</TableCell>
                <TableCell style={{ textAlign: "center",color:"red" }}>
                  {value.Gia.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(value)}
                    style={{ marginRight: "5px" }}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    // onClick={() => handleDelete(value.IDGoiTap)} Này Vỹ khóa cái hàm handleDelete tại hong có API xóa.
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
