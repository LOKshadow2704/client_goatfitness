import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { useAnnouncement } from "../../contexts/Announcement";
import Pagination from "@mui/material/Pagination"; 

function PurchaseOrder() {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); 
    const [ordersPerPage] = useState(5); 
    const { setError, setMessage, setLocation, setLink } = useAnnouncement();

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

        // const fetchData = async () => {
        //     try {
        //         const isLogin = findCookie("jwt");
        //         if (isLogin) {
        //             const jwt = findCookie('jwt');
        //             const headers = {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + jwt,
        //                 'PHPSESSID': findCookie("PHPSESSID")
        //             };
        //             const response = await axios.get('http://localhost:8080/Backend/order/purchase', { headers: headers });
        //             if (response.status >= 200 && response.status < 300) {
        //                 setPurchaseOrders(response.data.orders || []);
        //             } else {
        //                 throw new Error("Lấy thông tin đơn hàng thất bại!");
        //             }
        //         } else {
        //             throw new Error("Vui lòng đăng nhập!");
        //         }
        //     } catch (error) {
        //         setError(true);
        //         setMessage(error.message);
        //         setLocation(true);
        //         setLink("http://localhost:3000/login");
        //     } finally {
        //         setIsLoading(false); 
        //     }
        // };

        const fetchData = async () => {
            try {
                const isLogin = findCookie("jwt");
                if (isLogin) {
                    const jwt = findCookie('jwt');
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt,
                        'PHPSESSID': findCookie("PHPSESSID")
                    };
                    const response = await axios.get('http://localhost:8080/Backend/order/purchase', { headers: headers });
                    
                    // Kiểm tra response có dữ liệu orders là mảng không
                    if (response.status >= 200 && response.status < 300) {
                        if (Array.isArray(response.data.orders)) {
                            setPurchaseOrders(response.data.orders.reverse()); 
                        } else {
                            // Xử lý khi không có đơn hàng mới, hiển thị thông báo mà không chuyển hướng
                            setPurchaseOrders([]);
                            setMessage("Không có đơn hàng mới");
                        }
                    } else {
                        // Xử lý lỗi khi không thể lấy dữ liệu đơn hàng
                        throw new Error("Lấy thông tin đơn hàng thất bại!");
                    }
                } else {
                    throw new Error("Vui lòng đăng nhập!");
                }
            } catch (error) {
                if (error.message === "Vui lòng đăng nhập!") {
                    setError(true);
                    setMessage(error.message);
                    setLocation(true);
                    setLink("http://localhost:3000/login");
                } else {
                    // Các lỗi khác sẽ chỉ hiển thị thông báo mà không chuyển hướng
                    setError(true);
                    setMessage(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        
        

        fetchData();
    }, [setError, setLink, setLocation, setMessage]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let day = date.getDate();
        day = day < 10 ? '0' + day : day;
        return `${day}-${month}-${year}`;
    }

    // Tính toán các đơn hàng cần hiển thị trên trang hiện tại
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = purchaseOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Hàm xử lý khi thay đổi trang
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <>
            <Header />
            <div className={style.container}>
                <div className={style.Wrap_content}>
                    <h1>ĐƠN HÀNG CỦA BẠN</h1>
                    {isLoading ? (
                        <h1 style={{ backgroundColor: 'white' }}>Đang tải dữ liệu...</h1>
                    ) : purchaseOrders.length === 0 ? (
                        <h2
                            style={{
                                backgroundImage: 'url(https://res.cloudinary.com/dzh4pimvj/image/upload/v1727708058/ae7688fd-8318-4b59-8009-04cac4930652.png)',
                                backgroundSize: 'cover',
                                textAlign: 'center',
                                marginBottom: '30px',
                                color: 'white',
                                padding: '20px',
                                height: '500px',
                                marginLeft: '45px',
                                marginRight: '45px',
                                fontSize: '30px',
                                borderRadius:'20px',
                            }}
                        >
                            Không có đơn hàng !!!
                        </h2>
                    ) : (
                        <>
                            {currentOrders.map((value) => (
                                <div className={style.order_item} key={value.IDDonHang}>
                                    <h1>
                                        <FontAwesomeIcon icon={faReceipt} /> Mã Đơn hàng: {value.IDDonHang}
                                    </h1>
                                    <h1 className={style.right}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Địa chỉ giao hàng: {value.DiaChi}
                                    </h1>
                                    <div className={style.order_details}>
                                        {value.orderInfo.map((item) => (
                                            <div className={style.product_item} key={item.TenSP + item.SoLuong}>
                                                <div className={style.group1}>
                                                    <p className={style.text_margin}> Tên sản phẩm: {item.TenSP}</p>
                                                    <img src={item.IMG} alt="" height="100%" width="150px" />
                                                    <span className={style.text_margin}>
                                                        Số lượng: <b>{item.SoLuong}</b>
                                                    </span>
                                                </div>
                                                <div className={style.group2}>
                                                    <span> Ngày đặt: {formatDate(value.NgayDat)}</span>
                                                    <span> Ngày giao dự kiến: {formatDate(value.NgayGiaoDuKien)}</span>
                                                    <span>
                                                        Trạng thái thanh toán:
                                                        <span
                                                            style={{
                                                                color:
                                                                    value.TrangThaiThanhToan === 'Chưa thanh toán'
                                                                        ? 'red'
                                                                        : 'green',
                                                            }}
                                                        >
                                                            {value.TrangThaiThanhToan}
                                                        </span>
                                                    </span>
                                                    <span>
                                                        Hình thức thanh toán: {value.IDHinhThuc === 1 ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến"}
                                                    </span>
                                                </div>
                                                <div className={style.group3}>
                                                    <span>
                                                        Giá: {item.DonGia.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                    </span>
                                                    <span>
                                                        Thành tiền: {(item.SoLuong * item.DonGia).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className={style.order_total}>
                                            Tổng đơn hàng: {value.ThanhTien.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Pagination
                                count={Math.ceil(purchaseOrders.length / ordersPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                sx={{marginBottom:'10px', float:'right'}}
                            />
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default PurchaseOrder;
