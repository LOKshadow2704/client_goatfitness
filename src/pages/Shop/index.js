import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductItem from "../../components/ProductItem";
import style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Select, MenuItem, InputLabel, FormControl, Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Shop() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState('Tất cả');
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('none');
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetch('http://localhost:8080/Backend/shop')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi kết nối');
                }
                return response.json();
            })
            .then(data => {
                const productList = data;
                setProducts(productList);
                const uniqueCategories = [...new Set(productList.map(product => product.TenLoaiSanPham))];
                setCategories(uniqueCategories);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu:', error);
            });
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = (e) => {
        setSortOrder(e.target.value);
    };

    const filteredProducts = products
        .filter(product => 
            productsByCategory === 'Tất cả' || product.TenLoaiSanPham === productsByCategory)
        .filter(product => 
            product.TenSP && product.TenSP.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.DonGia - b.DonGia;
            } else if (sortOrder === 'desc') {
                return b.DonGia - a.DonGia;
            }
            return 0;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <>
            <Header setCartHeader={setCartCount} RerendercartCount={cartCount} />
            <div className={style['container']}>
                <div className={style["wrap_content"]}>
                    <div className={style.header}>
                        <h1>Các sản phẩm hiện có tại GOAT GYM</h1>
                    </div>
                    <div className={style.action}>
                        <div className={style.action1}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <input 
                                type="text" 
                                id="search" 
                                placeholder="Nhập tên sản phẩm" 
                                value={searchQuery} 
                                onChange={handleSearch} 
                            />
                        </div>
                        <div className={style.action2}>
  <FormControl
    fullWidth
    sx={{
      width: "200px",  
      height: "50px",   
      marginTop: "10px",  
    }}
  >
    <InputLabel id="product_category_label">Danh mục sản phẩm</InputLabel>
    <Select
      labelId="product_category_label"
      id="product_category"
      value={productsByCategory}
      label="Danh mục sản phẩm"
      onChange={(e) => setProductsByCategory(e.target.value)}
      sx={{
        height: "50px",  
        width: "200px",  
        fontSize: "14px",  
        borderRadius: "8px",  
      }}
    >
      <MenuItem value="Tất cả">Tất cả</MenuItem>
      {categories.map((value, index) => (
        <MenuItem key={index} value={value}>{value}</MenuItem>
      ))}
    </Select>
  </FormControl>
</div>

<div className={style.action3}>
  <FormControl
    fullWidth
    sx={{
      width: "200px",  
      height: "50px",   
      marginTop: "10px",  
    }}
  >
    <InputLabel id="sort_label">Sắp xếp theo giá</InputLabel>
    <Select
      labelId="sort_label"
      id="sort"
      value={sortOrder}
      label="Sắp xếp theo giá"
      onChange={handleSort}
      sx={{
        height: "50px",  
        width: "200px",  
        fontSize: "14px",  
        borderRadius: "8px",  
      }}
    >
      <MenuItem value="none">Không sắp xếp</MenuItem>
      <MenuItem value="asc">Tăng dần</MenuItem>
      <MenuItem value="desc">Giảm dần</MenuItem>
    </Select>
  </FormControl>
</div>

                    </div>
                    <div className={style['product']}>
                        <ul>
                            {paginatedProducts.map(value => (
                                <li key={value.IDSanPham}>
                                    <ProductItem 
                                        children={value} 
                                        current={cartCount} 
                                        setAddCartCount={setCartCount} 
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={style['pagination-container']}>
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
        </>
    );
};

export default Shop;
