import React, { createContext, useContext, useState } from "react";

const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [warning, setWarning] = useState(null);
    const [message, setMessage] = useState('');
    const [location , setLocation] = useState(null);
    const [link, setLink] = useState('');

    return (
        <AnnouncementContext.Provider value={{ error, setError, success, setSuccess, message, setMessage , warning, setWarning , location , setLocation , link , setLink}}>
            {children}
        </AnnouncementContext.Provider>
    );
};

export const useAnnouncement = () => useContext(AnnouncementContext);
