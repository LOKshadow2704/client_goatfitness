import React, { useState } from 'react';
import { InputLabel, OutlinedInput, FormHelperText, Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Grid, IconButton, InputAdornment, Typography, Stack, Divider } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'src/components/ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'src/assets/social-google.svg'; // Import Google icon
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAnnouncement } from '../../contexts/Announcement';
import Announcement from '../../components/Announcement';

const AuthLogin = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const { login } = useAuth();
  const { setError, setMessage, setSuccess } = useAnnouncement();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleFormSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await login({ username: values.username, password: values.password });
      
      if (result.success) {
        setSuccess(true);
        setMessage("Đăng nhập thành công");
        if (result.role === 'admin') {
          navigate('/admin');
        } else if (result.role === 'employee') {
          navigate('/employee');
        } else {
          navigate('/');
        }
      } else {
        setError(true);
        setMessage(result.message || 'Sai tên đăng nhập hoặc mật khẩu');
        setErrors({ submit: 'Sai tên đăng nhập hoặc mật khẩu.' });
      }
    } catch (error) {
      setError(true);
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Announcement />

      <Formik
        initialValues={{
          username: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Tên đăng nhập là bắt buộc'),
          password: Yup.string().max(255).required('Mật khẩu là bắt buộc')
        })}
        onSubmit={handleFormSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container direction="column" justifyContent="center" spacing={2}>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    fullWidth
                    onClick={() => console.error('Login with Google')}
                    size="large"
                    variant="outlined"
                    sx={{ color: 'grey.700', backgroundColor: theme.palette.grey[50], borderColor: theme.palette.grey[100] }}
                  >
                    <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                      <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                    </Box>
                    Đăng nhập bằng Google
                  </Button>
                </AnimateButton>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ alignItems: 'center', display: 'flex' }}>
                  <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                  <Button
                    variant="outlined"
                    sx={{
                      cursor: 'unset',
                      m: 2,
                      py: 0.5,
                      px: 7,
                      borderColor: `${theme.palette.grey[100]} !important`,
                      color: `${theme.palette.grey[900]}!important`,
                      fontWeight: 500,
                      borderRadius: `${theme.shape.borderRadius}px`
                    }}
                    disableRipple
                    disabled
                  >
                    Hoặc
                  </Button>
                  <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="username-login">Tên đăng nhập</InputLabel>
                  <OutlinedInput
                    id="username-login"
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                  {touched.username && errors.username && (
                    <FormHelperText error>{errors.username}</FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Mật khẩu</InputLabel>
                  <OutlinedInput
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error>{errors.password}</FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                    }
                    label="Ghi nhớ đăng nhập"
                  />
                  <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                    Quên mật khẩu?
                  </Typography>
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      fullWidth
                      type="submit"
                      size="large"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Đăng nhập
                    </Button>
                  </AnimateButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
