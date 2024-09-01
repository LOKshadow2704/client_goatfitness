import { Link } from 'react-router-dom';

// material-ui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from './AuthLogin';
import Logo from './Logo';
import { useAuth } from "src/contexts/AuthContext";
import { useState } from 'react';
import { useAnnouncement } from 'src/contexts/Announcement';


// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const { isLogin, login, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setError ,setMessage ,setSuccess } = useAnnouncement();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn gửi dữ liệu mặc định, hạn chế gửi yêu cầu không cần thiết
    const result = await login({ username, password });
    console.log(result)
    if (result.success) {
      setSuccess(true);
      setMessage("Đăng nhập thành công");
    } else {
      setError(true);
      setMessage(result.message);
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
                    <Link to="/" aria-label="logo">
                      <Logo />
                    </Link>
                  </Grid>

                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography component={Link} to="/pages/register/register3" variant="subtitle1" sx={{ textDecoration: 'none' }}>
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
