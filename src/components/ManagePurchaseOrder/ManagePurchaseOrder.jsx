import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useAnnouncement } from "../../contexts/Announcement";
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Pagination,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Snackbar,
  Alert,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

import style from "./style.module.css";

function ManagePurchaseOrder() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const [ordersPerPage] = useState(6);
  const { setSuccess, setError, setMessage } = useAnnouncement();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
        .get("http://localhost:8080/Backend/employee/order/unconfirm/get", {
          headers: headers,
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setPurchaseOrders(response.data.orders.reverse());
          } else {
            throw new Error("Lấy thông tin đơn hàng thất bại!");
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data.error);
        });
    }
  }, [update]);

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

  const handleUpdate = (id) => {
    const isLogin = findCookie("jwt");
    if (isLogin) {
      const jwt = findCookie("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };
      axios
        .put(
          "http://localhost:8080/Backend/employee/order/confirm",
          { IDDonHang: id },
          { headers: headers }
        )
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setSuccess(true);
            setMessage("Đã xác nhận chuẩn bị đơn hàng");
            setUpdate(!update);
            setOpenSnackbar(true);
          } else {
            throw new Error("Xác nhận thất bại!");
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data.error);
        });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredAndSortedOrders = () => {
    let filteredOrders = purchaseOrders.filter((order) => {
      const hasOrderInfo =
        Array.isArray(order.orderInfo) && order.orderInfo.length > 0;

      return (
        (hasOrderInfo &&
          order.orderInfo.some((item) =>
            item.TenSP.toLowerCase().includes(searchTerm.toLowerCase())
          )) ||
        order.IDDonHang.toString().includes(searchTerm)
      );
    });

    if (sortOrder === "date_asc") {
      filteredOrders = filteredOrders.sort(
        (a, b) => new Date(a.NgayDat) - new Date(b.NgayDat)
      );
    } else if (sortOrder === "date_desc") {
      filteredOrders = filteredOrders.sort(
        (a, b) => new Date(b.NgayDat) - new Date(a.NgayDat)
      );
    }

    return filteredOrders;
  };

  const handleClickOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmOrder = () => {
    handleUpdate(selectedOrder.IDDonHang);
    handleCloseDialog();
  };

  const currentOrders = filteredAndSortedOrders().slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  // const formatCurrency = (value) => {
  //     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  // };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <div className={style["wrap"]}>
      <div className={style["header1"]}>
        <TextField
          label="Tìm kiếm đơn hàng"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            marginLeft: "25px",
            marginTop: "15px",
            marginBottom: "25px",
            marginRight: "20px",
            width: "200px",
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
        <FormControl
          sx={{
            marginTop: "15px",
            marginBottom: "25px",
            width: "220px",
            "& .MuiInputBase-root": {
              height: "40px",
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
            value={sortOrder}
            onChange={handleSortOrderChange}
            displayEmpty
            inputProps={{ "aria-label": "Sắp xếp theo" }}
          >
            <MenuItem value="">Sắp xếp theo...</MenuItem>
            <MenuItem value="date_asc">Ngày đặt (Cũ nhất)</MenuItem>
            <MenuItem value="date_desc">Ngày đặt (Mới nhất)</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Grid
        container
        spacing={3}
        sx={{ paddingTop: 1, paddingLeft: "15px", paddingRight: "15px" }}
      >
        {currentOrders.length === 0 ? (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", fontSize: "16px" }}
            >
              Không tìm thấy đơn hàng!
            </Typography>
          </Grid>
        ) : (
          currentOrders.map((order, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={`${order.IDDonHang}-${index}`}
            >
              <Card>
                <CardContent sx={{ boxShadow: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: 2 }}
                  >
                    ID Đơn hàng: {order.IDDonHang}
                  </Typography>
                  <div className={style["products"]}>
                    {order.orderInfo.map((item) => (
                      <div
                        key={item.IDSanPham}
                        className={style["product_item"]}
                      >
                        <img src={item.IMG} alt={item.TenSP} width="80px" />
                        <Typography
                          variant="body2"
                          className={style["product_name"]}
                        >
                          {item.TenSP} <br />
                          <span
                            style={{
                              fontSize: "0.8rem",
                              color: "#666",
                              display: "flex",
                              gap: "10px",
                              paddingTop: "5px",
                            }}
                          >
                            <span>
                              Số lượng: <strong>{item.SoLuong}</strong>
                            </span>{" "}
                            |
                            <span style={{ color: "red" }}>
                              Đơn giá: {item.DonGia.toLocaleString()} VND
                            </span>
                          </span>
                        </Typography>
                      </div>
                    ))}
                  </div>
                  <Typography variant="body2" sx={{ marginBottom: "1px" }}>
                    Giá trị đơn hàng:{" "}
                    <span style={{ color: "red" }}>
                      {" "}
                      {order.ThanhTien.toLocaleString()} VND
                    </span>
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "1px" }}>
                    Ngày đặt: {formatDate(order.NgayDat)}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "1px" }}>
                    Ngày giao dự kiến: {formatDate(order.NgayGiaoDuKien)}
                  </Typography>
                  <Typography variant="body2">
                    Địa chỉ: {order.DiaChi}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                    onClick={() => handleClickOpenDialog(order)}
                    sx={{ marginTop: 2 }}
                  >
                    Xác nhận
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ borderBottom: "1px solid #ddd" }}>Xác nhận đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ paddingTop: "10px" }}>
            Bạn có chắc chắn muốn xác nhận đơn hàng{" "}
            <strong>{selectedOrder?.IDDonHang}</strong> này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Hủy
          </Button>
          <Button onClick={handleConfirmOrder} color="primary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Đơn hàng đã được xác nhận!
        </Alert>
      </Snackbar>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          count={Math.ceil(filteredAndSortedOrders().length / ordersPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </div>
    </div>
  );
}

export default ManagePurchaseOrder;
