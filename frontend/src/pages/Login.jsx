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
        <div className="min-h-screen flex flex-col items-center justify-center bg-primary rounded-2xl p-4">
            <div className="max-w-md w-full p-8 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/70">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <span className="absolute left-3 top-[45px] text-blue-500">
                            <FaUser size={18} />
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter your email"
                            autoFocus
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <span className="absolute left-3 top-[45px] text-blue-500">
                            <RiLockPasswordLine size={20} />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-[44px] text-gray-400 hover:text-blue-500"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                        </button>
                    </div>

                    <div className="flex justify-between">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
