import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token') || false);
    const [userData, setUserData] = useState(false);
    const [approvedItems, setApprovedItems] = useState([]);
    const [wishlistData, setWishlistData] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadUserData = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get(`${backendUrl}/api/users/user-data`, { headers: { token } });
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const loadApprovedItems = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/items/approved-items`);
            if (data.success) {
                // This function loads the "most viewed" or default items
                setApprovedItems(data.recentItems);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // New function to load personalized items for the "For You" feed
    const loadPersonalizedItems = async () => {
        if (!token) {
            toast.error("You must be logged in to see personalized recommendations.");
            return;
        }
        try {
            const { data } = await axios.get(`${backendUrl}/api/items/personalized-items`, {
                headers: { token }
            });

            if (data.success) {
                // It updates the same 'approvedItems' state, which the ShowItems component uses
                setApprovedItems(data.items);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const toggleAvailability = async (itemId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/items/toggle-availability`, { itemId }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                // You might want to reload the relevant item list here
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getItemInWishlist = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get(`${backendUrl}/api/users/get-wishlist`, { headers: { token } });
            if (data.success) {
                setWishlistData(data.itemData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const addItemInWishlist = async (itemId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/users/add-wishlist`, { itemId }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                await getItemInWishlist();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const removeItemWishlist = async (itemId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/users/remove-wishlist`, { itemId }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                await getItemInWishlist();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            loadUserData();
            getItemInWishlist();
        } else {
            setUserData(false);
        }
    }, [token]);

    const value = {
        token,
        setToken,
        approvedItems,
        loadApprovedItems,
        loadPersonalizedItems, // Exporting the new function
        backendUrl,
        userData,
        setUserData,
        loadUserData,
        toggleAvailability,
        wishlistData,
        getItemInWishlist,
        addItemInWishlist,
        removeItemWishlist,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
