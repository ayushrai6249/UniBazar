import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { AppContext } from '../context/AppContext';

const Login = () => {
    const navigate = useNavigate();
    const { backendUrl, token, login, setToken } = useContext(AppContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${backendUrl}/api/users/login`,
                { email, password }
            );

            if (data.success) {
                if (login) login(data.token);
                else {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                }
                navigate('/');
            }

        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: ['Something went wrong'] });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate]);

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
                    md:shadow-lg
                    md:rounded-xl
                "
            >
                {/* Header */}
                <h1 className="text-2xl font-semibold text-gray-900">
                    Login
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Login to continue
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <div className="relative mt-2">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors(prev => ({ ...prev, email: null }));
                                }}
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
                            <p className="text-sm text-red-600 mt-1">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-2">
                            <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors(prev => ({ ...prev, password: null }));
                                }}
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
                            <p className="text-sm text-red-600 mt-1">
                                {errors.password[0]}
                            </p>
                        )}
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
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <Link
                        to="/register"
                        className="text-blue-600 text-sm font-medium"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
