import React from "react";
import style from "./style.module.css";

function Loading(){
    return(
        <div className={style["loading-wave"]}>
            <div className={style["loading-bar"]}></div>
            <div className={style["loading-bar"]}></div>
            <div className={style["loading-bar"]}></div>
            <div className={style["loading-bar"]}></div>
        </div>
    )
}

export default Loading