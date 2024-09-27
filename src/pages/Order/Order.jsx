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
import ButtonGroup from "@mui/material/ButtonGroup";


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
            if (response.data) {
              window.location.href = response.data;
            } else {
              setSuccess(true);
              setMessage(response.data.message);
              setLocation(true);
              setLink("http://localhost:3000/PurchaseOrder");
            }
            console.log(response);
          } else {
            throw new Error("Đặt hàng không thành công!");
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
          setMessage(error.response.data.error);
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

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
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
            <h2>Thông tin đặt hàng</h2>
            <div className={style.group_title}>
              <TextField
                label="Địa chỉ"
                variant="outlined"
                fullWidth
                value={user ? user["DiaChi"] : ""}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <table className={style.bang}>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {products ? (
                  products.map((value, index) => (
                    <tr key={index}>
                      <td>
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          onClick={() => removeItem(value.IDSanPham)}
                        />
                        <img src={value.IMG} alt="" />
                        <p>{value.TenSP}</p>
                      </td>
                      <td>
                        <ButtonGroup
                          size="small"
                          aria-label="small outlined button group"
                        >
                          <Button
                            onClick={() =>
                              handleQuantityChange(index, value.SoLuong - 1)
                            }
                            disabled={value.SoLuong === 1}
                          >
                            -
                          </Button>
                          <Button disabled>{value.SoLuong}</Button>
                          <Button
                            onClick={() =>
                              handleQuantityChange(index, value.SoLuong + 1)
                            }
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </td>

                      <td>{value.DonGia.toLocaleString("vi-VN")}</td>
                      <td>
                        {(value.SoLuong * value.DonGia).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Không có sản phẩm</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={style.order}>
            <h1>Thông tin thanh toán</h1>
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
