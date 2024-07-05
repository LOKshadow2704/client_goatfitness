import React, { useEffect, useState } from "react";
import style from './style.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {  useLocation } from "react-router-dom";
import { useAnnouncement } from "../../contexts/Announcement";

function Order(){
    const location = useLocation();
    const [totalPrice , setTotalPrice] = useState(0);
    const [products , setProducts] = useState();
    const [selectedPayment, setSelectedPayment] = useState(1);
    const [address , setAddress] = useState();
    const { setError ,setMessage ,setSuccess , setLocation , setLink} = useAnnouncement();

    //Thông báo
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const message = searchParams.get('message');
        switch(message){
            case "successfully":
                setSuccess(true);
                setMessage('Đặt hàng thành công!');
                sessionStorage.removeItem('OrderInfo');
                setLocation(true);
                setLink("http://localhost:3000/PurchaseOrder");
                break;
            case "unsuccessfully":
                setError(true);
                setMessage('Đặt hàng không thành công!');
                break;
            default:
                break;
        }
    }, [location.search, setError ,setMessage ,setSuccess , setLocation , setLink ]);
    
    //Data order
    useEffect(() => {
        setProducts(JSON.parse(sessionStorage.getItem('OrderInfo')));
    }, []);

    //Total price
    useEffect(() => {
        if(products && products.length > 0) {
            let totalPrice = 0;
            products.forEach((value) => {
                totalPrice += value.SoLuong * value.DonGia;
            });
            setTotalPrice(totalPrice);
        }
    }, [products]);
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

    useEffect(() => {
        const isLogin = findCookie("jwt");
        if(isLogin){
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            axios.get('http://localhost:88/Backend/getAccountInfo', { headers: headers 
            }).then(response => {
                if(response.status >= 200 && response.status < 300){
                    setAddress(response.data.DiaChi);
                }else{
                    throw new Error("Lấy thông tin thất bại");
                }
            }).catch(error => {
                setError(true);
                setMessage(error.response.data.error);
            });
        }
    }, [setError , setMessage]);

    const handleBuy = ()=>{
        const isLogin = findCookie("jwt");
        if(isLogin){
            const jwt = findCookie('jwt');
            const data ={
                products: products,
                HinhThucThanhToan: selectedPayment,
                amount: totalPrice,
                DiaChi: address,
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            axios.post('http://localhost:88/Backend/order',  data, { headers: headers 
            }).then(response => {
                if(response.status >= 200 && response.status < 300){
                    if( response.data.success){
                        window.location.href= response.data.success;
                    }else{
                        setSuccess(true);
                        setMessage(response.data.message);
                        setLocation(true);
                        setLink("http://localhost:3000/PurchaseOrder");
                    }
                }else{
                    throw new Error("Đặt hàng không thành công!");
                }
            }).catch(error => {
                setError(true);
                setMessage(error.response.data.error);
            });
                
        }else{
            setError(true);
            setMessage("Vui lòng đăng nhập");
            setLocation(true);
            setLink("http://localhost:3000/login");
            return ;
            
        }
    };

     
    

      const removeItem = (key) =>{
        const updatedProduct = products.filter(item => item.IDSanPham !== key);
        sessionStorage.setItem('OrderInfo', JSON.stringify(updatedProduct));
      }
      const handleQuantityChange = (e, index) => {
        const newQuantity = parseInt(e.target.value); 
        const updatedProducts = [...products]; // Tạo một bản sao của mảng products
        updatedProducts[index].SoLuong = newQuantity;
        setProducts(updatedProducts);
    }
    return (
        <>
            <Header/>
            <div className={style.container}>
                <div className={style.orderItem}>
                <h1>Thông tin đặt hàng</h1>
                <div className={style.group_title}>
                    <h1>Địa chỉ</h1>
                    <input type="text" value={address ? address : ''} onChange={(e) => setAddress(e.target.value)}/>
                </div>
                    <table>
                        <thead>
                            <tr><th>Sản Phẩm</th><th>Số Lượng</th><th>Đơn Giá</th><th>Thành tiền</th></tr>
                        </thead>
                        <tbody>
                        {
                             products ? (
                                products.map((value, index) => (
                                    <tr key ={index}>
                                        <td>
                                            <FontAwesomeIcon icon={faTrashCan} onClick={()=>removeItem(value.IDSanPham)}/>
                                            <img src={value.IMG} alt=""/>
                                            <p>{value.TenSP}</p>
                                        </td>
                                        <td><input type="number" min='1' value={value.SoLuong} onChange={(e) => handleQuantityChange(e, index)}/></td>
                                        <td>{value.DonGia}</td>
                                        <td>{value.SoLuong * value.DonGia}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">Không có sản phẩm</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
                <div className={style.order}>
                    <h1>Thông tin thanh toán</h1>
                    <span>Thành tiền: </span> <span>{totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
                    <label for='payment'>Hình thức thanh toán</label>
                    <select id="payment" value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)}>
                        <option value="1">Thanh toán khi nhận hàng</option>
                        <option value="2">Thanh toán trực tuyến</option>
                    </select>
                    <button onClick={handleBuy}>
                    Đặt hàng
                    <svg  viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                    </button>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Order;
