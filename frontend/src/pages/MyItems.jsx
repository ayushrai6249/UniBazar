import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyItems = () => {
    const [yourItems, setYourItems] = useState([]);
    const { toggleAvailability, token, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const loadYourItems = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/items/get-items", { headers: { token } });
            if (data.success) {
                setYourItems(data.allItems);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        if (token) {
            loadYourItems();
        }
    }, [token, toggleAvailability]);

    return (
        <div className='px-4 py-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Your Listed Items</h2>

            {yourItems.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">You haven’t listed any items yet.</p>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {yourItems.map((item, index) => (
                        <div
                            key={index}
                            className='bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group'
                        >
                            <div
                                onClick={() => { navigate(`/item/${item._id}`); scrollTo(0, 0); }}
                                className='w-full h-48 bg-gray-100 rounded-t-2xl overflow-hidden'
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${!item.available ? 'grayscale' : ''}`}
                                />
                            </div>

                            <div className='p-4 space-y-2'>
                                <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {item.available ? 'Available' : 'Unavailable or sold'}
                                </div>
                                <br />
                                <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${item.approved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${item.approved ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {item.approved ? 'Approved' : 'Unapproved'}
                                </div>

                                <h3 className='text-lg font-semibold text-gray-800 truncate'>{item.name}</h3>
                                <p className='text-gray-500 text-sm'>&#8377;{item.price}</p>

                                <button
                                    onClick={async () => {
                                        await toggleAvailability(item._id);
                                        loadYourItems();
                                    }}
                                    className={`mt-2 w-full py-1.5 text-sm font-medium rounded-lg transition-colors duration-300 
                                        ${item.available
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                >
                                    {item.available ? 'Mark as Sold' : 'Mark as Available'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyItems;
