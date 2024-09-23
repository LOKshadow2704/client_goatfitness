import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  Paper,
  Stack,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateProductModal from "../UpdateProductModal/UpdateProductModal";
import AddProductModal from "../AddProductModal/AddProductModal";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
import { AddCircleOutline } from "@mui/icons-material";

function ManageProduct({ data }) {
  const [product, setProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [addproductModal, setAddproductModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Number of products per page
  const { setSuccess, setError, setMessage } = useAnnouncement();

  useEffect(() => {
    fetch("http://localhost:8080/Backend/shop/manege/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể truy cập");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.log("Lỗi khi lấy dữ liệu:", error);
      });
  }, [showUpdateProduct, rerender, addproductModal]);

  // Hàm xử lý sắp xếp dữ liệu
  const sortData = () => {
    let sortedProducts = [...product];
    if (sortBy === "name") {
      sortedProducts.sort((a, b) => a.TenSP.localeCompare(b.TenSP));
    } else if (sortBy === "name_desc") {
      sortedProducts.sort((a, b) => b.TenSP.localeCompare(a.TenSP));
    } else if (sortBy === "price") {
      sortedProducts.sort((a, b) => a.DonGia - b.DonGia);
    } else if (sortBy === "price_desc") {
      sortedProducts.sort((a, b) => b.DonGia - a.DonGia);
    }
    return sortedProducts;
  };

  // Hàm xử lý phân trang
  const paginatedData = sortData()
    .filter((item) =>
      item.TenSP.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Hàm xử lý thay đổi kiểu sắp xếp
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowUpdateProduct(true);
  };

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
        .delete("http://localhost:8080/Backend/product/delete", {
          data: { IDSanPham: id },
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

  return (
    <div style={{ padding: "20px", backgroundColor: "white" }}>
      <div style={{ marginBottom: "20px" }}>
        {/* Input tìm kiếm */}
        <TextField
          label="Tìm kiếm sản phẩm"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            marginRight: "20px",
            "& .MuiInputBase-root": {
              height: "40px",
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

        {/* Select sắp xếp */}
        <Select
          value={sortBy}
          onChange={handleSortChange}
          displayEmpty
          inputProps={{ "aria-label": "Sắp xếp theo" }}
          style={{ width: "200px", height: "40px" }}
        >
          <MenuItem value="">Sắp xếp theo</MenuItem>
          <MenuItem value="name">Tên từ A-Z</MenuItem>
          <MenuItem value="name_desc">Tên từ Z-A</MenuItem>
          <MenuItem value="price">Giá tăng dần</MenuItem>
          <MenuItem value="price_desc">Giá giảm dần</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddproductModal(true)}
          startIcon={<AddCircleOutline fontSize="small" />}
          sx={{ float: "right", marginRight: "10px" }}
        >
          Thêm sản phẩm mới
        </Button>
      </div>

      {showUpdateProduct && (
        <UpdateProductModal
          data={selectedProduct}
          setShowModal={setShowUpdateProduct}
        />
      )}
      {addproductModal && <AddProductModal setShowModal={setAddproductModal} />}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Tên sản phẩm
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Loại sản phẩm
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Đơn giá
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Số lượng tồn kho
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((value, index) => (
              <TableRow
                key={value.IDSanPham}
                sx={{
                  backgroundColor: index % 2 === 0 ? "white" : "#f5f5f5", // Hàng lẻ màu trắng, hàng chẵn màu xám
                }}
              >
                <TableCell style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={value.IMG}
                      alt={value.TenSP}
                      width="80px"
                      height="50px"
                    />
                    <p style={{ marginLeft: "30px" }}>{value.TenSP}</p>
                  </div>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {value.TenLoaiSanPham}
                </TableCell>
                <TableCell style={{ textAlign: "center", color: "red" }}>
                  {value.DonGia.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {value.SoLuong}
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
                    onClick={() => handleDelete(value.IDSanPham)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} style={{ marginTop: "20px", alignItems: "center" }}>
        {/* <Typography>Trang: {currentPage}</Typography> */}
        <Pagination
          count={Math.ceil(sortData().length / productsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Stack>
    </div>
  );
}

export default ManageProduct;
