import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";

function HomeContent() {
  const [pts, setPts] = useState([]);
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // if (user && user.IDVaiTro === 2) {
    //   window.location.href = "http://localhost:3000/employee";
    // }
    // if (user && user.IDVaiTro === 1) {
    //   window.location.href = "http://localhost:3000/admin";
    // }
    axios
      .get("http://localhost:8080/Backend/HomeContent")
      .then((response) => {
        setPts(response.data[0]);
        setProducts(response.data[1]);
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
  }, [user]);

  return (
    <main id={style.container}>
      <div className={style["container-item-1"]}>
        <div className={style["left-item"]}>
          <img
            src="https://i.imgur.com/iYwRZz1.jpg"
            alt="nothing"
            width="100%"
          />
        </div>
        <div className={style["right-item"]}>
          <h1>Chào mừng bạn đến GOAT GYM</h1>
          <h2>
            Chúng tôi có đội ngũ huấn luyện viên được đào tạo chuyên nghiệp. Hãy
            để chúng tôi thay đổi cuộc sống của bạn
          </h2>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#081158",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              marginTop: "20px",
              "&:hover": {
                backgroundColor: "#1974D3",
              },
            }}
            component={Link}
            to="/PT/"
          >
            Tìm kiếm HLV
          </Button>
        </div>
      </div>

      <div className={style["container-item-2"]}>
        <h4>3 Năm xây dựng thương hiệu</h4>
        <h4>Đội ngũ PT có kinh nghiệm cao</h4>
        <h4>Đã có hơn 10 nghìn người tham gia</h4>
      </div>

      <div className={style["container-item-3"]}>
        <h1>
          Hãy bắt đầu hành trình để có một cơ thể khỏe mạnh hơn ngay từ bây giờ
        </h1>
        <div className={style["wrap-trip"]}>
          <div className={style.trip}>
            <img
              src="https://i.imgur.com/csieszj.jpg"
              alt="nothing"
              width="50%"
              height="80%"
            />
            <div className={style["wrap-content"]}>
              <h2 style={{ fontSize: "20px" }}>
                Học cách sống khỏe mạnh nhờ tập thể dục
              </h2>
              <p style={{ fontSize: "16px" }}>
                Tập thể dục là phương pháp hiệu quả để duy trì sức khỏe toàn
                diện và cải thiện tinh thần. Nó không chỉ giúp tăng cường sức
                khỏe tim mạch, kiểm soát cân nặng mà còn giảm căng thẳng, nâng
                cao sự tự tin. Với một lối sống năng động và thói quen tập luyện
                đều đặn, bạn sẽ cảm nhận được những thay đổi tích cực cả về thể
                chất lẫn tinh thần.
              </p>
            </div>
          </div>
          <div className={style.trip}>
            <img
              src="https://i.imgur.com/sxGxaJO.jpg"
              alt="nothing"
              width="50%"
              height="80%"
            />
            <div className={style["wrap-content"]}>
              <h2 style={{ fontSize: "20px" }}>Thực hiện bài tập đúng cách</h2>
              <p style={{ fontSize: "16px" }}>
                Để đạt được hiệu quả tốt nhất và tránh chấn thương, việc thực
                hiện đúng kỹ thuật trong quá trình tập luyện là rất quan trọng.
                Bạn cần tuân thủ hướng dẫn, không ép bản thân tập quá sức và
                luôn lắng nghe cơ thể mình. Điều này không chỉ giúp tối ưu hóa
                kết quả mà còn bảo vệ bạn khỏi những rủi ro không mong muốn
                trong quá trình tập luyện.
              </p>
            </div>
          </div>
          <div className={style.trip}>
            <img
              src="https://i.imgur.com/lthlcti.jpg"
              alt="nothing"
              width="50%"
              height="80%"
            />
            <div className={style["wrap-content"]}>
              <h2 style={{ fontSize: "20px" }}>
                Theo dõi quá trình của bạn hàng tuần
              </h2>
              <p style={{ fontSize: "16px" }}>
                Việc theo dõi tiến trình hàng tuần giúp bạn đánh giá được sự
                thay đổi và cải thiện của bản thân. Đồng thời, điều này cũng tạo
                điều kiện để bạn điều chỉnh kế hoạch tập luyện khi cần thiết.
                Nhờ đó, bạn sẽ luôn có động lực phấn đấu, tiếp tục cải thiện và
                tiến bộ trong hành trình rèn luyện sức khỏe của mình.
              </p>
            </div>
          </div>
          <div className={style.trip}>
            <img
              src="https://i.imgur.com/zcjP5ZT.jpg"
              alt="nothing"
              width="50%"
              height="80%"
            />
            <div className={style["wrap-content"]}>
              <h2 style={{ fontSize: "20px" }}>
                Thực hiện theo một kế hoạch cụ thể
              </h2>
              <p style={{ fontSize: "16px" }}>
                Thực hiện theo kế hoạch tập luyện rõ ràng giúp bạn tối ưu hóa
                thời gian và năng lượng, tăng khả năng đạt được mục tiêu đề ra.
                Việc có một lộ trình cụ thể không chỉ giúp bạn duy trì động lực
                mà còn hỗ trợ quản lý tốt việc tập luyện, đảm bảo tính liên tục
                và đạt được kết quả lâu dài.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={style["container-item-4"]}>
        <h1>Huấn luyện viên nổi bật</h1>
        {/* <div className={style["wrap-pt"]}>
    {pts &&
      pts.map((value, index) => (
        <div className={style["list-item"]} key={index}>
          <img src={value.avt} alt="nothing" width="100%" />
          <Link to={`/PTInfo/${value.IDKhachHang}`}>
            <div className={style["wrap-content"]}>
              <h2>{value.HoTen} </h2>
              <h3>Chứng chỉ: {value.ChungChi}</h3>
              <h3>
                Đơn giá:{" "}
                <span className={style.price}>
                  {value.GiaThue.toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace('₫', '')}
                  <span className={style.currency}>VNĐ</span>
                </span>{" "}
                / giờ
              </h3>
              <Button
                variant="contained"
                sx={{ 
                  backgroundColor: '#ffd000', 
                  color: '#fff', 
                  padding: '8px 16px', // Padding điều chỉnh theo nhu cầu
                  borderRadius: '8px', 
                  marginTop: '15px',
                  marginLeft:'25%',
                  marginBottom: '10px',
                  '&:hover': { 
                    backgroundColor: '#1974D3'
                  }
                }}
                component={Link}
                to={`/PTInfo/${value.IDKhachHang}`}
              >
                Đăng ký ngay
              </Button>
            </div>
          </Link>
        </div>
      ))}
  </div> */}
        <div className={style["wrap-pt"]}>
          {Array.isArray(pts) &&
            pts.map((value, index) => (
              <div className={style["list-item"]} key={index}>
                <img src={value.avt} alt="nothing" width="100%" />
                <Link to={`/PTInfo/${value.IDHLV}`}>
                  <div className={style["wrap-content"]}>
                    <h2>{value.HoTen} </h2>
                    <h3>Chứng chỉ: {value.ChungChi}</h3>
                    <h3>
                      Đơn giá:{" "}
                      <span className={style.price}>
                        {value.GiaThue.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).replace("₫", "")}
                        <span className={style.currency}>VNĐ</span>
                      </span>{" "}
                      / giờ
                    </h3>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#ffd000",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        marginTop: "15px",
                        marginLeft: "25%",
                        marginBottom: "10px",
                        "&:hover": {
                          backgroundColor: "#1974D3",
                        },
                      }}
                      component={Link}
                      to={`/PTInfo/${value.IDHLV}`}
                    >
                      Đăng ký ngay
                    </Button>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>

      <div className={style["container-item-5"]}>
        <h1>Các sản phẩm hỗ trợ luyện tập</h1>
        <div className={style["wrap-pt"]}>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((value, index) => (
              <div className={style["list-item"]} key={index}>
                <img src={value.IMG} alt="nothing" width="100%" />
                <Link to={`/ProductInfo/${value.IDSanPham}`}>
                  <div className={style["wrap-content"]}>
                    <h2>{value.TenSP}</h2>
                    <p>
                      Đơn giá:
                      <span className={style.price}>
                        {value.DonGia.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).replace("₫", "")}
                        <span className={style.currency}>VNĐ</span>
                      </span>
                    </p>
                    <div className={style["button-container"]}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#ffd000",
                          color: "#fff",
                          padding: "5px 16px",
                          borderRadius: "8px",
                          "&:hover": {
                            backgroundColor: "#1974D3",
                          },
                        }}
                        component={Link}
                        to={`/ProductInfo/${value.IDSanPham}`}
                      >
                        Mua ngay
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào để hiển thị.</p>
          )}
        </div>
        <div className={style["button-container"]}>
          <Link to="/shop" className={style["view-more"]}>
            Xem thêm
          </Link>
        </div>
        {/* <a href="/shop">Xem thêm</a> */}
      </div>
    </main>
  );
}

export default HomeContent;
