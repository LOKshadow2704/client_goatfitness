import React, { createContext, useContext, useState, useEffect } from "react";
import Alert from '@mui/material/Alert';

const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        if (error || success) {
            setAlertVisible(true);
            const timer = setTimeout(() => {
                setError(false);
                setSuccess(false);
                setAlertVisible(false);
            }, 3000); // Alert will disappear after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <AnnouncementContext.Provider value={{ setError, setSuccess, setMessage }}>
            {children}
            {alertVisible && (
                <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
                    {error && (
                        <Alert severity="error" sx={{ width: '300px', height: '40px' }}>
                            {message}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ width: '300px', height: '40px' }}>
                            {message}
                        </Alert>
                    )}
                </div>
            )}
        </AnnouncementContext.Provider>
    );
};

export const useAnnouncement = () => useContext(AnnouncementContext);
