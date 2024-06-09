import React, { useEffect } from "react";
import style from "./style.module.css";
import { useAnnouncement } from "../../contexts/Announcement";
import { faCircleCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

    function Announcement(){
        const {error , success , message , setError , setSuccess} = useAnnouncement();
        // useEffect(() => {
        //     if (error || success) {
        //         const timeout = setTimeout(() => {
        //             setError(false);
        //             setSuccess(false);
        //         }, 3000);
        //         return () => clearTimeout(timeout);
        //     }
        // }, [error, success]);
        return(
            <div className={style.Announcement}>
                {/* Thông báo lỗi */}
                {error &&                 
                    <span className={style.error}><span><FontAwesomeIcon icon={faCircleExclamation} /></span> <p>Không thành công: </p>  <p>{message}</p></span>               
                }
                
                {/* Thông báo thành công */}


                {success && 
                    <span className={style.success}><span><FontAwesomeIcon icon={faCircleCheck} /> </span><p>Thành công: </p> <p>{message}</p></span>
                }
            </div>
        )
    }

    export default Announcement;