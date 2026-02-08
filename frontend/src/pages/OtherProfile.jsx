import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const OtherProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const { profileId } = useParams();
    const { backendUrl } = useContext(AppContext);

    const loadProfileData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/users/profile/${profileId}`
            );

            if (data.success) {
                setProfileData(data.profileData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (profileId) loadProfileData();
    }, [profileId]);

    if (!profileData) return <p>Loading...</p>;

    return (
        <div className="max-w-lg flex flex-col gap-2 text-sm">
            {/* PROFILE IMAGE */}
            <img
                className="w-36 rounded"
                src={profileData.image || "/default-avatar.png"}
                alt={profileData.name}
            />

            {/* NAME */}
            <p className="font-medium text-3xl text-neutral-800 mt-4">
                {profileData.name}
            </p>

            <hr className="bg-zinc-400 h-[1px] border-none" />

            {/* CONTACT INFO */}
            <div>
                <p className="text-neutral-500 underline mt-3">
                    CONTACT INFORMATION
                </p>

                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">Email id:</p>
                    <p className="text-blue-500">{profileData.email}</p>

                    <p className="font-medium">Phone:</p>
                    <p className="text-blue-400">
                        {profileData.phone || "Not provided"}
                    </p>

                    <p className="font-medium">Address:</p>
                    <p className="text-gray-500">
                        {profileData.address || "Not provided"}
                    </p>
                </div>
            </div>

            {/* BASIC INFO */}
            <div>
                <p className="text-neutral-500 underline mt-3">
                    BASIC INFORMATION
                </p>

                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">Gender:</p>
                    <p className="text-gray-400">
                        {profileData.gender || "Not selected"}
                    </p>

                    <p className="font-medium">Birthday:</p>
                    <p className="text-gray-400">
                        {profileData.dob || "Not provided"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OtherProfile;
