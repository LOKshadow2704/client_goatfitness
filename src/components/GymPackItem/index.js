import React from "react";
import style from './style.module.css';

function GymPackItem({children}){
    return(
        <div className={style.GymPackItem} key={children.IDGoiTap}>
        <div className="wrap_content">
          <h3>{children.TenGoiTap}</h3>
          <p>Đơn giá: {children.Gia}</p>
          <p>Đơn giá: {children.ThoiHan}</p>
          <div>
              <button>Giỏ hàng</button>
              <button>Mua ngay</button>
          </div>
        </div>
      </div>
    );
}

export default GymPackItem