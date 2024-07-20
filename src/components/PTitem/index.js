import React from "react";
import style from './style.module.css';
function PTitem({children}){
    return (
        <div className={style.HlvItem} key={children.IDHLV}>
          <a href={`/PTInfo/${children.IDHLV}`}><img src={children.avt} alt={children.HoTen} /></a>
          <a href={`/PTInfo/${children.IDHLV}`}>
          <div className={style.wrap_content}>
            <h1>{children.HoTen}</h1>
            <p>Đơn giá: {children.GiaThue} /buổi (60 phút)</p>
          </div>
          </a>
          <button className={style['CartBtn']} >
            <a href={`/PTInfo/${children.IDHLV}`}>
              <p className={style['text']}>Xem chi tiết</p>
            </a>
          </button>
      </div>
    );
};

export default PTitem;