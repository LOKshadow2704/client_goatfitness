import React from "react";
import style from "./style.module.css";

function HeaderLogo() {
  return (
    <header className={style.header}>
      <div className={style["wrap-logo"]}>
        <div className={style.logo}>
          <a href="/">
            <img
              src="https://i.imgur.com/n63xUfG.jpeg"
              alt="logo"
              width="100%"
            />
          </a>
        </div>
      </div>
    </header>
  );
}

export default HeaderLogo;
