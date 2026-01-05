import axios from 'axios';
import React, { useContext, useState } from 'react';
import { InfluencerContext } from '../context/InfluencerContext';
import { AdminContext } from '../context/AdminContext';
import NotificationCard from '../components/NotificationCard';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // <-- import icons

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [notification, setNotification] = useState({ type: '', title: '', message: '', show: false });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { setIToken } = useContext(InfluencerContext);
  const { setAToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(
          backendUrl + '/api/admin/login',
          { email, password }
        );

        if (data.success) {
          setAToken(data.token);
          localStorage.setItem('aToken', data.token);
          setNotification({ type: 'success', title: 'Success!', message: 'Admin logged in successfully', show: true });
        } else {
          setNotification({ type: 'error', title: 'Error!', message: data.message, show: true });
        }
      } else {
        const { data } = await axios.post(
          backendUrl + '/api/influencer/login',
          { email, password }
        );

        if (data.success) {
          setIToken(data.token);
          localStorage.setItem('iToken', data.token);
          setNotification({ type: 'success', title: 'Success!', message: 'Influencer logged in successfully', show: true });
        } else {
          setNotification({ type: 'error', title: 'Error!', message: data.message, show: true });
        }
      }
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', title: 'Error!', message: 'Login failed. Please try again.', show: true });
    }
  };

  return (
    <>
      {notification.show && (
        <NotificationCard
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
          <p className='text-2xl font-semibold m-auto'>
            <span className='text-primary'>{state}</span> Login
          </p>

          <div className='w-full'>
            <p>Email</p>
            <input
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type="email"
              required
            />
          </div>

          <div className='w-full relative'>
            <p>Password</p>
            <input
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='border border-[#DADADA] rounded w-full p-2 mt-1 pr-10'
              type={showPassword ? 'text' : 'password'}
              required
            />
            {/* Eye icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-2 top-7 text-gray-500'
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
            Login
          </button>

          {state === 'Admin' ? (
            <p>
              Influencer Login?{' '}
              <span
                onClick={() => setState('Influencer')}
                className='text-primary underline cursor-pointer'
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Admin Login?{' '}
              <span
                onClick={() => setState('Admin')}
                className='text-primary underline cursor-pointer'
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </>
  );
};

export default Login;