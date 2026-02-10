import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { MessageSquareText, Bell } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, userData } = useContext(AppContext);
    const [showMenu, setShowMenu] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const optionsRef = useRef(); // Ref for dropdown

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
    };

    const toggleShowOptions = () => {
        setShowOptions(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            {/* Logo */}
            <h1 onClick={() => navigate('/')} className='text-2xl cursor-pointer text-primary font-bold'>UniBazar</h1>

            {/* Navigation Links */}
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'><li className='py-1'>HOME</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' /></NavLink>
                <NavLink to='/items'><li className='py-1'>PRODUCTS</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' /></NavLink>
                <NavLink to='/about'><li className='py-1'>ABOUT</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' /></NavLink>
                <NavLink to='/contact'><li className='py-1'>CONTACT</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' /></NavLink>
                {userData.role === "admin" && <NavLink to='/admin'><li className='py-1'>ADMIN</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' /></NavLink>}
                {userData.role === "manager" && <NavLink to='/manager'><li className='py-1'>MANAGER</li><hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' /></NavLink>}
            </ul>

            {/* Right Section (Messages, Notifications, Profile) */}
            <div className='flex items-center gap-5' ref={optionsRef}>
                {token && (
                    <>
                        {/* Messages Icon */}
                        <div
                            // onClick={() => navigate('/user-chat')}
                            onClick={() => toast.warning('This feature is unavailable')}
                            className='cursor-pointer relative hover:text-primary transition'
                        >
                            <MessageSquareText size={22} />
                            {/* Badge */}
                            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1'>2</span>
                        </div>
                    </>
                )}

                {/* Profile Dropdown or Login Button */}
                {token ? (
                    <div onClick={toggleShowOptions} className='flex items-center cursor-pointer gap-2 group relative'>
                        <img className='w-8 h-8 rounded-full object-cover' src={userData.image} alt="User" />
                        <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                        <div className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 ${showOptions ? "block" : "hidden"} `}>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                                <p onClick={() => { navigate(`/profile`) }} className='hover:text-black cursor-pointer'>Profile</p>
                                <p onClick={() => { navigate('/add-listing') }} className='hover:text-black cursor-pointer'>Add Listing</p>
                                <p onClick={() => { navigate('/wishlist') }} className='hover:text-black cursor-pointer'>Wishlist</p>
                                <p onClick={() => { navigate('/my-orders') }} className='hover:text-black cursor-pointer'>My Orders</p>
                                <p onClick={() => { navigate('/my-listings') }} className='hover:text-black cursor-pointer'>My Listings</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => { navigate('/login') }} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Login</button>
                )}

                {/* Mobile Menu */}
                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
                <div className={`fixed top-0 right-0 h-full w-full bg-white z-30 transform transition-transform duration-300 ease-in-out ${showMenu ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <h1 onClick={() => navigate('/')} className='text-2xl cursor-pointer text-primary font-bold'>UniBazar</h1>
                        <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-3 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/items'><p className='px-4 py-2 rounded inline-block'>PRODUCTS</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                        {userData.role === "admin" && <NavLink onClick={() => setShowMenu(false)} to='/admin'><p className='px-4 py-2 rounded inline-block'>ADMIN</p></NavLink>}
                        {userData.role === "manager" && <NavLink onClick={() => setShowMenu(false)} to='/manager'><p className='px-4 py-2 rounded inline-block'>ADMIN</p></NavLink>}
                        {(!token) && <NavLink onClick={() => setShowMenu(false)} to='/login'><p className='px-4 py-2 rounded inline-block'>LOGIN</p></NavLink>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
