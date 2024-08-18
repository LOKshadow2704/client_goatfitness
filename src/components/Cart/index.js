import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from '@tippyjs/react';
import { Link } from "react-router-dom";
import { useAnnouncement } from "../../contexts/Announcement";
function Cart(){
    const [cartData, setCartData]= useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [update , setUpdate] = useState(false);
    const { setMessage , setWarning , setSuccess ,setError} = useAnnouncement();
    const handleClickBuy = () =>{
        let orderInfos = [];
        selectedItems.forEach((index) => {
            orderInfos.push(cartData[index]);
        });
        sessionStorage.setItem('OrderInfo', JSON.stringify(orderInfos));
    }
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

        const jwt = findCookie('jwt');
        const option = {
            method : 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            }
        }
        fetch('http://localhost:8080/Backend/cart/',option)
            .then(
                response =>{
                    if(!response.ok){
                        throw new Error('Lỗi server');
                    }else{
                        return response.json();
                    }
                }
            )
            .then(
                data =>{
                    setCartData(data);
                    setUpdate(false)
                }
            )
            .catch(
                error => {
                    console.error('Lỗi khi lấy dữ liệu:', error);
                }
            )
    },[update])
    const handleCheckboxChange = (event, index) => {
        if (event.target.checked) {
            setSelectedItems([...selectedItems, index]);
        } else {
            setSelectedItems(selectedItems.filter((item) => item !== index));
        }
    };

    function updateQuanPlus (IDSanPham){
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
          const data ={
            IDSanPham : IDSanPham
          }
          
        const jwt = findCookie('jwt');
        const option = {
            method : 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:8080/Backend/cart/updateQuanPlus',option)
            .then(
                response =>{
                    if(!response.ok){
                        throw new Error('Lỗi server');
                    }else{
                        setUpdate(true);
                    }
                }
            )
        
            .catch(
                error => {
                    console.error('Lỗi khi lấy dữ liệu:', error);
                }
            )
    }

    function updateQuanMinus (IDSanPham){
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
          const data ={
            IDSanPham : IDSanPham
          }
          
        const jwt = findCookie('jwt');
        const option = {
            method : 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:8080/Backend/cart/updateQuanMinus',option)
            .then(
                response =>{
                    if(!response.ok){
                        throw new Error('Lỗi server');
                    }else{
                        setUpdate(true);
                    }
                }
            )
            .catch(
                error => {
                    console.log(error);
                }
            )
    }

    //Tính thành tiền
    useEffect(() => {
        let total = 0;
        if(!selectedItems){
            return;
        }
        selectedItems.forEach((index) => {
            if (cartData[index]) {
                total += cartData[index].DonGia * cartData[index].SoLuong;
            }
        });
        setTotalPrice(total);
    }, [selectedItems, cartData]);

    function deleteCartItem (IDSanPham){
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
          const data ={
            IDSanPham : IDSanPham
          }
          
        const jwt = findCookie('jwt');
        const option = {
            method : 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:8080/Backend/cart/delete',option)
            .then(
                response =>{
                    if(!response.ok){
                        throw new Error('Lỗi server');
                    }else{
                        setSuccess(true);
                        setMessage("Đã xóa SP khỏi giỏ hàng")
                        setUpdate(true);
                    }
                }
            )
            .catch(
                error => {
                    setError(true);
                    setMessage("Xóa không thành công");
                    console.error('Lỗi khi lấy dữ liệu:', error);
                }
            )
    }
    return (
        <Tippy
        className='tippy'
        placement="bottom-start"
        visible
        interactive
        animation="shift-away" 
        arrow={true}
        maxWidth ="500px"
        offset={[-100, 10]}
    >
        <div className={style.wrap_cart}>
        {
           !cartData ? <h1>Không có sản phẩm</h1>: 
            
            cartData.map((value, index)=> (
            <div key={index} className={style['cart-item']}>
                <input type="checkbox" name="getCart" value={value.IDSanPham} onChange={(event) => handleCheckboxChange(event, index)}
                        />
                <div className={style['product_info']}>
                    <img src={value.IMG} alt={value.TenSP}/>
                    <h1>{value.TenSP}</h1>
                </div>
                <div className={style.price}>{value.DonGia.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</div>
                
                <div className={style.quan}>
                    <FontAwesomeIcon icon={faPlus} onClick={()=>updateQuanPlus(value.IDSanPham)} />
                    <span>{value.SoLuong}</span>
                    <FontAwesomeIcon icon={faMinus} onClick={() => {
                                    if (value.SoLuong > 1) {
                                        updateQuanMinus(value.IDSanPham);
                                    }else{
                                        setWarning(true);
                                        setMessage("Số lượng không hợp lệ");
                                    }
                                }} />
                </div>
                <span onClick={()=>deleteCartItem(value.IDSanPham)}><FontAwesomeIcon icon={faTrash}  /></span>
            </div>
        ))}
        <div className={style.buy}>
            
            <h4>Thành tiền</h4>
            <span>{totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
            <Link to="/Order" ><button onClick={()=>handleClickBuy()}>Mua ngay</button></Link>
        </div>
        
    </div>
    </Tippy>
    );
}

export default Cart;