import style from './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { useAnnouncement } from '../../contexts/Announcement';

function ProductItem({children, current ,  setAddCartCount}){
  const {setSuccess , setError , setMessage} = useAnnouncement();
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
      setError(true);
      setMessage("Vui lòng đăng nhập");
      return;
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
          setError(true);
          setMessage("Không thực hiện được hành động");
          throw new Error(response.error);
      }
      return response.json();
      })
      .then(data => {
          setSuccess(true);
          setMessage(data.message);
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