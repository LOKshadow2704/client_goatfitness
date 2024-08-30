import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm Link vào import
import { useAuth } from 'src/contexts/AuthContext';
import { useAnnouncement } from 'src/contexts/Announcement';
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from './AuthLogin';
import Logo from './Logo';
import { Grid, Divider, Typography } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate(); // Thay thế useHistory bằng useNavigate
  const { login } = useAuth();
  const { setError, setMessage, setSuccess } = useAnnouncement();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Thực hiện đăng nhập
      const response = await axios.post('http://localhost:8080/Backend/login/', {
        email: values.email,
        password: values.password,
      });

      // Xử lý phản hồi từ server
      if (response.data.success) {
        // Chuyển hướng đến trang khác sau khi đăng nhập thành công
        navigate('/dashboard'); // Thay đổi đường dẫn theo yêu cầu
      } else {
        // Hiển thị thông báo lỗi nếu đăng nhập không thành công
        setErrors({ submit: response.data.message });
      }
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      setErrors({ submit: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Logo />
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin onSubmit={handleSubmit} />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography component={Link} to="/Signup" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                        Bạn chưa có tài khoản?
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
