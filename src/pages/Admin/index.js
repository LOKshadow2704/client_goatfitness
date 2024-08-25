import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faCircle, faClipboard, faDumbbell, faFolderOpen, faGears, faList, faPeopleRoof, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import ManagePurchaseOrder from "../../components/ManagePurchaseOrder";
import ManagePackGym from "../../components/ManagePackGym";
import Dashboard from "../../components/Dashboard";
import ManageProduct from "../../components/ManegeProduct";
import AccountSetting from "../AccountSetting";
import ManageAccount from "../../components/ManageAccount";
import Announcement from "../../components/Announcement";
import { useAnnouncement } from "../../contexts/Announcement";
import MainLayout from "../../components/MainLayout";
function Admin(){
    // const [currentPage, setCurrentPage] = useState('Dashboard');
    // const {user , logout } = useAuth();
    // const [update , setUpdate] = useState(false);
    // const {success , warning , error} = useAnnouncement();
    // useEffect(()=>{
    //     setUpdate(false);
    // },[success , warning , error ,update])
    // giu lai
    return (
       <MainLayout/>
    );
};

export default Admin;