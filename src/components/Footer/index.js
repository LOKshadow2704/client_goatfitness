import React from "react";
import style from './style.module.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

function Footer() {
    return (
        <footer className={style.footer}>
            <div className={style.newSection}>
                <div className={style.gradientText}>GOAT FITNESS</div>
            </div>
            <div className={style.footerItem}>
                <div className={style.logo}>
                    <p className={style.addressText}>Địa chỉ của chúng tôi:</p>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4937.465911635214!2d106.68677815437955!3d10.82130316398706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBUUC5IQ00!5e0!3m2!1svi!2s!4v1709737113792!5m2!1svi!2s"
                        className={style.map}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
            <div className={style.footerItem}>
                <div className={style.contact}>
                    <h1>Bạn cần hỗ trợ?</h1>
                    <p>Liên hệ ngay:</p>
                    <h2>0328 058 832</h2>
                    <h2>Email: Nguyenlocface@gmail.com</h2>
                </div>
            </div>
            <div className={style.footerItem}>
                <div className={style.explore}>
                    <h1>Thông tin</h1>
                    <a href="">Nội quy phòng tập</a>
                    <hr />
                    <a href="">Điều khoản</a>
                    <hr />
                    <a href="">Góp ý & phản hồi</a>
                    <hr />
                    <a href="">Tuyển dụng</a>
                </div>
            </div>
            <div className={style.newSection1}>
                <p>Copyright ©2024 All Rights Reserved by GOAT FITNESS</p>
                <div className={style.socialMedia}>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook className={style.icon} />
                        Facebook
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className={style.icon} />
                        Instagram
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
