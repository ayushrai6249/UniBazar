import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Heart } from 'lucide-react';

const ShowItems = () => {
    const navigate = useNavigate();

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

    const [viewMode, setViewMode] = useState('mostViewed');

    useEffect(() => {
        loadApprovedItems();
    }, []);

    const viewItem = async (itemId) => {
        try {
            if (token) {
                await fetch(`${backendUrl}/api/users/view/${itemId}`, {
                    method: 'GET',
                    headers: { token }
                });
            }
        } catch (err) {
            console.error('View tracking error:', err);
        }
    };

    const isInWishlist = (itemId) => {
        return wishlistData.some(w => w.itemId?._id === itemId);
    };

    const toggleWishlist = async (e, itemId) => {
        e.stopPropagation();
        try {
            if (isInWishlist(itemId)) {
                await removeItemWishlist(itemId);
            } else {
                await addItemInWishlist(itemId);
            }
        } catch (err) {
            console.error('Wishlist error:', err);
        }
    };

    const sortedItems = [...(approvedItems || [])]
        .filter(item => item.owner._id !== userData?._id && item.available)
        .sort((a, b) => {
            if (viewMode === 'recent') {
                return new Date(b.date) - new Date(a.date); // ✅ using `date`
            }
            return (b.views || 0) - (a.views || 0);
        })
        .slice(0, 8);

    return (
        <div className="flex flex-col items-center gap-8 my-16 text-gray-900 px-4 md:px-10">

            <h1 className="text-3xl font-semibold">
                {viewMode === 'recent'
                    ? 'Recently Added Items'
                    : 'Most Viewed Items'}
            </h1>

            <div className="flex justify-center gap-2 mb-4 bg-gray-200 p-1 rounded-full">
                <button
                    onClick={() => setViewMode('mostViewed')}
                    className={`px-5 py-2 text-sm font-semibold rounded-full transition-all
                        ${viewMode === 'mostViewed'
                            ? 'bg-white text-blue-600 shadow'
                            : 'text-gray-600'
                        }`}
                >
                    Most Viewed
                </button>

                <button
                    onClick={() => setViewMode('recent')}
                    className={`px-5 py-2 text-sm font-semibold rounded-full transition-all
                        ${viewMode === 'recent'
                            ? 'bg-white text-blue-600 shadow'
                            : 'text-gray-600'
                        }`}
                >
                    Recent
                </button>
            </div>

            {/* Items Grid */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">

                {sortedItems.map(item => (
                    <div
                        key={item._id}
                        onClick={async () => {
                            await viewItem(item._id);
                            navigate(`/item/${item._id}`);
                            window.scrollTo(0, 0);
                        }}
                        className="relative border border-blue-200 rounded-2xl overflow-hidden cursor-pointer bg-white
                                   hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                        {token && (
                            <button
                                className="absolute top-3 right-3 z-10 hover:scale-110 transition"
                                onClick={(e) => toggleWishlist(e, item._id)}
                            >
                                <Heart
                                    size={22}
                                    strokeWidth={isInWishlist(item._id) ? 0 : 2}
                                    fill={isInWishlist(item._id) ? '#ec4899' : 'none'}
                                    color={isInWishlist(item._id) ? '#ec4899' : '#6b7280'}
                                />
                            </button>
                        )}

                        {/* Image */}
                        <div className="w-full h-48 bg-blue-50">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="p-4 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Available</span>
                            </div>

                            <p className="text-lg font-medium truncate">
                                {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                &#8377;{item.price}
                            </p>
                        </div>
                    </div>
                ))}

            </div>

            <button
                onClick={() => {
                    navigate('/items');
                    window.scrollTo(0, 0);
                }}
                className="bg-tertiary text-white px-10 py-3 rounded-full mt-10 hover:bg-opacity-90 transition"
            >
                Explore More
            </button>
        </div>
    );
};

export default ShowItems;
