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

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword, phone } = formData;

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: ['Passwords do not match'] });
            return;
        }

        try {
            setLoading(true);
            setErrors({});

            const payload = { name, email, password };
            if (phone) payload.phone = phone;

            const { data } = await axios.post(
                `${backendUrl}/api/users/register`,
                payload
            );

            if (data.success) {
                toast.success('Registration successful! Please log in.');
                navigate('/login', { state: { email, password } });
            }
        } catch (error) {
            const data = error.response?.data;

            if (data?.errors) {
                setErrors(data.errors);
                return;
            }

            if (data?.message) {
                toast.error(data.message);
                return;
            }

            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                min-h-screen
                bg-white md:bg-gray-100
                flex
                items-start md:items-center
                justify-center
                pt-6 md:pt-0
            "
        >
            <div
                className="
                    w-full
                    px-4 py-6
                    md:px-8 md:py-8
                    md:max-w-md
                    bg-white
                    md:rounded-xl
                    md:shadow-lg
                "
            >
                <h1 className="text-2xl font-semibold text-gray-900">
                    Create Account
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Sign up to get started
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <div className="relative mt-2">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className={`
                                    w-full
                                    pl-10 pr-4 py-2.5 md:py-3
                                    rounded-md
                                    bg-gray-100
                                    outline-none
                                    border
                                    ${errors.name
                                        ? 'border-red-500'
                                        : 'border-transparent focus:border-blue-600'}
                                `}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">{errors.name[0]}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="relative mt-2">
                            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className={`
                                    w-full
                                    pl-10 pr-4 py-2.5 md:py-3
                                    rounded-md
                                    bg-gray-100
                                    outline-none
                                    border
                                    ${errors.email
                                        ? 'border-red-500'
                                        : 'border-transparent focus:border-blue-600'}
                                `}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email[0]}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <div className="relative mt-2">
                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone number"
                                className={`
                                    w-full
                                    pl-10 pr-4 py-2.5 md:py-3
                                    rounded-md
                                    bg-gray-100
                                    outline-none
                                    border
                                    ${errors.phone
                                        ? 'border-red-500'
                                        : 'border-transparent focus:border-blue-600'}
                                `}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-sm text-red-600 mt-1">{errors.phone[0]}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-2">
                            <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className={`
                                    w-full
                                    pl-10 pr-10 py-2.5 md:py-3
                                    rounded-md
                                    bg-gray-100
                                    outline-none
                                    border
                                    ${errors.password
                                        ? 'border-red-500'
                                        : 'border-transparent focus:border-blue-600'}
                                `}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                        </div>

                        {errors.password && (
                            <ul className="text-sm text-red-600 mt-1 space-y-1">
                                {errors.password.map((err, i) => (
                                    <li key={i}>• {err}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <div className="relative mt-2">
                            <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                className={`
                                    w-full
                                    pl-10 pr-10 py-2.5 md:py-3
                                    rounded-md
                                    bg-gray-100
                                    outline-none
                                    border
                                    ${errors.confirmPassword
                                        ? 'border-red-500'
                                        : 'border-transparent focus:border-blue-600'}
                                `}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.confirmPassword[0]}
                            </p>
                        )}
                    </div>

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
