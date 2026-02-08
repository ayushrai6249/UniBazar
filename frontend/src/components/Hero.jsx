import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
    return (
        <div className="flex flex-col md:flex-row bg-secondary rounded-lg px-6 md:px-10 lg:px-20 py-6 md:py-12">
            {/* Left */}
            <div className="md:w-1/2 flex flex-col justify-center gap-6 md:gap-8">
                <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-snug">
                    Buy & Sell
                    <br />
                    Unused Items
                </p>
                <p className="text-white text-sm font-light max-w-md">
                    Simply browse through our wide range of listings,
                    <br className="hidden sm:block" />
                    and buy or sell your items hassle-free.
                </p>
                <a
                    href="#catagory"
                    className="flex items-center gap-2 bg-white px-4 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300"
                    style={{ maxWidth: '180px' }}
                >
                    Explore Items
                    <img className="w-3" src={assets.arrow_icon} alt="Arrow icon" />
                </a>
            </div>
            {/* Right */}
            <div className="md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
                <img
                    className="w-full max-w-md rounded-lg object-cover"
                    src={assets.hero}
                    alt="Hero"
                />
            </div>
        </div>
    )
}

export default Hero
