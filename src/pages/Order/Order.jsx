import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAnnouncement } from "../../contexts/Announcement";
import Loading from "../../components/Loading/Loading";
import { useAuth } from "../../contexts/AuthContext";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

function Order() {
  const location = useLocation();
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState();
  const [selectedPayment, setSelectedPayment] = useState(1);
  const [loading, setLoading] = useState(false); // loading
  const { setError, setMessage, setSuccess, setLocation, setLink } =
    useAnnouncement();
  const { user } = useAuth();

  //Thông báo
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get("message");
    switch (message) {
      case "success":
        setSuccess(true);
        setMessage("Đặt hàng thành công!");
        sessionStorage.removeItem("OrderInfo");
        setLocation(true);
        setLink("http://localhost:3000/PurchaseOrder");
        break;
      case "canceled":
        setError(true);
        setMessage("Đặt hàng không thành công!");
        break;
      default:
        break;
    }
  }, [location.search, setError, setMessage, setSuccess, setLocation, setLink]);

  // Data order
  useEffect(() => {
    setProducts(JSON.parse(sessionStorage.getItem("OrderInfo")));
  }, []);

  // Total price
  useEffect(() => {
    if (products && products.length > 0) {
      let totalPrice = 0;
      products.forEach((value) => {
        totalPrice += value.SoLuong * value.DonGia;
      });
      setTotalPrice(totalPrice);
    }
  }, [products]);

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

  // const handleBuy = () => {
  //   const isLogin = findCookie("jwt");
  //   if (isLogin) {
  //     setLoading(true);
  //     const jwt = findCookie("jwt");
  //     const data = {
  //       products: products,
  //       HinhThucThanhToan: selectedPayment,
  //     };
  //     const headers = {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + jwt,
  //       PHPSESSID: findCookie("PHPSESSID"),
  //     };
  //     axios
  //       .post("http://localhost:8080/Backend/order", data, { headers: headers })
  //       .then((response) => {
  //         if (response.status >= 200 && response.status < 300) {
  //           // Giả sử response.data là một thông báo thành công, bạn có thể thay đổi theo API của bạn
  //           setSuccess(true);
  //           setMessage("Đặt hàng thành công!");
  //           setLocation(true);
  //           setLink("/OrderPaymentSuccess"); // Chuyển hướng đến trang PurchaseOrder
  //           sessionStorage.removeItem("OrderInfo");
  //         } else {
  //           throw new Error("Đặt hàng không thành công!");
  //         }
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         setError(true);
  //         setMessage(
  //           error.response ? error.response.data.error : "Có lỗi xảy ra!"
  //         );
  //       });
  //   } else {
  //     setError(true);
  //     setMessage("Vui lòng đăng nhập");
  //     setLocation(true);
  //     setLink("http://localhost:3000/login");
  //     return;
  //   }
  // };

  const handleBuy = () => {
    const isLogin = findCookie("jwt");
    if (isLogin) {
      setLoading(true);
      const jwt = findCookie("jwt");
      const data = {
        products: products,
        HinhThucThanhToan: selectedPayment,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };
      
      axios
        .post("http://localhost:8080/Backend/order", data, { headers: headers })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            if (selectedPayment === 2) {
              // Kiểm tra nếu URL thanh toán PayOS có tồn tại
              const payosUrl = response.data.success;
              if (payosUrl) {
                window.location.href = payosUrl; // Chuyển hướng đến URL thanh toán của PayOS
              } else {
                // Hiển thị thông báo lỗi nếu URL không tồn tại
                setError(true);
                setMessage("Không thể lấy URL thanh toán từ PayOS.");
              }
            } else if (selectedPayment === 1) {
              // Chuyển hướng đến OrderPaymentSuccess khi phương thức thanh toán là 1
              window.location.href = "http://localhost:3000/OrderPaymentSuccess";
            }
            sessionStorage.removeItem("OrderInfo");
          } else {
            throw new Error("Đặt hàng không thành công!");
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
          setMessage(
            error.response ? error.response.data.error : "Có lỗi xảy ra!"
          );
        });
    } else {
      setError(true);
      setMessage("Vui lòng đăng nhập");
      setLocation(true);
      setLink("http://localhost:3000/login");
      return;
    }
  };
  

  const removeItem = (key) => {
    const updatedProduct = products.filter((item) => item.IDSanPham !== key);
    sessionStorage.setItem("OrderInfo", JSON.stringify(updatedProduct));
    setProducts(updatedProduct); // Update the state
  };

  const handleQuantityChange = (e, index) => {
    const newQuantity = parseInt(e.target.value);
    const updatedProducts = [...products];
    updatedProducts[index].SoLuong = newQuantity;
    setProducts(updatedProducts);
  };

  return (
    <>
      <Header />
      {loading && <Loading />}
      {!loading && (
        <div className={style.container}>
          <div className={style.orderItem}>
            <h1 style={{ paddingTop: "30px" }}>Thông tin đặt hàng</h1>
            <div className={style.group_title}>
              <TextField
                label="Địa chỉ"
                variant="outlined"
                sx={{ marginLeft: "133%" }}
                fullWidth
                value={user ? user["DiaChi"] : ""}
                // InputProps={{
                //   readOnly: true,
                // }}
              />
            </div>
            <TableContainer
              component={Paper}
              sx={{
                paddingBottom: "50px",
                width: "83%",
                marginLeft: "150px",
                marginTop: "30px",
                backgroundColor: "aliceblue",
                marginBottom: "50px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: "15px",
                      }}
                    >
                      Sản phẩm
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: "15px",
                      }}
                    >
                      Số lượng
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: "15px",
                      }}
                    >
                      Đơn giá
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: "15px",
                      }}
                    >
                      Thành tiền
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products ? (
                    products.map((value, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FontAwesomeIcon
                            style={{ color: "red" }}
                            icon={faTrashCan}
                            onClick={() => removeItem(value.IDSanPham)}
                          />
                          <img
                            src={value.IMG}
                            alt=""
                            style={{
                              width: "50px",
                              marginRight: "10px",
                              border: "none",
                            }}
                          />
                          {value.TenSP}
                        </TableCell>
                        <TableCell style={{ border: "none" }}>
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => {
                              const updatedProducts = [...products];
                              if (value.SoLuong > 1) {
                                updatedProducts[index].SoLuong -= 1; // Giảm số lượng
                                setProducts(updatedProducts); // Cập nhật state
                              }
                            }}
                            className={style.button}
                            style={{
                              minWidth: "25px",
                              padding: "5px 5px",
                              marginRight: "10px",
                            }}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </Button>

                          <span style={{ fontWeight: "bold" }}>
                            {value.SoLuong}
                          </span>

                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => {
                              const updatedProducts = [...products];
                              updatedProducts[index].SoLuong += 1; // Tăng số lượng
                              setProducts(updatedProducts); // Cập nhật state
                            }}
                            className={style.button}
                            style={{
                              minWidth: "25px",
                              padding: "5px 5px",
                              marginLeft: "10px",
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </TableCell>

                        <TableCell style={{ border: "none" }}>
                          {value.DonGia.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                        <TableCell style={{ border: "none" }}>
                          {(value.SoLuong * value.DonGia).toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Không có sản phẩm
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className={style.order}>
            <h2>Thông tin thanh toán</h2>
            <span className={style.thanhtoan}>Thành tiền: </span>
            <span style={{ color: "red", fontSize: "24px", marginTop: "10px" }}>
              {totalPrice.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </span>
            <label htmlFor="payment" className={style.thanhtoan}>
              Hình thức thanh toán:
            </label>

            <Select
              id="payment"
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              fullWidth
            >
              <MenuItem value={1}>Thanh toán khi nhận hàng</MenuItem>
              <MenuItem value={2}>Thanh toán trực tuyến</MenuItem>
            </Select>

            <button onClick={handleBuy}>
              Đặt hàng
              <svg viewBox="0 0 576 512">
                <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Order;
