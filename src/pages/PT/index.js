import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PTitem from "../../components/PTitem";
import RegisterPT from "../RegisterPT";
import style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useAnnouncement } from "../../contexts/Announcement";

function PT() {
    const location = useLocation();
    const [ptrainers, setPtrainer] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState('Tất cả');
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('none');
    const [showModal, setShowModal] = useState(false);
    const { setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();

    //Thông báo
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
                        setLink("http://localhost:3000/PT");
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
    }, [location.search, setError, setLink, setLocation, setMessage, setSuccess]);

    useEffect(() => {
        fetch("http://localhost:88/Backend/PT/")
            .then(
                response => {
                    if (response.ok) {
                        return response.json();
                    }
                }
            ).then(
                data => {
                    setPtrainer(data)
                    const uniqueCategories = [...new Set(data.map(product => product.DichVu))];
                    setCategories(uniqueCategories);
                }
            ).catch(error => {
                setError(true);
                setMessage(error.response.data.error);
            });
    }, [setError, setMessage]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = (e) => {
        setSortOrder(e.target.value);
    };

    const filteredProducts = ptrainers
        .filter(trainer =>
            productsByCategory === 'Tất cả' || trainer.DichVu === productsByCategory)
        .filter(trainer =>
            trainer.HoTen && trainer.HoTen.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.GiaThue - b.GiaThue;
            } else if (sortOrder === 'desc') {
                return b.GiaThue - a.GiaThue;
            }
            return 0;
        });

    return (
        <>
            <Header setCartHeader={setCartCount} RerendercartCount={cartCount} />
            <div className={style['container']}>
                <div className={style["wrap_content"]}>
                    <div className={style.header}>
                        <h1>Các Huấn luyên viên nổi bật tại GOAT GYM</h1>
                        <h2>Mô tả</h2>
                    </div>
                    <div className={style.action}>
                        <div className={style.action4}>
                            <button onClick={() => setShowModal(true)}>Đăng ký làm việc</button>
                        </div>
                        <div className={style.action1}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <input
                                type="text"
                                id="search"
                                placeholder="Nhập tên hlv"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className={style.action2}>
                            <label htmlFor="product_category">Danh mục HLV </label>
                            <select id="product_category" onChange={(e) => setProductsByCategory(e.target.value)}>
                                <option value="Tất cả">Tất cả</option>
                                {categories.map((value, index) => (
                                    <option key={index} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div className={style.action3}>
                            <label htmlFor="sort">Sắp xếp theo giá  </label>
                            <select id="sort" onChange={handleSort}>
                                <option value="none">Không sắp xếp</option>
                                <option value="asc">Tăng dần</option>
                                <option value="desc">Giảm dần</option>
                            </select>
                        </div>
                    </div>
                    <div className={style['product']}>
                        <ul>
                            {filteredProducts && filteredProducts.map(value => (
                                <li key={value.IDHLV}>
                                    <PTitem
                                        children={value}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
            {showModal && <RegisterPT setShowModal={setShowModal} />}
        </>
    );
};

export default PT;
