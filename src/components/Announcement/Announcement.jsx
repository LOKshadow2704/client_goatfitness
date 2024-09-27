import React, { useCallback, useEffect } from "react";
import { useAnnouncement } from "../../contexts/Announcement";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function Announcement() {
    const { error, success, warning, message, setError, setSuccess, setWarning, location, setLocation, link, setLink } = useAnnouncement();

    const handleReset = useCallback(() => {
        setError(false);
        setSuccess(false);
        setWarning(false);
    }, [setError, setSuccess, setWarning]);

    useEffect(() => {
        if (error || success || warning) {
            const timeout = setTimeout(() => {
                handleReset();
                if (location && link) {
                    const newLink = link;
                    setLocation(null);
                    setLink('');
                    window.location.href = newLink;
                }
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [error, success, warning, handleReset, link, location, setLink, setLocation]);

    return (
        <Stack
            sx={{ position: 'fixed', top: 100, right: 0, width: 350, zIndex: 9999999 }}
            spacing={2}
        >
            {error &&                 
                <Alert severity="error" sx={{ mb: 1 }}>
                    Không thành công: {message}
                </Alert>
            }
            
            {success && 
                <Alert severity="success" sx={{ mb: 1 }}>
                    Thành công: {message}
                </Alert>
            }

            {warning && 
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Cảnh báo: {message}
                </Alert>
            }
        </Stack>
    );
}

export default Announcement;
