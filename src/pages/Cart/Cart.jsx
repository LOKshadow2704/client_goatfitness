// src/pages/CartPage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Cart from '../../components/Cart/Cart'; // Import component giỏ hàng
import Header from '../../components/Header/Header'; // Import component header
import Footer from '../../components/Footer/Footer'; // Import component footer
import { Container, Typography, Paper, Button } from '@mui/material'; // Import các component MUI
import { Link } from 'react-router-dom'; // Sử dụng Link để điều hướng nếu cần
import style from './style.module.css'; // Import các style nếu cần

function CartPage() {
    const { isLogin } = useAuth();

    return (
        <div className={style.pageContainer}>
            <Header /> {/* Thêm header */}

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
                        <Cart /> {/* Hiển thị nội dung giỏ hàng */}
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

            <Footer /> {/* Thêm footer */}
        </div>
    );
}

export default CartPage;
