import React, { useState, useRef, useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import Cart from '../../components/Cart';
import UserPackage from '../UserPackage';
import { useAnnouncement } from '../../contexts/Announcement';
import Announcement from '../../components/Announcement';
import style from './style.module.css';

function Header() {
    const [showModal, setShowModal] = useState(false);
    const [cart, setCart] = useState(false);
    const cartRef = useRef(null);
    const { isLogin, user } = useAuth();
    const { error, success, warning, setError, setSuccess, setMessage, setLocation } = useAnnouncement();
    const location = useLocation();

    useEffect(() => {
        // Handle announcements (if needed)
    }, [error, success, warning]);

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
    }, []);

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

    function Logout() {
        const jwt = findCookie('jwt');
        const option = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            }
        }
        fetch('http://localhost:88/Backend/logout/', option)
            .then(response => {
                if (response.ok) {
                    document.cookie = 'jwt=; Max-Age=-1; path=/;';
                    document.cookie = 'PHPSESSID=; Max-Age=-1; path=/;';
                    return response.json();
                } else {
                    throw new Error(response.error);
                }
            })
            .then(data => {
                setSuccess(true);
                setMessage(data.message);
                setLocation(true);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <header className={style.header}>
            <div className={style['wrap-logo']}>
                <div className={style.logo}>
                    <a href="/"><img src="https://i.imgur.com/n63xUfG.jpeg" alt="logo" width="100%" /></a>
                </div>
            </div>
            <div className={style.navbar}>
                <Tabs
                    value={location.pathname}
                    className={style.TabsList}
                    aria-label="navigation tabs"
                >
                    <Tab
                        label="Trang chủ"
                        component={Link}
                        to="/"
                        value="/"
                        className={style.Tab}
                    />
                    <Tab
                        label="Shop"
                        component={Link}
                        to="/shop"
                        value="/shop"
                        className={style.Tab}
                    />
                    <Tab
                        label="HLV Cá Nhân"
                        component={Link}
                        to="/PT"
                        value="/PT"
                        className={style.Tab}
                    />
                    <Tab
                        label="Giới thiệu"
                        component={Link}
                        to="/info"
                        value="/info"
                        className={style.Tab}
                    />
                    <Tab
                        label="Gói tập"
                        component={Link}
                        to="/GymPack"
                        value="/GymPack"
                        className={style.Tab}
                    />
                </Tabs>
            </div>
            <div className={style.nav_item}>
                {!isLogin &&
                    <button><a href="/login">Luyện tập ngay</a></button>}
                <div className={style['shopyfi']} ref={cartRef}>
                    <FontAwesomeIcon icon={faShopify} onClick={() => {
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
                    }} />
                    {cart && isLogin &&
                        <Cart />
                    }
                </div>
                {user && isLogin && (
                    <div className={style["user"]}>
                        <img src={user.avt} alt="user" width="100%" />
                        <p>{user.HoTen}</p>
                        <ul className={style["dropdown-content"]}>
                            <li><Link to="/account-setting">Thông tin tài khoản</Link></li>
                            <li onClick={() => setShowModal(true)}><Link to="#">Thông tin gói tập</Link></li>
                            <li><Link to="/PurchaseOrder">Đơn hàng</Link></li>
                            <li onClick={Logout}>Đăng Xuất</li>
                        </ul>
                    </div>
                )}
            </div>
            {showModal && <UserPackage setShowModal={setShowModal} />}
            {error || success || warning ? <Announcement /> : null}
        </header>
    );
}

export default Header;
