import React from "react";
import style from './style.module.css';

function PTitem({children}) {
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(children.GiaThue);

    return (
        <div className={style.HlvItem} key={children.IDHLV}>
            <a href={`/PTInfo/${children.IDHLV}`}><img className={style.img} src={children.avt} alt={children.HoTen} /></a>
            <a href={`/PTInfo/${children.IDHLV}`}>
                <div className={style.wrap_content}>
                    <h1>{children.HoTen}</h1>
                    <p>
                        Đơn giá:<span className={style.price}>{formattedPrice}</span>VND /buổi (60 phút)
                    </p>
                </div>
            </a>
            <button className={style.CartBtn}>
                <a href={`/PTInfo/${children.IDHLV}`}>
                    <p className={style.text}>Xem chi tiết</p>
                </a>
            </button>
        </div>
    );
};

export default PTitem;
