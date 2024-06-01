import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";

function PurchaseOrder(){
    const [PurchaseOrder , SetPurchaseOrder] = useState();
   
    useEffect(()=>{
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
        const isLogin = findCookie("jwt");
        if(isLogin){
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            axios.post('http://localhost:88/Backend/PurchaseOrder',null, { headers: headers 
            }).then(response => {
                if(response.status >= 200 && response.status < 300){
                    SetPurchaseOrder(response.data.orders);
                }else{
                    throw new Error("Lấy thông tin đơn hàng thất bại!");
                }
            }).catch(error => {
                alert(error.response.data.error);
            });
                
        }
    },[])
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let day = date.getDate();
        day = day < 10 ? '0' + day : day;
        return `${day}-${month}-${year}`;
    }
    return(
        <>
        <Header/>
        <div className={style.container}>
            <div className={style.Wrap_content}>
                <h1>Đơn hàng của bạn</h1>
                {
                        PurchaseOrder ?  PurchaseOrder.map((value)=>(
                            <div className={style.order_item} key={value.IDDonHang}>
                                <h1>Mã Đơn hàng {value.IDDonHang}</h1> <h1>Địa chỉ giao hàng: {value.DiaChi}</h1>
                                <div className={style.PurchaseOrder_box}>
                                    {
                                        value.orderInfo.map(item => (
                                            
                                            <div className={style.product_item}>
                                                <div className={style.group1}>
                                                    <p>{item.TenSP}</p>
                                                    <img src={item.IMG} alt="" height="100%" width="150px"/>
                                                    <span>Số Lượng: x{item.SoLuong}</span>
                                                </div>
                                                <div className={style.group2}>
                                                    <span>Ngày đặt: {formatDate(value.NgayDat)}</span>
                                                    <span>Ngày giao dự kiến: {formatDate(value.NgayGiaoDuKien)}</span>
                                                    <span>Trạng thái thanh toán: {value.TrangThaiThanhToan}</span>
                                                </div>
                                                <div className={style.group3}>
                                                    <span>Giá: {item.DonGia.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                                                    <span>Thành tiền: {(item.SoLuong * item.DonGia).toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                                                </div>
                                                
                                            </div>
                                        ))
                                    }
                                </div>
                                <span>Tổng đơn hàng: {value.ThanhTien.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                            </div>
                        ))
                        
                    : <h1 style={{ backgroundColor: 'white' }}>Không có đơn hàng</h1>
                }
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default PurchaseOrder;