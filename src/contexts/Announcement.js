import React, { createContext, useContext, useState } from "react";

const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [message, setMessage] = useState('');

    return (
        <AnnouncementContext.Provider value={{ error, setError, success, setSuccess, message, setMessage }}>
            {children}
        </AnnouncementContext.Provider>
    );
};

export const useAnnouncement = () => useContext(AnnouncementContext);
