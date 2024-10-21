import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PTitem from "../../components/PTitem/PTitem";
import RegisterPT from "../RegisterPT/Register";
import style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useAnnouncement } from "../../contexts/Announcement";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination,
  PaginationItem,
  Button,
} from "@mui/material"; // Import MUI components
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function PT() {
  const location = useLocation();
  const [ptrainers, setPtrainer] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState("Tất cả");
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [showModal, setShowModal] = useState(false);
  const { setError, setMessage, setSuccess, setLocation, setLink } =
    useAnnouncement();

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const checkMessage = () => {
      const searchParams = new URLSearchParams(location.search);
      const message = searchParams.get("message");
      if (message) {
        switch (message) {
          case "successfully":
            setSuccess(true);
            setMessage("Đăng ký thành công!");
            setLocation(true);
            setLink("http://localhost:3000/PT");
            break;
          case "unsuccessfully":
            setError(true);
            setMessage("Đăng ký không thành công!");
            break;
          default:
            break;
        }
      }
    };

    checkMessage();
  }, [location.search, setError, setLink, setLocation, setMessage, setSuccess]);

  useEffect(() => {
    fetch("http://localhost:8080/Backend/personalTrainer/all")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setPtrainer(data);
        const uniqueCategories = [
          ...new Set(data.map((product) => product.DichVu)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        setError(true);
        setMessage(error.response.data.error);
      });
  }, [setError, setMessage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredProducts = ptrainers
    .filter(
      (trainer) =>
        productsByCategory === "Tất cả" || trainer.DichVu === productsByCategory
    )
    .filter(
      (trainer) =>
        trainer.HoTen &&
        trainer.HoTen.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.GiaThue - b.GiaThue;
      } else if (sortOrder === "desc") {
        return b.GiaThue - a.GiaThue;
      }
      return 0;
    });

  // Tính toán số trang dựa trên danh sách đã lọc
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Chia trang cho danh sách đã lọc
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Header setCartHeader={setCartCount} RerendercartCount={cartCount} />
      <div className={style["container"]}>
        <div className={style["wrap_content"]}>
          <div className={style.header}>
            <h1>Các Huấn luyên viên nổi bật tại GOAT GYM</h1>
            <h2>Mô tả</h2>
          </div>
          <div className={style.action}>
            <div className={style.action4}>
              <Button
                onClick={() => setShowModal(true)}
                variant="contained"
                color="primary"
                sx={{
                  height: "35px",
                  width: "170px",
                  fontSize: "12px",
                  borderRadius: "8px",
                }}
              >
                Đăng ký làm việc
              </Button>
            </div>
            <div className={style.action1}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <input
                type="text"
                id="search"
                placeholder="Nhập tên HLV"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <div className={style.action2}>
              <FormControl
                fullWidth
                sx={{
                  width: "200px",
                  marginTop: "15px",
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
                <InputLabel id="pt_category_label">Danh mục HLV</InputLabel>
                <Select
                  labelId="pt_category_label"
                  id="pt_category"
                  value={productsByCategory}
                  label="Danh mục HLV"
                  onChange={(e) => setProductsByCategory(e.target.value)}
                >
                  <MenuItem value="Tất cả">Tất cả</MenuItem>
                  {categories.map((value, index) => (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className={style.action3}>
              <FormControl
                fullWidth
                sx={{
                  width: "200px",
                  marginTop: "15px",
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
                <InputLabel id="sort_label">Sắp xếp theo giá</InputLabel>
                <Select
                  labelId="sort_label"
                  id="sort"
                  value={sortOrder}
                  label="Sắp xếp theo giá"
                  onChange={handleSort}
                >
                  <MenuItem value="none">Không sắp xếp</MenuItem>
                  <MenuItem value="asc">Tăng dần</MenuItem>
                  <MenuItem value="desc">Giảm dần</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className={style["product"]}>
            <ul>
              {paginatedProducts &&
                paginatedProducts.map((value) => (
                  <li key={value.IDHLV}>
                    <PTitem children={value} />
                  </li>
                ))}
            </ul>
          </div>

          {/* Thêm thành phần Pagination */}
          <div className={style["pagination-container"]}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
              color="primary"
            />
          </div>
        </div>
      </div>
      <Footer />
      {showModal && <RegisterPT setShowModal={setShowModal} />}
    </>
  );
}

export default PT;
