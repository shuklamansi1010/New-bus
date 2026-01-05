import React, { useContext, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

// React Icons
import { FaUserEdit, FaSave, FaUser, FaPhone, FaCalendarDay, FaVenusMars, FaEnvelope } from 'react-icons/fa';
import { IoIosCloudUpload } from 'react-icons/io';

const PRIMARY_COLOR = '#1999d5'

// Default user image as a fallback (base64 placeholder)
const DEFAULT_USER_IMAGE = "https://via.placeholder.com/150/cccccc/FFFFFF?text=User";

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(null)

    const { token, backendUrl, userData, setUserData, loadUserProfileData, showNotification } = useContext(AppContext)

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData(prev => ({ ...prev, [name]: value }))
    }

   const updateUserProfileData = async () => {
  if (!userData.name || !userData.phone || !userData.gender || !userData.dob) {
    showNotification('Please fill in all required fields.', 'warning');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('phone', userData.phone);
    formData.append('gender', userData.gender);
    formData.append('dob', userData.dob);
    if (image) formData.append('image', image);

    const { data } = await axios.put(`${backendUrl}/api/user/profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (data.success) {
      showNotification(data.message, 'success');
      await loadUserProfileData();
      setIsEdit(false);
      setImage(null);
    } else {
      showNotification(data.message, 'error');
    }
  } catch (err) {
    console.error(err);
    showNotification(err.response?.data?.message || err.message, 'error');
  }
};


    if (!userData) return null

    return (
        <div className='flex justify-center py-10 px-4 min-h-screen bg-gray-50'>
            <div className='w-full max-w-2xl bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100'>

                {/* Header */}
                <div className='flex justify-between items-center mb-8 border-b pb-4'>
                    <h2 className='text-3xl font-bold text-gray-800 flex items-center gap-2'>
                        <FaUser style={{ color: PRIMARY_COLOR }} /> My Profile
                    </h2>
                    {isEdit ? (
                        <button
                            onClick={updateUserProfileData}
                            className='px-4 sm:px-6 py-2 rounded-full font-semibold transition-all shadow-md text-white bg-green-600 hover:bg-green-700 hover:shadow-lg flex items-center gap-2'
                        >
                            <FaSave className='text-lg' /> Save Changes
                        </button>
                    ) : (
                        <button
                            style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                            onClick={() => setIsEdit(true)}
                            className='px-4 sm:px-6 py-2 rounded-full font-semibold transition-all hover:bg-[#1999d5] hover:text-white flex items-center gap-2 border'
                        >
                            <FaUserEdit className='text-lg' /> Edit Profile
                        </button>
                    )}
                </div>

                {/* Profile Image & Name */}
                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10'>
                    <div className='relative w-36 h-36 flex-shrink-0'>
                        {isEdit ? (
                            <label htmlFor='image' className='group block cursor-pointer'>
                                <img
                                    className={`w-full h-full object-cover rounded-full shadow-lg border-4 transition-all duration-300 ${image ? 'border-blue-300' : 'border-gray-200'} group-hover:opacity-70`}
                                    src={image ? URL.createObjectURL(image) : userData.image || DEFAULT_USER_IMAGE}
                                    alt={userData?.name || 'User Avatar'}
                                />
                                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/40'>
                                    <IoIosCloudUpload className='text-white text-3xl' />
                                </div>
                                <input
                                    type="file"
                                    id="image"
                                    hidden
                                    accept='image/*'
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </label>
                        ) : (
                            <img
                                className='w-full h-full object-cover rounded-full shadow-lg border-4 border-white'
                                src={userData.image || DEFAULT_USER_IMAGE}
                                alt={userData?.name || 'User Avatar'}
                            />
                        )}
                    </div>

                    <div className='flex flex-col justify-center mt-4 sm:mt-0 w-full'>
                        {isEdit ? (
                            <input
                                name="name"
                                type="text"
                                value={userData.name}
                                onChange={handleChange}
                                placeholder='Enter your name'
                                className='w-full text-4xl font-extrabold text-gray-800 bg-gray-50 border-b-2 p-1 focus:outline-none focus:border-blue-500 transition-colors'
                            />
                        ) : (
                            <p className='font-extrabold text-4xl text-[#262626]'>{userData.name}</p>
                        )}
                        <p className='text-lg font-medium text-gray-500 mt-1 flex items-center gap-2'>
                            <FaEnvelope className='text-sm' /> {userData.email}
                        </p>
                    </div>
                </div>

                {/* Contact Info Example */}
                <div className='mb-10'>
                    <h3 className='text-xl font-bold mb-4 flex items-center gap-2' style={{ color: PRIMARY_COLOR }}>
                        <FaPhone /> Contact Information
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 p-5 bg-gray-50 rounded-xl shadow-inner border border-gray-200'>
                        <p className='font-semibold text-gray-700 flex items-center gap-2'>
                            <FaPhone /> Phone Number:
                        </p>
                        {isEdit ? (
                            <input
                                name="phone"
                                type="text"
                                value={userData.phone || ''}
                                onChange={handleChange}
                                placeholder='(e.g., 9876543210)'
                                className='w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                            />
                        ) : (
                            <p className='text-gray-800 font-medium'>{userData.phone || 'Not provided'}</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default MyProfile
