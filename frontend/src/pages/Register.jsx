import { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaPhone } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { AppContext } from '../context/AppContext';

const Register = () => {
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword, phone } = formData;

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            setLoading(true);

            const payload = { name, email, password };
            if (phone) payload.phone = phone;

            const { data } = await axios.post(
                `${backendUrl}/api/users/register`,
                payload
            );

            if (data.success) {
                toast.success('Registration successful! Please log in.');

                navigate('/login', {
                    state: { email, password }
                });
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'An unexpected error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                 min-h-[100dvh]
                bg-white md:bg-gray-100
                flex
                items-start md:items-center
                justify-center
                pt-6 md:pt-0
                overflow-y-auto"
        >
            <div
                className="
                    w-full
                    px-6 py-10
                    md:max-w-md
                    md:bg-white
                    md:rounded-xl
                    md:shadow-lg
                "
            >
                {/* Header */}
                <h1 className="text-2xl font-semibold text-gray-900">
                    Create Account
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Sign up to get started
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <FaUser size={16} />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter First and Last Name"
                                className="
                                    w-full
                                    pl-10 pr-4 py-3
                                    rounded-md
                                    bg-gray-100
                                    border border-transparent
                                    focus:bg-white focus:border-blue-600
                                    outline-none
                                "
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <MdEmail size={18} />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter Email"
                                className="
                                    w-full
                                    pl-10 pr-4 py-3
                                    rounded-md
                                    bg-gray-100
                                    border border-transparent
                                    focus:bg-white focus:border-blue-600
                                    outline-none
                                "
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <FaPhone size={16} />
                            </span>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter Phone Number"
                                className="
                                    w-full
                                    pl-10 pr-4 py-3
                                    rounded-md
                                    bg-gray-100
                                    border border-transparent
                                    focus:bg-white focus:border-blue-600
                                    outline-none
                                "
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <RiLockPasswordLine size={16} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter Password"
                                className="
                                    w-full
                                    pl-10 pr-10 py-3
                                    rounded-md
                                    bg-gray-100
                                    border border-transparent
                                    focus:bg-white focus:border-blue-600
                                    outline-none
                                "
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <RiLockPasswordLine size={16} />
                            </span>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm Password"
                                className="
                                    w-full
                                    pl-10 pr-10 py-3
                                    rounded-md
                                    bg-gray-100
                                    border border-transparent
                                    focus:bg-white focus:border-blue-600
                                    outline-none
                                "
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-blue-600
                            text-white
                            py-3
                            rounded-md
                            font-semibold
                            hover:bg-blue-700
                            transition
                            disabled:opacity-60
                        "
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-medium">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
