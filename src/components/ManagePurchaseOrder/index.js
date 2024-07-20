import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useAnnouncement } from "../../contexts/Announcement";

function ManagePurchaseOrder() {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [update, setUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('');
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
            axios.post("http://localhost:88/Backend/PurchaseOrder/unconfimred", null, { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setPurchaseOrders(response.data.orders);
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
            axios.put("http://localhost:88/Backend/PurchaseOrder/confirm", { IDDonHang: id }, { headers: headers })
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

    const filteredAndSortedOrders = () => {
        let filteredOrders = purchaseOrders.filter(order =>
            order.orderInfo.some(item => item.TenSP.toLowerCase().includes(searchTerm.toLowerCase())) ||
            order.IDDonHang.toString().includes(searchTerm)
        );

        if (sortOrder === 'date_asc') {
            filteredOrders = filteredOrders.sort((a, b) => new Date(a.NgayDat) - new Date(b.NgayDat));
        } else if (sortOrder === 'date_desc') {
            filteredOrders = filteredOrders.sort((a, b) => new Date(b.NgayDat) - new Date(a.NgayDat));
        }

        return filteredOrders;
    };

    const formatCurrency = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    };

    return (
        <div className={style["wrap"]}>
            <div className={style['header']}>
                <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchTerm}
                    onChange={handleSearch}
                />

                <select value={sortOrder} onChange={handleSortOrderChange}>
                    <option value="">Sắp xếp theo...</option>
                    <option value="date_asc">Ngày đặt (Mới nhất)</option>
                    <option value="date_desc">Ngày đặt (Cũ nhất)</option>
                </select>
            </div>

            <table className={style['manage_product']}>
                <thead>
                    <tr>
                        <th>Thông tin đơn hàng</th>
                        <th>Thông tin thanh toán</th>
                        <th>Thông tin giao hàng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedOrders().map((value) => (
                        <tr key={value.IDDonHang}>
                            <td>
                                <p><b>ID Đơn hàng: {value.IDDonHang}</b></p>
                                <div className={style['products']}>
                                    {value.orderInfo.map(item => (
                                        <div className={style['product_item']} key={item.IDSanPham}>
                                            <p>{item.TenSP}</p>
                                            <img src={item.IMG} alt={item.TenSP} width='80px' />
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <span>Giá trị đơn hàng: {formatCurrency(value.ThanhTien)} </span>
                                {value.IDHinhThuc === 1 && <span> (Thanh toán khi nhận hàng)</span>}
                                {value.IDHinhThuc === 2 && <span> (Thanh toán VNPay)</span>}
                                <span className={value.TrangThaiThanhToan === "Chưa thanh toán" ? style['red'] : style['green']}>
                                    Trạng thái thanh toán: {value.TrangThaiThanhToan}
                                </span>
                            </td>
                            <td>
                                <span>Ngày đặt: {value.NgayDat}</span>
                                <span>Ngày giao dự kiến: {value.NgayGiaoDuKien}</span>
                            </td>
                            <td>
                                <button onClick={() => handleUpdate(value.IDDonHang)}>
                                    <FontAwesomeIcon icon={faPenToSquare} /> Chấp nhận
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManagePurchaseOrder;
