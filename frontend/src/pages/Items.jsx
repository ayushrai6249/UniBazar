import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Heart } from 'lucide-react';

const Items = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [category, setCategory] = useState(false);
    const [filterItem, setFilterItem] = useState([]);
    const [showFilter, setShowfilter] = useState(false);
    const [showAvailableOnly, setShowAvailableOnly] = useState(true);

    const {
        approvedItems,
        loadApprovedItems,
        userData,
        backendUrl,
        token,
        wishlistData,
        addItemInWishlist,
        removeItemWishlist
    } = useContext(AppContext);

    useEffect(() => {
        if (location.state?.category) {
            setCategory(location.state.category);

            // ✅ clear navigation state after consuming it
            navigate('/items', { replace: true });
        }
    }, [location.state, navigate]);

    const applyFilter = () => {
        let items = [...approvedItems];

        if (userData?._id) {
            items = items.filter(item => item.owner?._id !== userData._id);
        }

        if (category) {
            items = items.filter(item => item.category === category);
        }

        if (showAvailableOnly) {
            items = items.filter(item => item.available);
        }

        items.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilterItem(items);
    };

    useEffect(() => {
        loadApprovedItems();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [approvedItems, category, showAvailableOnly, userData]);

    const viewItem = async (itemId) => {
        if (!token) return;
        try {
            await fetch(`${backendUrl}/api/users/view/${itemId}`, {
                method: "GET",
                headers: { token }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const isInWishlist = (itemId) =>
        wishlistData.some(entry => entry.itemId?._id === itemId);

    const toggleWishlist = async (e, itemId) => {
        e.stopPropagation();
        isInWishlist(itemId)
            ? await removeItemWishlist(itemId)
            : await addItemInWishlist(itemId);
    };

    return (
        <div>
            <p className="text-gray-600">
                {category ? `Category: ${category}` : 'Browse all products'}
            </p>

            {/* Availability Toggle */}
            <div className="mt-4 flex items-center gap-3">
                <button
                    onClick={() => setShowAvailableOnly(prev => !prev)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                        ${showAvailableOnly
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'}`}
                >
                    {showAvailableOnly ? 'Show All' : 'Show Available'}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">

                {/* Mobile filter toggle */}
                <button
                    className={`py-1 px-3 border rounded text-sm sm:hidden
                        ${showFilter ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setShowfilter(prev => !prev)}
                >
                    Filters
                </button>

                {/* Filters */}
                <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    {[
                        "Stationary", "Gadgets", "Room Essentials", "Clothing",
                        "Transport", "Appliances", "Games", "Accommodation", "Others"
                    ].map((cat, i) => (
                        <p
                            key={i}
                            onClick={() => {
                                setCategory(category === cat ? false : cat);
                                setShowfilter(false);
                            }}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded cursor-pointer
                                ${category === cat ? "bg-secondary text-white" : ""}`}
                        >
                            {cat}
                        </p>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-6">
                    {filterItem.map(item => (
                        <div
                            key={item._id}
                            onClick={async () => {
                                await viewItem(item._id);
                                navigate(`/item/${item._id}`);
                                window.scrollTo(0, 0);
                            }}
                            className="relative border border-blue-200 rounded-xl overflow-hidden cursor-pointer
                                       hover:-translate-y-2 transition-all duration-300"
                        >
                            {token && (
                                <button
                                    className="absolute top-3 right-3 z-10"
                                    onClick={(e) => toggleWishlist(e, item._id)}
                                >
                                    <Heart
                                        size={22}
                                        strokeWidth={isInWishlist(item._id) ? 0 : 2}
                                        fill={isInWishlist(item._id) ? "#ec4899" : "none"}
                                        color={isInWishlist(item._id) ? "#ec4899" : "#6b7280"}
                                    />
                                </button>
                            )}

                            <div className="w-full h-48 bg-blue-50">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className={`w-full h-full object-cover ${!item.available ? 'grayscale' : ''}`}
                                />
                            </div>

                            <div className="p-4">
                                <p className={`text-sm ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                                    {item.available ? 'Available' : 'Unavailable or sold'}
                                </p>
                                <p className="text-lg font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">₹{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Items;
