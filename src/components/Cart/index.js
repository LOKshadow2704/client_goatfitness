import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from '@tippyjs/react';
import { Link } from "react-router-dom";
function Cart(){
    const [cartData, setCartData]= useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [update , setUpdate] = useState(false);
    const handleClickBuy = () =>{
        let orderInfos = [];
        selectedItems.forEach((index) => {
            orderInfos.push(cartData[index]);
        });
        sessionStorage.setItem('OrderInfo', JSON.stringify(orderInfos));
    }
    useEffect(()=>{
        let total = 0;
        selectedItems.forEach((index) => {
            total += cartData[index].DonGia * cartData[index].SoLuong;
        });
        setTotalPrice(total);
    }, [selectedItems, cartData]);
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
            method : 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            }
        }
        fetch('http://localhost:88/Backend/cart/',option)
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
            method : 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:88/Backend/cart/updateQuanPlus',option)
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
            method : 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:88/Backend/cart/updateQuanMinus',option)
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
                    <input  type="number"
                            value={value.SoLuong}
                            readOnly/>
                    <FontAwesomeIcon icon={faMinus} onClick={()=>updateQuanMinus(value.IDSanPham)} />
                </div>
            
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