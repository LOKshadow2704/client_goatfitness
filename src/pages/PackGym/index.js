import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PaymentModal from "../../components/PaymentModal";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useAnnouncement } from "../../contexts/Announcement";

function GymPack() {
    const [categories, setCategories] = useState();
    const location = useLocation();
    const [statusPayment, setStatusPayment] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const { setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();

    useEffect(() => {
        axios.get("http://localhost:88/Backend/gympack/")
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    const categorie = {
                        classic: [],
                        royal: []
                    };

                    response.data.forEach(item => {
                        if (item.TenGoiTap.startsWith('classic')) {
                            categorie.classic.push(item);
                        } else if (item.TenGoiTap.startsWith('royal')) {
                            categorie.royal.push(item);
                        }
                    });
                    setCategories(categorie);
                } else {
                    throw new Error("Lấy thông tin thất bại !");
                }
            })
            .catch(error => {
                setError(true);
                setMessage(error.message);
            });
    }, [setError, setMessage]);

    useEffect(() => {
        const checkMessage = () => {
            const searchParams = new URLSearchParams(location.search);
            const message = searchParams.get('message');
            if (message) {
                switch (message) {
                    case "successfully":
                        setSuccess(true);
                        setMessage('Đăng ký thành công!');
                        setLocation(true);
                        setLink("http://localhost:3000/GymPack");
                        break;
                    case "unsuccessfully":
                        setError(true);
                        setMessage('Đăng ký không thành công!');
                        break;
                    default:
                        break;
                }
            }
        };

        checkMessage();
    }, [location.search, setError, setMessage, setSuccess, setLocation, setLink]);

    const handlePackageChange = (event) => {
        const selectedPackageID = parseInt(event.target.value, 10);
        const allPackages = [...categories.classic, ...categories.royal];
        const selectedPackage_ = allPackages.find(pkg => pkg.IDGoiTap === selectedPackageID);
        setSelectedPackage(selectedPackage_);
    };

    const findCookie = (name) => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    };

    const handleSubmit = (payment, selectedPackage_) => {
        if (!selectedPackage_ || !selectedPackage_.IDGoiTap) {
            setError(true);
            setMessage("Vui lòng chọn gói tập");
            return;
        }
        const isLogin = findCookie("jwt");
        if (isLogin) {
            const jwt = findCookie('jwt');
            const data = {
                IDGoiTap: selectedPackage_.IDGoiTap,
                HinhThucThanhToan: payment,
                ThoiHan: selectedPackage_.ThoiHan,
                amount: selectedPackage_.Gia
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            axios.post('http://localhost:88/Backend/order-gympack', data, { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        if (response.data.success) {
                            window.location.href = response.data.success;
                        } else {
                            setSuccess(true);
                            setMessage(response.data.message);
                            setLocation(true);
                            setLink("http://localhost:3000/GymPack");
                        }
                    } else {
                        throw new Error("Đăng ký không thành công!");
                    }
                })
                .catch(error => {
                    setError(true);
                    setMessage(error.response.data.error);
                });

        } else {
            setError(true);
            setMessage("Vui lòng đăng nhập!");
            setLocation(true);
            setLink("http://localhost:3000/login");
        }
    };

    return (
        <>
            <Header />
            <div className={style['container']}>
                {statusPayment &&
                    <PaymentModal
                        setStatusPayment={setStatusPayment}
                        handleSubmit={handleSubmit}
                        selectedPackage={selectedPackage}
                    />
                }
                <div className={style.header}>
                    {/* Đoạn mã cho header */}
                </div>
                <div className={style["wrap_content"]}>
                    <div className={style.packageGym}>
                        <h1>Bảng dịch vụ: </h1>
                        {categories && Object.keys(categories).map((category) => (
                            <div className={style.group} key={category}>
                                <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
                                {categories[category].map((value) => (
                                    <div className={style.radio_box} key={value.IDGoiTap}>
                                        <label htmlFor={value.IDGoiTap}>{value.TenGoiTap}</label>
                                        <input type="radio" id={value.IDGoiTap} name="packageGym" value={value.IDGoiTap} onChange={handlePackageChange} />
                                        <label htmlFor={value.IDGoiTap}> {value.ThoiHan} ngày - {value.Gia.toLocaleString()} VND</label>
                                        <label htmlFor={value.IDGoiTap}>  Chỉ với {Math.floor(value.Gia / value.ThoiHan).toLocaleString()} / ngày</label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button onClick={() => setStatusPayment(true)}>
                            Đăng ký ngay
                            <div >
                                <svg
                                    height="24"
                                    width="24"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                    <path
                                        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </div>
                        </button>
                    </div>
                    <img alt="" src="https://i.imgur.com/8f617SD.jpeg" width="80%" />
                </div>


                <div className={style.info}>
                    <table>
                        <thead>
                            <tr><th></th><th>Classic</th><th>Royal</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Không giới hạn thời gian luyện tập</td><td></td><td><FontAwesomeIcon icon={faCircleCheck} /></td>
                            </tr>
                            <tr>
                                <td>Tự do tập luyện tại tất cả câu lạc bộ trong hệ thống GOAT Fitness</td><td><FontAwesomeIcon icon={faCircleCheck} /></td><td><FontAwesomeIcon icon={faCircleCheck} /></td>
                            </tr>
                            <tr>
                                <td>Nước uống miễn phí</td><td><FontAwesomeIcon icon={faCircleCheck} /></td><td><FontAwesomeIcon icon={faCircleCheck} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default GymPack;
