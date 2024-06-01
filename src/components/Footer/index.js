import React from "react";
import style from './style.module.css';

function Footer (){
    return (
        <footer id={style["footer"]}>
            <div className={style['footer-item-1']}>
                <div className={style["logo"]}>
                    <img src="https://i.imgur.com/n63xUfG.jpeg" alt="notthing" width="100%" className={style['logo'] } />
                    <p>Vì sức khỏe của bạn</p>
                    <p>Map:</p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4937.465911635214!2d106.68677815437955!3d10.82130316398706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBUUC5IQ00!5e0!3m2!1svi!2s!4v1709737113792!5m2!1svi!2s" width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

                </div>
            </div>
            <div className={style["footer-item-2"]}>
                <div className={style["contact"]}>
                    <h1>Bạn cần hỗ trợ?</h1>
                    <p>Liên hệ ngay:</p>
                    <h2>0328 058 832</h2>
                    <h2>Email: Nguyenlocface@gmail.com</h2>
                </div>
            </div>
            <div className={style["footer-item-3"]}>
                <div className={style["explore"]}>
                    <h1>Thông tin</h1>
                    <a href="">Nội quy phòng tập</a>
                    <hr/>
                    <a href="">Điều khoản</a>
                    <hr/>
                    <a href="">Góp ý & phản hồi</a>
                    <hr/>
                    <a href="">Tuyển dụng</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;