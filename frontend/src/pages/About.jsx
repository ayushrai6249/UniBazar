import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">
                    ABOUT <span className="text-primary">US</span>
                </h2>
                <p className="text-gray-500 mt-2 max-w-xl mx-auto text-base sm:text-lg">
                    Get to know how UniBazar is reshaping campus commerce.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                <img
                    className="w-full max-w-[500px] "
                    // src={assets.about_image}
                    src={assets.UniLogo}
                    alt="About UniBazar"
                />
                <div className="flex flex-col gap-6 text-gray-700 text-sm sm:text-base leading-relaxed">
                    <p>
                        Welcome to <strong>UniBazar</strong> – a student marketplace built to help you buy and sell items within your university with ease and trust. Whether it's used books, electronics, furniture, or anything else, UniBazar makes campus trading smooth and secure.
                    </p>
                    <p>
                        Built by students of <strong>MMMUT</strong>, our mission is to solve the everyday hassle of finding buyers and sellers on campus by offering a dedicated platform tailored just for university communities.
                    </p>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Our Vision</h3>
                        <p>
                            To create a trusted, scalable network of university-based marketplaces across India, empowering students to save money, reduce waste, and connect meaningfully through trade.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
