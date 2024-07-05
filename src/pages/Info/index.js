import React from "react";
import style from './style.module.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SlideShow from "../../components/SlideShow/SlideShow"; 


function Info() {
    return (
        <div>
            <Header />
            <div className={style["container"]}>
                {/* <h1 className={style["gradientText"]}>Về chúng tôi</h1> */}
                <div className={style["children_1"]}>
                    <div className={style["left-content"]}>
                        <h1 style={{ marginTop: '15px' ,color:'#081158'}}>Chào bạn, chúng tôi là <span className={style["gradientText1"]}>GOAT FITNESS</span></h1>
                        <p style={{ textAlign: 'justify', lineHeight: '1.5', marginLeft: '35px', fontSize: '18px', height: '100%' ,color:'#081158'}} className={style["plus-jakarta-sans"]}>
                        GOAT FITNESS, viết tắt của "Greatest of All Time Fitness," là điểm đến lý tưởng cho những ai muốn nâng cao sức khỏe và thể hình. Với trang thiết bị hiện đại và đội ngũ huấn luyện viên giàu kinh nghiệm, 
                        chúng tôi cam kết mang đến môi trường tập luyện chuyên nghiệp và hiệu quả. Cho dù mục tiêu của bạn là thể hình, giảm cân, hay cải thiện sức khỏe tinh thần qua yoga và boxing, GOAT FITNESS có các chương 
                        trình phù hợp. Chúng tôi luôn đặt sự hài lòng và sức khỏe của bạn lên hàng đầu, đồng hành cùng bạn trên con đường chinh phục sức khỏe toàn diện.
                        </p>
                    </div>
                    <div className={style["right-content"]}>
                        <img src="https://i.imgur.com/HMCjpoa.png" width="500px" alt="not connected" />
                    </div>
                </div>
                <div className={style["border"]}></div>
                <br />
                <div className={style["children_2"]}>
                    <div className={style["left-content"]}>
                        <h2>Bạn cần cải thiện sức khỏe và thể hình?</h2>
                        <p>Sức khỏe là cơ sở của mọi hoạt động trong cuộc sống. Nó là chìa khóa để đạt được hạnh phúc và thành công trong mọi mục tiêu.</p>
                    </div>
                    {/* Đường viền phân cách giữa left-content và right-content */}
                    <div className={style["right-content"]}>
                        <h1>Tập luyện ở nhà là chưa đủ</h1>
                        <p>Ở GOAT Gym bạn sẽ có đủ những công cụ hỗ trợ để việc tập luyện trở nên hiệu quả hơn</p>
                        {/* <div className={style["img"]}><img src="https://i.imgur.com/ZJrWOuY.jpeg" width="70%" alt="not connected" /></div> */}
                    </div>
                </div>
                <br />
                <div className={style["border"]}></div>
                <div className={style["children_3"]}>
                    <h1 className={style["gradientText1"]}>Nhiều bộ môn được hỗ trợ</h1>
                    <br />
                    <div className={style["wrap-item"]}>
                        <div className={style["item"]}>
                            <h1 className={style["text-size"]}>Fitness</h1>
                            <img className={style["rounded-image"]} src="https://i.imgur.com/Yh9YN2A.jpeg" width="85%" alt="not connected" />
                        </div>
                        <div className={style["item"]}>
                            <h1 className={style["text-size"]}>Yoga</h1>
                            <img className={style["rounded-image"]} src="https://i.imgur.com/Fg2Jm6h.jpeg" width="85%" alt="not connected" />
                        </div>
                        <div className={style["item"]}>
                            <h1 className={style["text-size"]}>Boxing</h1>
                            <img className={style["rounded-image"]} src="https://i.imgur.com/ck556e8.jpg" width="80%" alt="not connected" />
                        </div>
                    </div>
                </div>
                <br/>
                <div className={style["border"]}></div>
                <br/>
                <div className={style["children_4"]}>
                    <h1 className={style["gradientText1"]} >Đội ngũ huấn luyện viên được tuyển chọn kỹ lưỡng và đào tạo chuyên nghiệp</h1>
                    <br />
                    <div className={style["slide"]}>
                    <SlideShow />
                    </div>
                </div>
                
                <br />
                <div className={style["children_5"]}>
                    <h1 className={style["gradientText1"]}>Cam kết của chúng tôi</h1>
                    <p className={style["text-fix"]}>Chúng tôi cam kết luôn đặt lợi ích và sức khỏe của khách hàng lên hàng đầu. Chất lượng dịch vụ và sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi. Hãy để GOAT GYM trở thành điểm đến tin cậy cho hành trình sức khỏe và thể chất của bạn.<b>Cần viết lại cam kết</b></p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Info;
