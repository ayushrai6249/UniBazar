import { useContext, useState, useEffect } from 'react';
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

    const [collegeSearch, setCollegeSearch] = useState('');
    const [collegeResults, setCollegeResults] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const searchCollege = async (value) => {
        try {
            if (!value) {
                setCollegeResults([]);
                return;
            }

            const { data } = await axios.get(
                `${backendUrl}/api/colleges?search=${value}`
            );

            setCollegeResults(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (collegeSearch) {
                searchCollege(collegeSearch);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [collegeSearch]);

    const handleCollegeChange = (e) => {
        const value = e.target.value;
        setCollegeSearch(value);
        setSelectedCollege(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword, phone } = formData;

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: ['Passwords do not match'] });
            return;
        }

        if (!selectedCollege) {
            toast.error("Please select your college");
            return;
        }

        try {
            setLoading(true);
            setErrors({});

            const payload = {
                name,
                email,
                password,
                phone,
                collegeId: selectedCollege._id
            };

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
        <div className="min-h-screen bg-white md:bg-gray-100 flex items-start md:items-center justify-center pt-6 md:pt-0">
            <div className="w-full px-4 py-6 md:px-8 md:py-8 md:max-w-md bg-white md:rounded-xl md:shadow-lg">

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
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-gray-100 outline-none border focus:border-blue-600"
                            />
                        </div>
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
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-gray-100 outline-none border focus:border-blue-600"
                            />
                        </div>
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
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-gray-100 outline-none border focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">College</label>

                        <div className="relative mt-2">
                            <input
                                type="text"
                                value={collegeSearch}
                                onChange={handleCollegeChange}
                                placeholder="Search your college..."
                                className="w-full px-4 py-2.5 rounded-md bg-gray-100 outline-none border focus:border-blue-600"
                            />

                            {collegeResults.length > 0 && (
                                <div className="absolute z-10 w-full bg-white border mt-1 rounded-md shadow max-h-60 overflow-y-auto">
                                    {collegeResults.map((college) => (
                                        <div
                                            key={college.id}
                                            onClick={() => {
                                                setSelectedCollege(college);
                                                setCollegeSearch(`${college.shortform} — ${college.city}`);
                                                setCollegeResults([]);
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <p className="font-medium">{college.shortform}</p>
                                            <p className="text-sm text-gray-500">
                                                {college.name} — {college.city}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label>Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-gray-100"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label>Confirm Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-gray-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-md"
                    >
                        {loading ? 'Creating...' : 'Create Account'}
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