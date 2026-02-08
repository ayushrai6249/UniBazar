import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Trash2 } from 'lucide-react';

const Wishlist = () => {
    const { wishlistData, removeItemWishlist } = useContext(AppContext);
    const navigate = useNavigate();

    const handleRemove = async (e, itemId) => {
        e.stopPropagation(); // prevent card click
        await removeItemWishlist(itemId);
    };

    return (
        <div className="min-h-screen px-4 sm:px-10 md:px-16 py-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Your Wishlist
            </h2>

            {wishlistData.length === 0 ? (
                <p className="text-gray-500">Your wishlist is empty.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlistData.map((entry, index) => {
                        const item = entry.itemId;
                        if (!item) return null;

                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    navigate(`/item/${item._id}`);
                                    window.scrollTo(0, 0);
                                }}
                                className="relative z-0 cursor-pointer border border-blue-200 rounded-xl overflow-hidden
                           hover:-translate-y-2 transition-all duration-500"
                            >
                                {/* Remove Button */}
                                <button
                                    onClick={(e) => handleRemove(e, item._id)}
                                    title="Remove from Wishlist"
                                    className="absolute top-3 right-3 z-20 bg-white border border-gray-300
                             rounded-full p-1 shadow hover:scale-110 transition"
                                >
                                    <Trash2 size={18} className="text-red-500" />
                                </button>

                                {/* Image */}
                                <div className="w-full h-48 bg-blue-50 relative z-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={`w-full h-full object-cover ${!item.available ? 'grayscale' : ''
                                            }`}
                                    />
                                </div>

                                {/* Info */}
                                <div className="p-4 relative z-10">
                                    {item.available ? (
                                        <div className="flex items-center gap-2 text-sm text-green-500">
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                            <p>Available</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-red-500">
                                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                                            <p>Unavailable or Sold</p>
                                        </div>
                                    )}

                                    <p className="text-gray-900 text-lg font-medium">
                                        {item.name}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        &#8377;{item.price}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
