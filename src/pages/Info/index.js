import React from "react";
import style from './style.module.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function Info () {
    return (
        <div>
        <Header/>
            <div className={style["container"]}>
                <div className={style["children_1"]}>
                    <div className={style["left-content"]}>
                        <h1 >Chào bạn, chúng tôi là GOAT Gym</h1>
                        <h2>Bạn cần cải thiện sức khỏe và thể hình?</h2>
                        <p>Sức khỏe là cơ sở của mọi hoạt động trong cuộc sống. Nó là chìa khóa để đạt được hạnh phúc và thành công trong mọi mục tiêu.</p>
                    </div>
                    <div className={style["right-content"]}>
                        <img src="https://i.imgur.com/p4esW3s.jpg" width="100%" alt="not connected" />
                    </div>
                </div>

                <div className={style["children_2"]}>
                <h1 >Tập luyện ở nhà là chưa đủ</h1>
                        <p>Ở GOAT Gym bạn sẽ có đủ những công cụ hỗ trợ để việc tập luyện trở nên hiệu quả hơn</p>
                        <div className={style["img"]}><img src="https://i.imgur.com/ZJrWOuY.jpeg" width="70%"alt="not connected"/></div>
                </div>

                <div className={style["children_3"]}>
                        <h1 >Nhiều bộ môn được hỗ trợ</h1>
                        <div className={style["wrap-item"]}>
                            <div className={style["item"]}>
                                <h1>Fitness</h1>
                                <img src="https://i.imgur.com/Yh9YN2A.jpeg" width="80%" alt="not connected"/>
                            </div>
                            <div className={style["item"]}>
                                <h1>Yoga</h1>
                                <img src="https://i.imgur.com/Fg2Jm6h.jpeg" width="80%" alt="not connected" />
                            </div>
                            <div className={style["item"]}>
                                <h1>Boxing</h1>
                                <img src="https://i.imgur.com/ck556e8.jpg" width="80%" alt="not connected" />
                            </div>
                            
                        </div>
                </div>

                <div className={style["children_4"]}>
                    <h1>Đội ngũ HLV được chọn lọc nghiêm ngặc và chuyên nghiệp</h1>
                    <div className={style["slide"]}>
                        <p>Slide</p>
                    </div>
                </div>

                <div className={style["children_5"]}>
                    <h1>Cam kết của chúng tôi</h1>
                    <p>Chúng tôi cam kết luôn đặt lợi ích và sức khỏe của khách hàng lên hàng đầu. Chất lượng dịch vụ và sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi. Hãy để GOAT GYM trở thành điểm đến tin cậy cho hành trình sức khỏe và thể chất của bạn.</p>
                </div>

                
            </div>
        <Footer />
    </div>
    );
};

export default Info;