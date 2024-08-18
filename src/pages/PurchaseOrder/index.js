import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { useAnnouncement } from "../../contexts/Announcement";

function PurchaseOrder(){
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
                    const response = await axios.get('http://localhost:8080/Backend/PurchaseOrder', { headers: headers });
                    if (response.status >= 200 && response.status < 300) {
                        setPurchaseOrders(response.data.orders);
                    } else {
                        throw new Error("Lấy thông tin đơn hàng thất bại!");
                    }
                } else {
                    throw new Error("Vui lòng đăng nhập!");
                }
            } catch (error) {
                setError(true);
                setMessage(error.message);
                setLocation(true);
                setLink("http://localhost:3000/login");
            } finally {
                setIsLoading(false); // Dừng hiển thị loading khi dữ liệu đã được xử lý
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

    return (
        <>
            <Header />
            <div className={style.container}>
                <div className={style.Wrap_content}>
                    <h1>ĐƠN HÀNG CỦA BẠN</h1>
                    {isLoading ? (
                        <h1 style={{ backgroundColor: 'white' }}>Đang tải dữ liệu...</h1>
                    ) : purchaseOrders.length === 0 ? (
                        <h1 style={{ backgroundColor: 'white' }}>Không có đơn hàng</h1>
                    ) : (
                        purchaseOrders.map((value) => (
                            <div className={style.order_item} key={value.IDDonHang}>
                                <h1 >
                                    <FontAwesomeIcon icon={faReceipt} /> Mã Đơn hàng: {value.IDDonHang}
                                </h1>
                                <h1 className={style.right}>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Địa chỉ giao hàng: {value.DiaChi}
                                </h1>
                                <div className={style.order_details}>
                                    {value.orderInfo.map(item => (
                                        <div className={style.product_item} key={item.TenSP + item.SoLuong}>
                                            <div className={style.group1}>
                                                <p className={style.text_margin}>{item.TenSP}</p>
                                                <img src={item.IMG} alt="" height="100%" width="150px" />
                                                <span className={style.text_margin}>Số lượng: <b>{item.SoLuong}</b></span>
                                            </div>
                                            <div className={style.group2}>
                                                <span> Ngày đặt: {formatDate(value.NgayDat)}</span>
                                                <span> Ngày giao dự kiến: {formatDate(value.NgayGiaoDuKien)}</span>
                                                <span> Trạng thái thanh toán: 
                                                    <span style={{ color: value.TrangThaiThanhToan === 'Chưa thanh toán' ? 'red' : 'green' }}>
                                                        {value.TrangThaiThanhToan}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className={style.group3}>
                                                <span>Giá: {item.DonGia.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                                <span>Thành tiền: {(item.SoLuong * item.DonGia).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className={style.order_total}>
                                        Tổng đơn hàng: {value.ThanhTien.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default PurchaseOrder;
