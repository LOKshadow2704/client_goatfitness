
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Cart from '../../components/Cart/Cart'; 
import Header from '../../components/Header/Header'; 
import Footer from '../../components/Footer/Footer'; 
import { Container, Typography, Paper, Button } from '@mui/material'; 
import { Link } from 'react-router-dom'; 
import style from './style.module.css'; 

function CartPage() {
    const { isLogin } = useAuth();

    return (
        <div className={style.pageContainer}>
            <Header /> 
            <Container className={style.content} maxWidth="lg">
                {!isLogin ? (
                    <Paper elevation={3} className={style.loginReminder}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Vui lòng đăng nhập để xem giỏ hàng.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/login"
                            fullWidth
                        >
                            Đăng nhập
                        </Button>
                    </Paper>
                ) : (
                    <div>
                        <Typography variant="h5" gutterBottom  marginTop="10%">
                          GOAT FITNESS |  Giỏ Hàng
                        </Typography>
                        <Cart />
                        <div className={style.cartActions}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="large"
                                component={Link}
                                to="/shop"
                                className={style.continueShoppingButton}
                            >
                                Tiếp tục mua sắm
                            </Button>
                        </div>
                    </div>
                )}
            </Container>
            <Footer /> 
        </div>
    );
}
export default CartPage;
