
import style from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Cart from '../../components/Cart';
import UserPackage from '../UserPackage';
import { useAnnouncement } from '../../contexts/Announcement';
import Announcement from '../../components/Announcement';

function Header(){
    const [showModal, setShowModal] = useState(false);
    const [cart , setCart] = useState(false);
    const cartRef = useRef(null);
    const { isLogin , user } = useAuth();
    const {error , success  , warning , setError , setSuccess , setMessage , setLocation} = useAnnouncement();

    useEffect(()=>{
        
    },[error , success , warning])



    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setCart(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });


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


    function Logout(){
        const jwt = findCookie('jwt');
        const option = {
            method : 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            }
        }
        fetch('http://localhost:88/Backend/logout/',option)
            .then(
                response=>{
                    if(response.ok){
                        document.cookie = 'jwt=; Max-Age=-1; path=/;';
                        document.cookie = 'PHPSESSID=; Max-Age=-1; path=/;';
                        return response.json();
                    }else{
                        throw new Error (response.error);
                    }
                }
            )
            .then(
                data =>{
                    setSuccess(true);
                    setMessage(data.message);
                    setLocation(true);
                }
            )
            .catch(
                error => {
                    console.error(error);
                }
            )
    }

    return (
        <header className={style['header']}>
            <div className={style['wrap-logo']}>
                <div className={style.logo}>
                    <a href="/"><img src="https://i.imgur.com/n63xUfG.jpeg" alt="notthing" width="100%" /></a>
                </div>
            </div>
            <div className={style.navbar}>
                <ul>
                    <li><a href="/shop">Shop</a></li>
                    <li><a href="/PT">HLV Cá Nhân</a></li>
                    <li><a href="/info">Giới thiệu</a></li>
                    <li><a href="/GymPack">Gói tập</a></li>
                </ul>
            </div>
            <div className={style.nav_item}>
                {! isLogin &&
                <button><a href="/login">Luyện tập ngay</a></button>}
                <div className={style['shopyfi']}   ref={cartRef}>

                <FontAwesomeIcon icon={faShopify}  onClick={() => {
                    if (cart) {
                        if (!isLogin) {
                            setError(true);
                            setMessage("Vui lòng đăng nhập!");
                        }
                        setCart(false);
                    } else {
                        if (!isLogin) {
                            setError(true);
                            setMessage("Vui lòng đăng nhập!");
                        }
                        setCart(true);
                    }
                }} 
                />
                    
                    {cart && isLogin &&
                        <Cart/>
                    }
                    
                </div>
                {user && isLogin && (
                        <div className={style["user"]}>
                            <img src={user.avt} alt="user" width="100%"/>
                            <p>{user.HoTen}</p>
                            <ul className={style["dropdown-content"]}>
                                <li><Link to="/account-setting">Thông tin tài khoản</Link></li>
                                <li onClick={()=>setShowModal(true)}><Link to="#">Thông tin gói tập</Link></li>
                                <li><Link to="/PurchaseOrder">Đơn hàng</Link></li>
                                <li onClick={Logout}>Đăng Xuất</li>
                            </ul>
                        </div>

                    )}
            </div>
            {
                showModal && <UserPackage setShowModal = {setShowModal}/>
            }
             {error || success || warning ? <Announcement /> : null}
        </header>
    );
};

export default Header;