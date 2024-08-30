import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography, Stack } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'src/components/ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'src/assets/social-google.svg';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios

const AuthLogin = ({ onSubmit, ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleFormSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Replace with your login API endpoint
      const response = await axios.post('http://localhost:8080/Backend/login/', {
        username: values.username,
        password: values.password,
      });

      const { role } = response.data; // Assuming response contains user role

      // Determine the redirect path based on the user role
      if (role === 'admin') {
        navigate('/admin'); // Redirect to admin route
      } else if (role === 'employee') {
        navigate('/employee'); // Redirect to employee route
      } else {
        navigate('/Order'); // Redirect to default private route
      }
    } catch (error) {
      setErrors({ submit: 'Đăng nhập không thành công.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
        <form noValidate onSubmit={handleSubmit} {...others}>
          <Grid container direction="column" justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  fullWidth
                  onClick={() => console.error('Login')}
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
            <FormControl fullWidth error={Boolean(touched.username && errors.username)} sx={{ ...theme.typography.customInput, marginBottom: '25px' }}>
              <InputLabel htmlFor="outlined-adornment-username-login">Tên đăng nhập</InputLabel>
              <OutlinedInput
                id="outlined-adornment-username-login"
                type="text"
                value={values.username}
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Tên đăng nhập"
              />
              {touched.username && errors.username && (
                <FormHelperText error id="standard-weight-helper-text-username-login">
                  {errors.username}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Mật khẩu</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Mật khẩu"
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
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
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
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
        </form>
      )}
    </Formik>
  );
};

export default AuthLogin;
