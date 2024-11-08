import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAnnouncement } from "../../contexts/Announcement";

function CreateUserModal({ setShowModal }) {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    re_password: "",
    email: "",
    phone: "",
    address: "",
  });

  const { setSuccess, setMessage } = useAnnouncement();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    validateField(id, value);
  };

  const validateField = (id, value) => {
    let errorMsg = "";

    switch (id) {
      case "username":
        if (!/^[a-zA-Z0-9]{10,30}$/.test(value)) {
          errorMsg =
            "Tên đăng nhập phải từ 10 đến 30 ký tự và chỉ chứa chữ cái và số.";
        }
        break;
      case "password":
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{6,18}$/.test(
            value
          )
        ) {
          errorMsg =
            "Mật khẩu phải từ 6 đến 18 ký tự, gồm chữ thường, chữ in, số và ký tự đặc biệt.";
        }
        break;
      case "re_password":
        if (value !== formData.password) {
          errorMsg = "Mật khẩu không khớp!";
        }
        break;
      case "email":
        if (!/^[\w.%+-]+@gmail\.com$/.test(value)) {
          errorMsg = "Email phải có đuôi @gmail.com.";
        }
        break;
      case "phone":
        if (!/^0\d{9}$/.test(value)) {
          errorMsg = "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0.";
        }
        break;
      case "address":
        if (value.trim() === "") {
          errorMsg = "Vui lòng nhập địa chỉ của người dùng.";
        }
        break;
      case "fullname":
        if (value.trim() === "") {
          errorMsg = "Vui lòng nhập họ và tên của người dùng.";
        }
        break;
      default:
        break;
    }

    setErrors((prevState) => ({
      ...prevState,
      [id]: errorMsg,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
  
    // Kiểm tra các trường bắt buộc
    ["fullname", "username", "password", "re_password", "email", "phone", "address"].forEach((field) => {
      const value = formData[field];
  
      // Nếu trường bị bỏ trống
      if (!value.trim()) {
        newErrors[field] = "Vui lòng điền thông tin vào trường này.";
        isValid = false;
      } else {
        validateField(field, value); // Kiểm tra từng field xem có đúng định dạng không
        if (errors[field]) {
          newErrors[field] = errors[field];
          isValid = false;
        }
      }
    });
  
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { re_password, ...formDataToSend } = formData;
  
    // Kiểm tra tính hợp lệ của form
    if (!validateForm()) {
      return;
    }
  
    try {
      // Gửi yêu cầu POST đăng ký người dùng
      const response = await axios.post('http://localhost:8080/Backend/signup', formDataToSend);
  
      if (response.status === 200) {
        setSuccess(true);
        setMessage("Đăng ký thành công");
        setShowModal(false); // Đóng modal khi đăng ký thành công
      } else {
        setErrors(true);
        console.error("Đăng ký không thành công. Mã lỗi:", response.status);
        setMessage("Đăng ký không thành công. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng ký!", error);
  
      // Kiểm tra lỗi từ server
      if (error.response?.data?.error === "Tên đăng nhập đã tồn tại") {
        setErrors((prevState) => ({
          ...prevState,
          username: "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác."
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          general: "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại."
        }));
      }
    }
  };
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed", 
        top: 0,
        left: 0,
        width: "100vw", 
        height: "100vh", 
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        zIndex: 1000, 
      }}
    >
      <Box
        component="form"
        sx={{
          backgroundColor: "#fff",
          padding: "20px",
          width: "350px", 
          borderRadius: "8px",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
          position: "relative", 
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onSubmit={handleSubmit}
      >
        <IconButton
          onClick={() => setShowModal(false)}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
        <Typography variant="h5" sx={{ marginBottom: "20px" ,textAlign:'center'}}>
          Thêm tài khoản mới
        </Typography>

        {/* Họ tên */}
        <TextField
          id="fullname"
          label="Họ và tên"
          fullWidth
          margin="normal"
          value={formData.fullname}
          onChange={handleChange}
          error={!!errors.fullname}
          helperText={errors.fullname}
        />

        {/* Tên đăng nhập */}
        <TextField
          id="username"
          label="Tên đăng nhập"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />

        {/* Mật khẩu */}
        <TextField
          id="password"
          label="Mật khẩu"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />

        {/* Nhập lại mật khẩu */}
        <TextField
          id="re_password"
          label="Nhập lại mật khẩu"
          type="password"
          fullWidth
          margin="normal"
          value={formData.re_password}
          onChange={handleChange}
          error={!!errors.re_password}
          helperText={errors.re_password}
        />

        {/* Email */}
        <TextField
          id="email"
          label="Email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Số điện thoại */}
        <TextField
          id="phone"
          label="Số điện thoại"
          fullWidth
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />

        {/* Địa chỉ */}
        <TextField
          id="address"
          label="Địa chỉ"
          fullWidth
          margin="normal"
          value={formData.address}
          onChange={handleChange}
          error={!!errors.address}
          helperText={errors.address}
        />

<Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{ mt: 2, backgroundColor: "#0070f3" }}
>
  Lưu
</Button>

      </Box>
    </Box>
  );
}

export default CreateUserModal;
