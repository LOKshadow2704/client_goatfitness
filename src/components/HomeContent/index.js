import React, { useEffect, useState } from "react";
import style from './style.module.css';
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


function HomeContent(){
    const [pts , setPts] = useState();
    const [products , setProducts] = useState();
    const {user} = useAuth();

    useEffect(()=>{
        if(user && user.IDVaiTro === 2){
            window.location.href = "http://localhost:3000/employee";
        }
        if(user && user.IDVaiTro === 1){
            window.location.href = "http://localhost:3000/admin";
        }
        axios.get("http://localhost:88/Backend/HomeContent")
            .then(
                response =>{
                    setPts(response.data[0]);
                    setProducts(response.data[1]);
                }
            ).catch(
                error => {
                    console.log(error.response.data.error);
                }
            )
    },[user])
    return (
        <main  id={style.container}>
            <div className={style['container-item-1']}>
                <div className={style['left-item']}>
                    <img src="https://i.imgur.com/iYwRZz1.jpg" alt="nothing" width="100%"/>
                </div>
                <div className={style['right-item']}>
                    <h1>Chào mừng bạn đến GOAT GYM</h1>
                    <h2>Chúng tôi có đội ngũ huấn luyện viên được đào tạo chuyên nghiệp. Hãy để chúng tôi thay đổi cuộc sống của bạn</h2>
                    <button className={style.goPT} ><a href="/PT/">Tìm kiếm HLV</a></button>
                </div>
            </div>


            <div className={style['container-item-2']}>
                    <h4>3 Năm xây dựng thương hiệu</h4>
                    <h4>Đội ngũ PT có kinh nghiệm cao</h4>
                    <h4>Đã có hơn 10 nghìn người tham gia</h4>
            </div>


            <div className={style['container-item-3']}>
                <h1>Hãy bắt đầu hành trình để có một cơ thể khỏe mạnh hơn ngay từ bây giờ</h1>
                <div className={style['wrap-trip']}>
                    <div className={style.trip}>
                        <img src="https://i.imgur.com/csieszj.jpg" alt="nothing" width="50%" height="80%"/>
                        <div className={style['wrap-content']}>
                            <h2 style={{fontSize: '24px'}}>Học cách sống khỏe mạnh nhờ tập thể dục</h2>
                            <p>Tập thể dục là cách hiệu quả nhất để duy trì sức khỏe và tăng cường tinh thần. Điều này không chỉ giúp cải thiện sức khỏe tim mạch và kiểm soát cân nặng mà còn giảm căng thẳng và tăng cường sự tự tin.</p>
                        </div>
                    </div>
                    <div className={style.trip}>
                        <img src="https://i.imgur.com/sxGxaJO.jpg" alt="nothing" width="50%" height="80%"/>
                        <div className={style['wrap-content']}>
                            <h2>Thực hiện bài tập đúng cách</h2>
                            <p>Thực hiện bài tập đúng cách là chìa khóa để đạt được kết quả tốt nhất và tránh nguy cơ chấn thương. Điều này bao gồm việc tuân thủ kỹ thuật đúng, không ép bản thân quá sức, và luôn tập trung vào cảm giác của cơ thể trong quá trình tập luyện.</p>
                        </div>
                    </div>
                    <div className={style.trip}>
                        <img src="https://i.imgur.com/lthlcti.jpg" alt="nothing" width="50%" height="80%"/>
                        <div className={style['wrap-content']}>
                            <h2>Theo dõi quá trình của bạn hàng tuần</h2>
                            <p>Theo dõi quá trình hàng tuần không chỉ giúp bạn tự đánh giá tiến độ và nhận biết những cải thiện nhỏ, mà còn là cách hiệu quả để điều chỉnh kế hoạch tập luyện linh hoạt, từ đó thúc đẩy sự tiến bộ và động viên bạn tiếp tục phấn đấu.</p>
                        </div>
                    </div>
                    <div className={style.trip}>
                        <img src="https://i.imgur.com/zcjP5ZT.jpg" alt="nothing" width="50%" height="80%"/>
                        <div className={style['wrap-content']}>
                            <h2>Thực hiện theo một kế hoạch cụ thể</h2>
                            <p>Thực hiện theo một kế hoạch cụ thể giúp bạn tổ chức thời gian và năng lượng một cách hiệu quả, tăng khả năng hoàn thành mục tiêu và duy trì động lực trong quá trình tập luyện.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className={style['container-item-4']}>
                    <h1>Huấn luyện viên nổi bậc</h1>
                    <div className={style['wrap-pt']}>
                    {
                        pts && pts.map((value , index)=>(
                            <div className={style['list-item']} key={index}>
                                <img src={value.avt} alt="nothing" width="100%" />
                                <Link to={`/PTInfo/${value.IDKhachHang}`}>
                                    <div className={style['wrap-content']}>
                                        <h2>{value.HoTen} </h2>
                                        <h3>Chứng chỉ: {value.ChungChi}</h3>
                                        <h3>{value.GiaThue.toLocaleString('vi', {style : 'currency', currency : 'VND'})} / giờ</h3>
                                        <Link to={`/PTInfo/${value.IDKhachHang}`}>Đăng ký ngay</Link>
                                    </div>
                                </Link>
                        </div>
                        ))
                    }
                    </div>
                    <a href="/PT">Xem thêm</a>
                </div>

                <div className={style['container-item-5']}>
                    <h1>Các sản phẩm hỗ trợ luyện tập</h1>
                    <div className={style['wrap-pt']}>
                        {
                            products && products.map((value , index)=>(
                                <div className={style['list-item']} key={index}>
                                <img src={value.IMG} alt="nothing" width="100%" />
                                <Link to={`/ProductInfo/${value.IDSanPham}`}>
                                    <div className={style['wrap-content']}>
                                        <h2>{value.TenSP}</h2>
                                        <h3>{value.DonGia.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</h3>
                                        <Link to={`/ProductInfo/${value.IDSanPham}`}>Đăng ký ngay</Link>
                                    </div>
                                </Link>
                            </div>
                            ))
                        }
                    </div>
                    <a href="/shop">Xem thêm</a>
            </div>
        </main>
    );
    };

export default HomeContent;