import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAnnouncement } from "../../contexts/Announcement";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Container } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";

function Cart() {
    const [cartData, setCartData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // State for select all
    const [update, setUpdate] = useState(false);
    const { setMessage, setWarning, setSuccess, setError } = useAnnouncement();
    const navigate = useNavigate();

    const handleClickBuy = () => {
        let orderInfos = [];
        selectedItems.forEach((index) => {
            orderInfos.push(cartData[index]);
        });
        sessionStorage.setItem('OrderInfo', JSON.stringify(orderInfos));
        navigate('/order');
    };

    useEffect(() => {
        const findCookie = (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            return null;
        };

        const jwt = findCookie('jwt');
        const option = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            }
        };
        fetch('http://localhost:8080/Backend/cart/', option)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi server');
                } else {
                    return response.json();
                }
            })
            .then(data => {
                setCartData(data);
                setUpdate(false);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu:', error);
            });
    }, [update]);

    useEffect(() => {
        let total = 0;
        if (!selectedItems) {
            return;
        }
        selectedItems.forEach((index) => {
            if (cartData[index]) {
                total += cartData[index].DonGia * cartData[index].SoLuong;
            }
        });
        setTotalPrice(total);
    }, [selectedItems, cartData]);

    // Kiểm tra nếu giỏ hàng trống tự động trở về trang sản phẩm
    useEffect(() => {
        if (cartData.length === 0) {
            const timer = setTimeout(() => {
                navigate("/shop");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [cartData, navigate]);

    const handleCheckboxChange = (event, index) => {
        if (event.target.checked) {
            setSelectedItems([...selectedItems, index]);
        } else {
            setSelectedItems(selectedItems.filter((item) => item !== index));
        }
    };

    const handleSelectAllChange = (event) => {
        const checked = event.target.checked;
        setSelectAll(checked);
        if (checked) {
            const allIndexes = cartData.map((_, index) => index);
            setSelectedItems(allIndexes);
        } else {
            setSelectedItems([]);
        }
    };

    function updateQuanPlus(IDSanPham) {
        const findCookie = (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            return null;
        };
        const data = {
            IDSanPham: IDSanPham
        }

        const jwt = findCookie('jwt');
        const option = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:8080/Backend/cart/updateQuanPlus', option)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi server');
                } else {
                    setUpdate(true);
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu:', error);
            })
    }

    function updateQuanMinus(IDSanPham, currentQuantity) {
        if (currentQuantity <= 1) {
            setWarning(true);
            setMessage("Số lượng sản phẩm không thể nhỏ hơn 1.");
            return;
        }
    
        const findCookie = (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            return null;
        };
        
        const data = {
            IDSanPham: IDSanPham
        };
    
        const jwt = findCookie('jwt');
        const option = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            },
            body: JSON.stringify(data)
        };
    
        fetch('http://localhost:8080/Backend/cart/updateQuanMinus', option)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi server');
                } else {
                    setUpdate(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    

    function deleteCartItem(IDSanPham) {
        const findCookie = (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            return null;
        };
        const data = {
            IDSanPham: IDSanPham
        }

        const jwt = findCookie('jwt');
        const option = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:8080/Backend/cart/delete', option)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi server');
                } else {
                    setSuccess(true);
                    setMessage("Đã xóa SP khỏi giỏ hàng")
                    setUpdate(true);
                }
            })
            .catch(error => {
                setError(true);
                setMessage("Xóa không thành công");
                console.error('Lỗi khi lấy dữ liệu:', error);
            })
    }

    useEffect(() => {
        let total = 0;
        if (!selectedItems) {
            return;
        }
        selectedItems.forEach((index) => {
            if (cartData[index]) {
                total += cartData[index].DonGia * cartData[index].SoLuong;
            }
        });
        setTotalPrice(total);
    }, [selectedItems, cartData]);

    return (
        <>
            {cartData.length === 0 ? (
                <Container className={style.emptyCart}>
                    <Alert severity="info">
                        Giỏ hàng của bạn trống! Bạn sẽ được chuyển đến trang shop trong giây lát.
                    </Alert>
                </Container>
            ) : (
                <TableContainer component={Paper} className={style.wrap_cart}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                    />
                                </TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>Hình ảnh</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>Tên sản phẩm</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>Giá</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>Số lượng</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>Tổng giá</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(index)}
                                            onChange={(e) => handleCheckboxChange(e, index)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <img
                                            src={item.IMG}
                                            alt={item.TenSP}
                                            className={style.productImage}
                                        />
                                    </TableCell>
                                    <TableCell>{item.TenSP}</TableCell>
                                    <TableCell>{item.DonGia.toLocaleString()} VNĐ</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="secondary"
                                            onClick={() => updateQuanMinus(item.IDSanPham, item.SoLuong)}
                                            className={style.button}
                                            style={{ minWidth: "30px", padding: "5px 10px", marginRight: '10px' }}
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </Button>
                                        <span style={{fontWeight:'bold'}}>{item.SoLuong}</span>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            onClick={() => updateQuanPlus(item.IDSanPham)}
                                            className={style.button}
                                            style={{ minWidth: "30px", padding: "5px 10px", marginLeft: '10px' }}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Button>
                                    </TableCell>
                                    <TableCell>{(item.DonGia * item.SoLuong).toLocaleString()} VNĐ</TableCell>
                                    <TableCell sx={{textAlign:'center'}}>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            onClick={() => deleteCartItem(item.IDSanPham)}
                                            style={{ color: "red", cursor: "pointer" }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className={style.buy}>
                        <div style={{ fontWeight: 'bold', color: 'red' }}>Tổng tiền: {totalPrice.toLocaleString()} VNĐ</div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClickBuy}
                            disabled={selectedItems.length === 0}
                        >
                            Mua hàng
                        </Button>
                    </div>
                </TableContainer>
            )}
        </>
    );
}

export default Cart;
