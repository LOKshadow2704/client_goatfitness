import React, { useEffect, useRef, useState } from "react";
import style from './style.module.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate , useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

function ProductInfo (){
    const {productID} =  useParams();
    const [product, setProduct] = useState();
    const quantityInput = useRef(null);
    const navigate = useNavigate();
    //Set Data Mua hàng
    const handleClickBuy = (SanPham , SoLuong) =>{
        SanPham.SoLuong=SoLuong 
        const jsonData = JSON.stringify([SanPham]);
        sessionStorage.setItem('OrderInfo' , jsonData);
        navigate('/Order');
    }

    function AddtoCart(IDSanPham){
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
        const data = {
          IDSanPham: IDSanPham
        };
        const option = {
            method : 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            },
            body: JSON.stringify(data)
        }
        fetch("http://localhost:88/Backend/cart/add", option)
        .then(response => {
          if (!response.ok) {
              throw new Error(response.error);
          }
          return response.json();
          })
          .then(data => {
              const message = data.message;
              console.log(message);
          })
          .catch(error => {
              console.error('Lỗi khi thêm vào giỏ hàng', error);
          });
      }
    useEffect(() => {
        fetch(`http://localhost:88/Backend/product?IDSanPham=${productID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi server');
            } else {
                return response.json();
            }
        })
        .then(data => {
            setProduct(data[0]);
        })
        .catch(error => {
            console.error('Lỗi khi truy cập dữ liệu', error);
        });
    }, [productID])
    return (
        <>
            <Header/>
            <div className={style.container}>
                <div className={style.left}>
                    <img src={product ? product.IMG : ''} alt="" width='50%' />
                </div>
                <div className={style.right}>
                    <h1>{product ? product.TenSP: ''}</h1>

                    <span> Đơn giá:
   <span style={{ color: 'red',marginLeft:'2px', fontSize:'16px' }}>
    {product ? new Intl.NumberFormat('vi-VN').format(product.DonGia) : ''}
  </span> VNĐ
</span>

<div className={style.info}>
  <div dangerouslySetInnerHTML={{ 
    __html: product 
      ? '· ' + product.Mota
          .replace(/(\r\n|\n|\r)/g, '<br>· ') 
      : '' 
  }} />
</div>

                    <div className={style.action}>
                    <p> Số lượng </p>
                    <input type="number" min='1' defaultValue="1" ref={quantityInput} />
                        <button className={style['CartBtn-1']} onClick={()=>{
                            AddtoCart(product.IDSanPham);
                            
                        }}>
                            <FontAwesomeIcon className={style['IconContainer']} icon={faCartPlus}/> 
                            <p className={style['text']}>Thêm vào giỏ hàng</p>
                        </button>

                        <button className={style['CartBtn-2']} onClick={()=>handleClickBuy(product , quantityInput.current.value)}><p className={style['text']}>Mua ngay</p></button>
                        
                    </div>
                    
                </div>
            </div>
            <Footer></Footer>

        </>
    );

}

export default ProductInfo;