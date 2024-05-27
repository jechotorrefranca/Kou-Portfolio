import React, { useState } from 'react';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      console.log('Login successful:', user.email);
      showAlert({ show: true, text: 'Logged In Successfully!', type: 'success' });
      setIsLoading(false);

      setTimeout(() => {
        hideAlert();
        setForm({ email: '', password: '' });
        navigate('/');
      }, 1500);

    } catch (error) {
      console.log('Login error:', error.message);
      setIsLoading(false);
      showAlert({ show: true, text: 'Wrong Email or Password', type: 'danger' });

      setTimeout(() => {
        hideAlert();
      }, 1500);
    }
  };

  return (
    <section className='relative flex lg:flex-row flex-col max-container font-sans text-blue-300 h-screen items-center'>

      {alert.show && <Alert {...alert} />}

      <div className='flex-1 min-w-[70%] flex flex-col bg-darkBlue-500 px-28 py-16 rounded-2xl items-center justify-center'>

        <h1 className='head-text'>Log In</h1>

        <form className='w-full flex flex-col gap-7 mt-14' onSubmit={handleLogin}>

          <label className='font-bold text-xl'>
            Email
            <input type="email" name="email" className='input' required value={form.email} onChange={handleChange} />
            <p></p>
          </label>

          <label className='font-bold text-xl'>
            Password
            <input type="password" name="password" className='input' required value={form.password} onChange={handleChange} />
            <p></p>
          </label>

          <button type='submit' className='btn' disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

        </form>

      </div>

    </section>
  );
}

export default Login;
