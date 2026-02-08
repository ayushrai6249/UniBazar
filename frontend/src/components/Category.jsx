import React from 'react';
import { categoryData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Category = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col items-center gap-4 py-16 text-gray-800'>
            <h1 className='text-3xl font-medium'>Find by Category</h1>

            <div className='flex sm:justify-center lg:gap-12 gap-4 pt-5 w-full overflow-scroll'>
                {categoryData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            navigate('/items', {
                                state: { category: item.category }
                            });
                            window.scrollTo(0, 0);
                        }}
                        className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0
                                   hover:translate-y-[-10px] transition-all duration-500'
                    >
                        <img
                            src={item.image}
                            alt=""
                            className='w-16 h-16 sm:w-24 sm:h-24 mb-2 rounded-full object-cover'
                        />
                        <p>{item.category}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
