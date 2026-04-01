import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const { userData, setUserData, token, backendUrl } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

    const [collegeSearch, setCollegeSearch] = useState('');
    const [collegeResults, setCollegeResults] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (collegeSearch.trim()) {
                fetchColleges(collegeSearch);
            } else {
                setCollegeResults([]);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [collegeSearch]);

    const fetchColleges = async (value) => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/colleges?search=${value}`
            );
            setCollegeResults(data);
        } catch (err) {
            console.log(err);
        }
    };

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();

            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('address', userData.address);
            formData.append('gender', userData.gender);
            formData.append('dob', userData.dob);

            formData.append(
                'collegeId',
                selectedCollege ? selectedCollege.id : userData.collegeId
            );

            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.post(
                `${backendUrl}/api/users/update-profile`,
                formData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);

                setUserData(prev => ({
                    ...prev,
                    collegeName: selectedCollege
                        ? selectedCollege.name
                        : prev.collegeName,
                    collegeId: selectedCollege
                        ? selectedCollege._id
                        : prev.collegeId,
                }));

                setIsEdit(false);
                setImage(false);
                setSelectedCollege(null);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    return userData && (
        <div className='max-w-lg flex flex-col gap-3 text-sm'>

            {/* Profile Image */}
            {
                isEdit ? (
                    <label htmlFor="image">
                        <div className='inline-block relative cursor-pointer'>
                            <img
                                className='w-36 rounded opacity-75'
                                src={image ? URL.createObjectURL(image) : userData.image}
                                alt=""
                            />
                            {!image && (
                                <img
                                    className='w-10 absolute bottom-12 right-12'
                                    src={assets.upload_icon}
                                    alt=""
                                />
                            )}
                        </div>
                        <input
                            onChange={(e) => setImage(e.target.files[0])}
                            type="file"
                            id='image'
                            hidden
                        />
                    </label>
                ) : (
                    <img className='w-36 rounded' src={userData.image} alt="" />
                )
            }

            {/* Name */}
            {
                isEdit
                    ? <input
                        className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 px-2 py-1'
                        type='text'
                        value={userData.name}
                        onChange={(e) =>
                            setUserData(prev => ({ ...prev, name: e.target.value }))
                        }
                    />
                    : <p className='font-medium text-3xl text-neutral-800 mt-4'>
                        {userData.name}
                    </p>
            }

            <hr className='bg-zinc-400 h-[1px] border-none' />

            {/* CONTACT INFO */}
            <div>
                <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>

                <div className='grid grid-cols-[120px_1fr] gap-x-6 gap-y-3 mt-3 text-neutral-700'>
                    <p className='font-medium'>Email:</p>
                    <p className='text-blue-500 break-words'>{userData.email}</p>

                    <p className='font-medium'>Phone:</p>
                    {
                        isEdit
                            ? <input
                                className='bg-gray-100 px-2 py-1'
                                type='text'
                                value={userData.phone}
                                onChange={(e) =>
                                    setUserData(prev => ({ ...prev, phone: e.target.value }))
                                }
                            />
                            : <p className='text-blue-400'>{userData.phone}</p>
                    }

                    <p className='font-medium'>Hostel/Location:</p>
                    {
                        isEdit
                            ? <input
                                className='bg-gray-50 px-2 py-1'
                                type='text'
                                value={userData.address}
                                onChange={(e) =>
                                    setUserData(prev => ({ ...prev, address: e.target.value }))
                                }
                            />
                            : <p className='text-gray-500 break-words'>{userData.address}</p>
                    }
                </div>
            </div>

            {/* COLLEGE SEARCH */}
            <div>
                <p className='font-medium mt-3'>College:</p>

                {
                    isEdit ? (
                        <div className="relative">
                            <input
                                type="text"
                                value={collegeSearch}
                                onChange={(e) => {
                                    setCollegeSearch(e.target.value);
                                    setSelectedCollege(null);
                                }}
                                placeholder="Search college..."
                                className="bg-gray-100 px-2 py-1 w-full"
                            />

                            {collegeResults.length > 0 && (
                                <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
                                    {collegeResults.map((col) => (
                                        <div
                                            key={col._id}
                                            onClick={() => {
                                                setSelectedCollege(col);
                                                setCollegeSearch(col.name);
                                                setCollegeResults([]);
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {col.name} ({col.shortform}) - {col.city}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className='text-gray-500 break-words'>
                            {userData.collegeName || "Not selected"}
                        </p>
                    )
                }
            </div>

            {/* BASIC INFO */}
            <div>
                <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>

                <div className='grid grid-cols-[120px_1fr] gap-x-6 gap-y-3 mt-3 text-neutral-700'>
                    <p className='font-medium'>Gender:</p>
                    {
                        isEdit
                            ? <select
                                className='bg-gray-100 px-2 py-1'
                                value={userData.gender}
                                onChange={(e) =>
                                    setUserData(prev => ({ ...prev, gender: e.target.value }))
                                }
                            >
                                <option value="Not selected">Not selected</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            : <p className='text-gray-400'>{userData.gender}</p>
                    }

                    <p className='font-medium'>Birthday:</p>
                    {
                        isEdit
                            ? <input
                                className='bg-gray-100 px-2 py-1'
                                type='date'
                                value={userData.dob}
                                onChange={(e) =>
                                    setUserData(prev => ({ ...prev, dob: e.target.value }))
                                }
                            />
                            : <p className='text-gray-400'>{userData.dob}</p>
                    }
                </div>
            </div>

            {/* BUTTON */}
            <div className='mt-10'>
                {
                    isEdit
                        ? <button
                            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300'
                            onClick={updateUserProfileData}
                        >
                            Save Information
                        </button>
                        : <button
                            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300'
                            onClick={() => {
                                setIsEdit(true);
                                setCollegeSearch(userData.collegeName || '');
                            }}
                        >
                            Edit
                        </button>
                }
            </div>
        </div>
    );
};

export default Profile;