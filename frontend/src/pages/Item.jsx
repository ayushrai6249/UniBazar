import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Badge = ({ text, color }) => (
  <span
    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border
      ${color === 'blue'
        ? 'bg-blue-100 text-blue-800 border-blue-300'
        : color === 'green'
          ? 'bg-green-100 text-green-800 border-green-300'
          : color === 'red'
            ? 'bg-red-100 text-red-700 border-red-300'
            : 'bg-gray-100 text-gray-800 border-gray-300'
      }`}
  >
    {text}
  </span>
);

const Item = () => {
  const [itemInfo, setItemInfo] = useState(null);
  const [isWishlist, setIsWishlist] = useState(false);

  const {
    toggleAvailability,
    userData,
    backendUrl,
    token,
    wishlistData,
    addItemInWishlist,
    removeItemWishlist,
  } = useContext(AppContext);

  const { itemId } = useParams();
  const navigate = useNavigate();

  const loadItemInfo = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/items/get-item-info`,
        { itemId },
        { headers: { token } }
      );

      if (data.success) {
        setItemInfo(data.itemInfo);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (itemId) loadItemInfo();
  }, [itemId, token, toggleAvailability]);

  useEffect(() => {
    if (itemInfo && wishlistData.length) {
      const found = wishlistData.find(
        (x) => x.itemId._id === itemInfo._id
      );
      setIsWishlist(!!found);
    }
  }, [itemInfo, wishlistData]);

  const toggleWishlist = async () => {
    try {
      if (isWishlist) {
        await removeItemWishlist(itemInfo._id);
        setIsWishlist(false);
      } else {
        await addItemInWishlist(itemInfo._id);
        setIsWishlist(true);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!itemInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading item...
      </div>
    );
  }

  const isOwner = itemInfo.owner?._id === userData?._id;

  return (
    <div className="py-4 px-0 sm:px-6 lg:px-16 min-h-screen">
      <div
        className="
          grid grid-cols-1 lg:grid-cols-3 gap-6
          bg-white
          p-3 sm:p-6
          rounded-none lg:rounded-2xl
          shadow-none lg:shadow-lg
          relative
        "
      >
        {token && !isOwner && (
          <button
            onClick={toggleWishlist}
            className="absolute top-4 right-4 z-10 transition hover:scale-110"
          >
            <Heart
              size={28}
              strokeWidth={isWishlist ? 0 : 2}
              fill={isWishlist ? '#ec4899' : 'none'}
              color={isWishlist ? '#ec4899' : '#6b7280'}
            />
          </button>
        )}

        <div className="flex justify-center">
          <img
            src={itemInfo.image}
            alt={itemInfo.name}
            className={`
            w-full object-cover aspect-square
            rounded-md sm:rounded-xl
          ${!itemInfo.available ? 'grayscale' : ''}
          `}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {itemInfo.name}
            </h1>

            <div className="flex gap-2 mb-3 flex-wrap">
              <Badge text={itemInfo.category} color="blue" />
              <Badge text={`${itemInfo.old} old`} color="blue" />
              {isOwner && (
                <Badge
                  text={itemInfo.approved ? 'Approved' : 'Unapproved'}
                  color={itemInfo.approved ? 'green' : 'red'}
                />
              )}
            </div>

            <p
              className={`text-sm font-medium ${itemInfo.available ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {itemInfo.available ? 'Available' : 'Unavailable or Sold'}
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm">About</p>
            <p className="text-sm text-gray-600">{itemInfo.description}</p>
          </div>

          {!isOwner && itemInfo?.owner && (
            <div>
              <p className="font-semibold text-sm">Owner</p>

              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                onClick={() => navigate(`/profile/${itemInfo.owner._id}`)}
              >
                <img
                  src={itemInfo.owner.image || '/default-avatar.png'}
                  alt={itemInfo.owner.name}
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <p className="text-sm font-semibold">
                  {itemInfo.owner.name}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <p className="text-lg font-bold">₹{itemInfo.price}</p>

            {isOwner && (
              <button
                onClick={async () => {
                  await toggleAvailability(itemInfo._id);
                  loadItemInfo();
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200"
              >
                {itemInfo.available ? 'Mark as Sold' : 'Mark as Available'}
              </button>
            )}
          </div>

          {!isOwner ? (
            itemInfo.available && (
              <button
                onClick={() => toast.warning('This feature is unavailable')}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700"
              >
                Message Seller
              </button>
            )
          ) : (
            <button
              onClick={() => toast.warning('This feature is unavailable')}
              className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700"
            >
              See All Messages
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
