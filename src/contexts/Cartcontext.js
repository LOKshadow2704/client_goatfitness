import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        // Fetch giỏ hàng từ server
        const fetchCart = async () => {
            const jwt = document.cookie.split(';').find(row => row.includes('jwt'))?.split('=')[1];
            const response = await fetch('http://localhost:8080/Backend/cart', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCartData(data);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        // Tính tổng số lượng sản phẩm
        const total = cartData.reduce((sum, item) => sum + item.SoLuong, 0);
        setTotalItems(total);
    }, [cartData]);

    return (
        <CartContext.Provider value={{ cartData, totalItems, setCartData }}>
            {children}
        </CartContext.Provider>
    );
};
