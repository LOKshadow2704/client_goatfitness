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
                        <img src="https://i.imgur.com/VZFGZRM.png" width="450px" height="500px" alt="not connected" />
                    </div>
                </div>
                <div className={style["border"]}></div>
                <br />
                <div className={style["children_2"]}>
                    <div className={style["left-content"]}>
                        <h2>Bạn có cảm thấy mình cần cải thiện sức khỏe và thể hình?</h2>
                        <p>Sức khỏe là nền tảng quan trọng cho mọi hoạt động và là nguồn năng lượng để chúng ta sống trọn vẹn mỗi ngày. Khi có sức khỏe tốt, bạn không chỉ cảm thấy tự tin hơn, mà còn sẵn sàng đối mặt với những thách thức trong công việc và cuộc sống. Hơn thế nữa, sức khỏe không chỉ là mục tiêu cá nhân mà còn là một yếu tố thiết yếu giúp bạn duy trì các mối quan hệ, đóng góp cho gia đình, và phát triển sự nghiệp. Thể hình khỏe mạnh không chỉ mang lại sự cân đối về hình thể mà còn giúp cải thiện sức bền, tăng cường hệ miễn dịch và giảm nguy cơ mắc các bệnh mãn tính. Chính vì vậy, việc chăm sóc sức khỏe và duy trì một thói quen tập luyện thể chất đều đặn là cách tốt nhất để bạn có thể đạt được sự cân bằng cuộc sống.</p>
                    </div>
                    {/* Đường viền phân cách giữa left-content và right-content */}
                    <div className={style["right-content-1"]}>
                        <h2>Bạn có cảm thấy rằng tập luyện ở nhà không đủ hiệu quả?</h2>
                        <p>Tập luyện ở nhà có thể là một bước khởi đầu tốt, nhưng thường chưa đủ để đạt được kết quả tối ưu mà bạn mong muốn. Để phát triển toàn diện và hiệu quả hơn, bạn cần những công cụ và thiết bị chuyên nghiệp cùng một môi trường tập luyện đúng chuẩn. Tại GOAT Gym, chúng tôi cung cấp đầy đủ các thiết bị hiện đại và tiện ích hỗ trợ cho việc tập luyện của bạn. Không chỉ dừng lại ở đó, chúng tôi còn có đội ngũ huấn luyện viên giàu kinh nghiệm, luôn sẵn sàng hướng dẫn và đồng hành cùng bạn để bạn có thể đạt được mục tiêu về sức khỏe và thể hình nhanh chóng hơn. Hãy để GOAT Gym trở thành nơi bạn phát huy hết tiềm năng của mình với một hệ thống hỗ trợ bài bản, giúp việc tập luyện trở nên hiệu quả và thú vị hơn bao giờ hết.</p>
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
                            <img className={style["rounded-image"]} src="https://i.imgur.com/iy2Dz3G.png" width="85%" alt="not connected" />
                        </div>
                        <div className={style["item"]}>
                            <h1 className={style["text-size"]}>Yoga</h1>
                            <img className={style["rounded-image"]} src="https://i.imgur.com/ac74NtE.png" width="85%" alt="not connected" />
                        </div>
                        <div className={style["item"]}>
                            <h1 className={style["text-size"]}>Boxing</h1>
                            <img className={style["rounded-image"]} src="https://i.imgur.com/RSW4MzG.png" width="80%" alt="not connected" />
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
                <br/><br/>
                <div className={style["children_5"]}>
                    <h1 className={style["gradientText1"]}>Cam kết của chúng tôi</h1>
                    <p className={style["text-fix"]}>Tại GOAT GYM, chúng tôi đặt sự chăm sóc và lợi ích của khách hàng lên hàng đầu, xem đó là trách nhiệm và sứ mệnh của mình. Chúng tôi cam kết mang đến cho bạn một môi trường tập luyện không chỉ hiện đại và tiện nghi mà còn đầy sự hỗ trợ và khích lệ. Chất lượng dịch vụ của chúng tôi được xây dựng dựa trên tiêu chuẩn cao nhất, với đội ngũ huấn luyện viên chuyên nghiệp, giàu kinh nghiệm và tận tâm. Chúng tôi hiểu rằng sự hài lòng của bạn không chỉ đến từ các thiết bị và dịch vụ mà còn từ sự quan tâm chân thành và cá nhân hóa mà chúng tôi dành cho từng khách hàng. Hãy để GOAT GYM trở thành người bạn đồng hành đáng tin cậy trong hành trình nâng cao sức khỏe và thể chất của bạn. Chúng tôi luôn sẵn sàng lắng nghe, hỗ trợ và đồng hành cùng bạn để giúp bạn đạt được những mục tiêu sức khỏe và thể chất mà bạn đề ra. Với sự cam kết và nỗ lực không ngừng, chúng tôi hy vọng sẽ trở thành điểm đến yêu thích của bạn trong hành trình chăm sóc sức khỏe và phát triển thể chất.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Info;
