import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../context/AppContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { token, setToken, backendUrl, login } = useContext(AppContext);

    useEffect(() => {
        if (location.state?.email && location.state?.password) {
            setEmail(location.state.email);
            setPassword(location.state.password);
            toast.info("Please confirm your details to log in.");
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const { data } = await axios.post(
                `${backendUrl}/api/users/login`,
                { email, password }
            );

            if (data.success) {
                if (login) {
                    login(data.token);
                } else {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                }

                toast.success(data.message || "Logged in successfully!");
                navigate('/');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <div
            className="
                min-h-screen
                bg-white md:bg-gray-100
                flex
                items-start md:items-center
                justify-center
                pt-12 md:pt-0
            "
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
                    Login
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Login to get started
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <FaUser size={16} />
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                    {/* Password */}
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 font-medium"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <RiLockPasswordLine size={16} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? (
                                    <AiFillEyeInvisible size={18} />
                                ) : (
                                    <AiFillEye size={18} />
                                )}
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <Link
                        to="/register"
                        className="text-blue-600 font-medium text-sm"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
