import React, { useState } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function ProductActions({ productId, onDelete }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { setError, setMessage, setSuccess } = useAnnouncement();

    const handleDelete = async () => {
        const isLogin = document.cookie.includes("jwt");
        if (isLogin) {
            const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            };

            axios.delete(`http://localhost:8080/Backend/product/delete/${productId}`, { headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        setSuccess(true);
                        setMessage("Xóa thành công");
                        onDelete(productId); // Callback to update the list
                        setShowConfirmDialog(false);
                    } else {
                        throw new Error("Xóa thất bại");
                    }
                })
                .catch(error => {
                    setError(true);
                    setMessage(error.response?.data?.error || 'Lỗi khi xóa sản phẩm');
                });
        }
    };

    return (
        <>
            <IconButton
                color="error"
                onClick={() => setShowConfirmDialog(true)}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </IconButton>

            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa sản phẩm này?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ProductActions;
