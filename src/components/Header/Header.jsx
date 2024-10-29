import React, { useState, useRef, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShopify } from '@fortawesome/free-brands-svg-icons';
//import Cart from "../Cart/Cart";
import { useAuth } from "../../contexts/AuthContext";
import UserPackage from "../UserPackage/UserPackage";
import { useAnnouncement } from "../../contexts/Announcement";
import Announcement from "../Announcement/Announcement";
import style from "./style.module.css";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import UserPTPackage from "../UserPTPackage/UserPTPackage";

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [showPTModal, setShowPTModal] = useState(false);
  const [ setCart ] = useState(false);
  const cartRef = useRef(null);
  const { isLogin, user } = useAuth();
  const {
    error,
    success,
    warning,
    setError,
    setSuccess,
    setMessage,
    setLocation,
  } = useAnnouncement();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCart(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setCart]);

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

  // Xác định danh sách các đường dẫn hợp lệ cho Tabs
  const validTabPaths = ["/", "/shop", "/PT", "/info", "/GymPack"];

  // Nếu location.pathname không có trong danh sách hợp lệ, cung cấp giá trị null hoặc giá trị mặc định
  const tabValue = validTabPaths.includes(location.pathname)
    ? location.pathname
    : false;

  function Logout() {
    const jwt = findCookie("jwt");
    const phpSessionId = findCookie("PHPSESSID");

    if (!jwt || !phpSessionId) {
      console.error("Không tìm thấy thông tin đăng nhập.");
      setError(true);
      setMessage("Đăng xuất thất bại. Vui lòng thử lại.");
      return;
    }

    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: phpSessionId,
      },
    };

    fetch("http://localhost:8080/Backend/logout", option)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng xuất thất bại. Server trả về lỗi.");
        }
        return response.json();
      })
      .then((data) => {
        // Đăng xuất thành công
        document.cookie = "jwt=; Max-Age=-1; path=/;";
        document.cookie = "PHPSESSID=; Max-Age=-1; path=/;";

        setSuccess(true);
        setMessage(data.message || "Đăng xuất thành công");
        setLocation(true);
        navigate("/login"); 
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setMessage("Đăng xuất thất bại. Vui lòng thử lại.");
      });
  }

  
  return (
    <header className={style.header}>
      <div className={style["wrap-logo"]}>
        <div className={style.logo}>
          <a href="/">
            <img
              src="https://i.imgur.com/n63xUfG.jpeg"
              alt="logo"
              width="100%"
            />
          </a>
        </div>
      </div>
      <div className={style.navbar}>
        <Tabs
          // value={location.pathname}
          value={tabValue}
          className={style.TabsList}
          aria-label="navigation tabs"
        >
          <Tab
            label="Trang chủ"
            component={Link}
            to="/"
            value="/"
            className={style.Tab}
          />
          <Tab
            label="Shop"
            component={Link}
            to="/shop"
            value="/shop"
            className={style.Tab}
          />
          <Tab
            label="HLV Cá Nhân"
            component={Link}
            to="/PT"
            value="/PT"
            className={style.Tab}
          />
          <Tab
            label="Giới thiệu"
            component={Link}
            to="/info"
            value="/info"
            className={style.Tab}
          />
          <Tab
            label="Gói tập"
            component={Link}
            to="/GymPack"
            value="/GymPack"
            className={style.Tab}
          />
        </Tabs>
      </div>
      <div className={style.nav_item}>
        {!isLogin && (
          <button onClick={() => (window.location.href = "/login")}>
            Luyện tập ngay
          </button>
        )}

        <div className={style["shopyfi"]}>
          <ShoppingCartIcon
            onClick={() => {
              if (!isLogin) {
                setError(true);
                setMessage("Vui lòng đăng nhập!");
              } else {
                navigate("/cart");
              }
            }}
          />
        </div>
        {user && isLogin && (
          <div className={style["user"]}>
            <img src={user.avt} alt="user" width="100%" />
            <p>{user.HoTen}</p>
            <ul className={style["dropdown-content"]}>
              <li>
                <Link to="/account-setting">Thông tin tài khoản</Link>
              </li>
              <li onClick={() => setShowModal(true)}>
                <Link to="#">Thông tin gói tập</Link>
              </li>
              <li>
                <Link to="/PurchaseOrder">Đơn hàng</Link>
              </li>
              <li onClick={() => setShowPTModal(true)}>
                <Link to="#">Thông tin thuê PT</Link>
              </li>
              <li onClick={() => setShowPTModal(true)}>
                <Link to="#">Thông tin đăng ký HLV</Link>
              </li>
              <li onClick={Logout}>Đăng xuất</li>
            </ul>
          </div>
        )}
      </div>
      {showModal && <UserPackage setShowModal={setShowModal} />}
      {showPTModal && <UserPTPackage setShowModal={setShowPTModal} />}
      {error || success || warning ? <Announcement /> : null}
    </header>
  );
}

export default Header;
