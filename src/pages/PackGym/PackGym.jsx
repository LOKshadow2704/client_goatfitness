import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useAnnouncement } from "../../contexts/Announcement";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function GymPack() {
    const [categories, setCategories] = useState();
    const location = useLocation();
    const [statusPayment, setStatusPayment] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const { setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();

    useEffect(() => {
        axios.get("http://localhost:8080/Backend/gympack/")
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
            axios.post('http://localhost:8080/Backend/order-gympack', data, { headers: headers })
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
                                    <label htmlFor={value.IDGoiTap}> {value.ThoiHan} ngày - <span style={{ color: 'red' }}>{value.Gia.toLocaleString()} </span> VNĐ</label>
                                    <label htmlFor={value.IDGoiTap}> Chỉ với <span style={{ color: 'red' }}>{Math.floor(value.Gia / value.ThoiHan).toLocaleString()}</span> VNĐ / ngày</label>
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
                    <img alt="" src="https://i.imgur.com/k9U4tVY.png" width="80%" />
                </div>
                <div className={style.info}>
                    <h3>Thông tin chi tiết các gói tập</h3>
                    <TableContainer component={Paper} sx={{ border: 'none',width:'1300px',height:'auto',paddingTop:'40px',marginLeft:'8%',paddingBottom:'30px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell style={{fontWeight:"bold", textAlign:"center",fontSize:"18px"}}>Classic</TableCell>
                                    <TableCell style={{fontWeight:"bold", textAlign:"center",fontSize:"18px"}}>Royal</TableCell>
                                    <TableCell style={{fontWeight:"bold", textAlign:"center",fontSize:"18px"}}>Signature</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Không giới hạn thời gian luyện tập.</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tự do tập luyện tại tất cả câu lạc bộ trong hệ thống GOAT Fitness.</TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Nước uống miễn phí.</TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Dịch vụ khăn tập thể thao cao cấp.</TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>1 buổi định hướng luyện tập riêng biệt và tư vấn dinh dưỡng.</TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Được sử dụng dịch vụ thư giãn sau luyện tập (sauna và steambath).</TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Được dẫn theo 1 người thân đi tập cùng (người đi cùng được phục vụ như quyền lợi thẻ classic).</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Lối vào check-in ưu tiên cho hội viên Signature.</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Phục vụ thảm tập Yoga có logo Signature khi tham gia lớp.</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Sử dụng khu vực VIP Lounge dành riêng cho hội viên Signature (Không áp dụng cho Khách đi kèm).</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green" }} /></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default GymPack;
