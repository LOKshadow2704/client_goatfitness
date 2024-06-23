import React, { useCallback, useEffect } from "react";
import style from "./style.module.css";
import { useAnnouncement } from "../../contexts/Announcement";
import { faCircleCheck, faCircleExclamation, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

    function Announcement(){
        const {error , success , warning , message , setError , setSuccess , setWarning,  location , setLocation , link , setLink } = useAnnouncement();

        const handleReset = useCallback(() => {
            setError(false);
            setSuccess(false);
            setWarning(false);
        }, [setError, setSuccess ,setWarning ]);

        useEffect(() => {
            if (error || success || warning) {
                const timeout = setTimeout(() => {
                    handleReset();
                    if(location && link){
                        const newLink = link;
                        setLocation(null);
                        setLink('');
                        window.location.href = newLink;
                    }
                }, 3000);
                
                return () => clearTimeout(timeout);
            }
        }, [error, success, warning, handleReset , link , location, setLink , setLocation]);
        return(
            <div className={`${style.Announcement} ${error || success || warning ? style.slideInFromRight : ''}`}>
                {/* Thông báo lỗi */}
                {error &&                 
                    <span className={style.error}><span><FontAwesomeIcon icon={faCircleExclamation} /></span> <p>Không thành công: </p>  <p>{message}</p></span>               
                }
                
                {/* Thông báo thành công */}


                {success && 
                    <span className={style.success}><span><FontAwesomeIcon icon={faCircleCheck} /> </span><p>Thành công: </p> <p>{message}</p></span>
                }

                {/* Thông báo Warning */}

                {warning && 
                    <span className={style.warning}><span><FontAwesomeIcon icon={faTriangleExclamation} /> </span><p>Cảnh báo: </p> <p>{message}</p></span>
                }
            </div>
        )
    }

    export default Announcement;