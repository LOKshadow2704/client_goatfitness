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
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateCategoryModal from "../Update_Category_Product_Modal/Update_category_product_modal";
import AddCategoryModal from "../Add_Category_Product_Modal/add_category_product_modal";
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
  const [addcategoryproductModal, setAddcategoryproductModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Number of products per page
  const { setSuccess, setError, setMessage } = useAnnouncement();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/Backend/categories")
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
  }, [showUpdateProduct, rerender, addcategoryproductModal]);

  // Hàm xử lý sắp xếp dữ liệu
  const sortData = () => {
    let sortedProducts = [...product];
    if (sortBy === "name") {
      sortedProducts.sort((a, b) => a.TenLoaiSanPham.localeCompare(b.TenLoaiSanPham));
    } else if (sortBy === "name_desc") {
      sortedProducts.sort((a, b) => b.TenLoaiSanPham.localeCompare(a.TenLoaiSanPham));
    } 
    return sortedProducts;
  };

  // Hàm xử lý phân trang
  const paginatedData = sortData()
    .filter((item) =>
      item.TenLoaiSanPham.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //Hàm dùng để mở xác nhận khi người dùng chọn xóa
  const handleDeleteClick = (category_productId) => {
    setProductToDelete(category_productId);
    setOpenConfirmDialog(true);
  };

  //Người dùng xác nhận xóa
  const handleConfirmDelete = () => {
    handleDelete(productToDelete);
    setOpenConfirmDialog(false);
  };

  //Người dùng hủy xóa
  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
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
        .delete("http://localhost:8080/Backend/employee/category/delete", {
          data: { IDLoaiSanPham: id },
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
          label="Tìm kiếm loại sản phẩm"
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
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddcategoryproductModal(true)}
          startIcon={<AddCircleOutline fontSize="small" />}
          sx={{ float: "right", marginRight: "10px" }}
        >
          Thêm loại sản phẩm mới
        </Button>
      </div>

      {showUpdateProduct && (
        <UpdateCategoryModal
          data={selectedProduct}
          setShowModal={setShowUpdateProduct}
        />
      )}
      {addcategoryproductModal && <AddCategoryModal setShowModal={setAddcategoryproductModal} />}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Loại sản phẩm
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  Không tìm thấy loại sản phẩm.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((value, index) => (
                <TableRow
                  key={value.IDLoaiSanPham}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "white" : "#f5f5f5", // Hàng lẻ màu trắng, hàng chẵn màu xám
                  }}
                >
                  <TableCell style={{ textAlign: "center" }}>
                    {value.IDLoaiSanPham}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {value.TenLoaiSanPham}
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
                      onClick={() => handleDeleteClick(value.IDLoaiSanPham)}
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
        <DialogTitle id="confirm-dialog-title" sx={{borderBottom: '1px solid #ddd'}}>Xác nhận xóa</DialogTitle>
        <DialogContentText
          id="confirm-dialog-description"
          style={{ padding: "20px" }}
        >
          Bạn có chắc chắn muốn xóa loại sản phẩm này không?
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
