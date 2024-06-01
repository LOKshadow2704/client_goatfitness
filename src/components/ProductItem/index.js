import style from './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

function ProductItem({children, current ,  setAddCartCount}){
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
    if(!jwt){
      alert("Vui lòng đăng nhập")
      window.location.href = "http://localhost:3000/login" ;
      return
    }
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
          alert("Vui lòng đăng nhập")
          window.location.href = "http://localhost:3000/login" ;
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
    return (
        <div className={style.productItem} key={children.IDSanPham} >
          <Link to={`/ProductInfo/${children.IDSanPham}`}><img src={children.IMG} alt={children.TenSP} /></Link>
          <Link to={`/ProductInfo/${children.IDSanPham}`}>
          <div className={style.wrap_content}>
        
            <h1>{children.TenSP}</h1>
            <p>Đơn giá: {children.DonGia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
            
          </div>
          </Link>
          <div>
            <button className={style['CartBtn']} onClick={()=>{
                AddtoCart(children.IDSanPham);
                setAddCartCount(()=>(current+1));
            }}>
              <FontAwesomeIcon className={style['IconContainer']} icon={faCartPlus}/> 
              <p className={style['text']}>Thêm vào giỏ hàng</p>
            </button>
                
          </div>
      </div>

    );
};

export default ProductItem;