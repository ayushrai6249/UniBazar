import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm pt-10 border-t border-primary'>
                {/* Left */}
                <div>
                    <h1 onClick={() => navigate('/')} className='text-2xl cursor-pointer text-primary font-bold'>UniBazar</h1>
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>
                        UniBazar is a community-driven marketplace for buying and selling used goods. Easily browse categories, list items with images, and connect with trusted users — all in a smooth, responsive experience.
                    </p>
                </div>

                {/* Center & Right (Wrapped for responsive row/column) */}
                <div className="flex flex-col sm:flex-row sm:col-span-2 gap-10">
                    {/* Center */}
                    <div className="flex-1">
                        <p className='text-xl font-medium mb-5'>COMPANY</p>
                        <ul className='flex flex-col gap-2 text-gray-600'>
                            <li>Home</li>
                            <li>About us</li>
                            <li>Contact us</li>
                            <li>Privacy policy</li>
                        </ul>
                    </div>

                    {/* Right */}
                    <div className="flex-1">
                        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                        <ul className='flex flex-col gap-2 text-gray-600'>
                            <li>+91 9336651494</li>
                            <li>unibazarmmmut@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>
                    Copyright 2025@ UniBazar.dev - All Right Reserved.
                </p>
            </div>
        </div>
    )
}

export default Footer
