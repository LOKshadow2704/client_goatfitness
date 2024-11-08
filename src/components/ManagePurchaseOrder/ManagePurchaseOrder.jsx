import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useAnnouncement } from "../../contexts/Announcement";
import { TextField, FormControl, Select, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Pagination } from '@mui/material';
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';

function ManagePurchaseOrder() {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [update, setUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [page, setPage] = useState(1); // Biến trạng thái cho trang hiện tại
    const [ordersPerPage] = useState(5); // Số đơn hàng trên mỗi trang
    const { setSuccess, setError, setMessage } = useAnnouncement();

    useEffect(() => {
        const isLogin = findCookie("jwt");
        if (isLogin) {
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            axios.get("http://localhost:8080/Backend/order/purchase/get_unconfirm", { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setPurchaseOrders(response.data.orders.reverse());
                    } else {
                        throw new Error("Lấy thông tin đơn hàng thất bại!");
                    }
                }).catch(error => {
                    setError(true);
                    setMessage(error.response.data.error);
                });
        }
    }, [update]); // eslint-disable-line react-hooks/exhaustive-deps

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

    const handleUpdate = (id) => {
        const isLogin = findCookie("jwt");
        if (isLogin) {
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            axios.put("http://localhost:8080/Backend/order/purchase/confirm", { IDDonHang: id }, { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setSuccess(true);
                        setMessage("Đã xác nhận chuẩn bị đơn hàng");
                        setUpdate(!update);
                    } else {
                        throw new Error("Xác nhận thất bại!");
                    }
                }).catch(error => {
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

    // const filteredAndSortedOrders = () => {
    //     let filteredOrders = purchaseOrders.filter(order =>
    //         order.orderInfo.some(item => item.TenSP.toLowerCase().includes(searchTerm.toLowerCase())) ||
    //         order.IDDonHang.toString().includes(searchTerm)
    //     );

    //     if (sortOrder === 'date_asc') {
    //         filteredOrders = filteredOrders.sort((a, b) => new Date(a.NgayDat) - new Date(b.NgayDat));
    //     } else if (sortOrder === 'date_desc') {
    //         filteredOrders = filteredOrders.sort((a, b) => new Date(b.NgayDat) - new Date(a.NgayDat));
    //     }

    //     return filteredOrders;
    // };

    //Yêu cầu người dùng xác nhận
    
    const filteredAndSortedOrders = () => {
        let filteredOrders = purchaseOrders.filter(order => {
            const hasOrderInfo = Array.isArray(order.orderInfo) && order.orderInfo.length > 0;
            
            return (hasOrderInfo && order.orderInfo.some(item => 
                item.TenSP.toLowerCase().includes(searchTerm.toLowerCase())
            )) || order.IDDonHang.toString().includes(searchTerm);
        });
    
        if (sortOrder === 'date_asc') {
            filteredOrders = filteredOrders.sort((a, b) => new Date(a.NgayDat) - new Date(b.NgayDat));
        } else if (sortOrder === 'date_desc') {
            filteredOrders = filteredOrders.sort((a, b) => new Date(b.NgayDat) - new Date(a.NgayDat));
        }
    
        return filteredOrders;
    };
    
    
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    // Tính toán số đơn hàng và phân trang
    const currentOrders = filteredAndSortedOrders().slice((page - 1) * ordersPerPage, page * ordersPerPage);

    const formatCurrency = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    };

    return (
        <div className={style["wrap"]}>
            <div className={style['header1']}>
                <TextField
                    label="Tìm kiếm đơn hàng"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{
                        marginLeft:"25px",
                        marginTop:"15px",
                        marginBottom:"25px",
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
                        marginTop:"15px",
                        marginBottom:"25px",
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor:'aliceblue'}}>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Thông tin đơn hàng</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Thông tin thanh toán</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Thông tin giao hàng</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentOrders.map((value) => (
                            <TableRow key={value.IDDonHang}>
                                <TableCell style={{width:'400px'}}>
                                    <p><b>ID Đơn hàng: {value.IDDonHang}</b></p>
                                    <div className={style['products']}>
                                        {value.orderInfo.map(item => (
                                            <div className={style['product_item']} key={item.IDSanPham}>
                                                <p style={{paddingTop:'25px'}}>{item.TenSP}</p>
                                                <img src={item.IMG} alt={item.TenSP} width='80px' />
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell style={{width:'300px'}}>
                                    <span>Giá trị đơn hàng: {formatCurrency(value.ThanhTien)} </span>
                                    <p>Hình thức thanh toán: {value.IDHinhThuc === 1 && <span> Thanh toán khi nhận hàng</span>}
                                    {value.IDHinhThuc === 2 && <span> Thanh toán trực tuyến</span>}</p>
                                    
                                    <span className={value.TrangThaiThanhToan === "Chưa thanh toán" ? style['red'] : style['green']}>
                                        Trạng thái thanh toán: {value.TrangThaiThanhToan}
                                    </span>
                                </TableCell>
                                <TableCell style={{width:'300px'}}>
                                    <span>Ngày đặt: {value.NgayDat}</span>
                                    <p>Ngày giao dự kiến: {value.NgayGiaoDuKien}</p>
                                    <p>Địa chỉ: {value.DiaChi}</p>
                                </TableCell>
                                <TableCell style={{width:'150px'}}>
                                <Button
    variant="contained"
    color="primary"
    size="small"
    onClick={() => handleClickOpenDialog(value)}
    startIcon={<FontAwesomeIcon icon={faPenToSquare} />}>
    Xác nhận
</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>Xác nhận đơn hàng</DialogTitle>
    <DialogContent>
        <DialogContentText>Bạn có chắc chắn muốn xác nhận đơn hàng <span style={{fontWeight:'bold'}}>{selectedOrder?.IDDonHang}</span> này không?</DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog} color="error">Hủy</Button>
        <Button onClick={handleConfirmOrder} color="primary">Đồng ý</Button>
    </DialogActions>
</Dialog>
            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Pagination
                    count={Math.ceil(filteredAndSortedOrders().length / ordersPerPage)} // Tổng số trang
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </div>
        </div>
    );
}

export default ManagePurchaseOrder;
