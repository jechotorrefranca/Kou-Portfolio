import React, { Suspense, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { Canvas } from '@react-three/fiber';
import { db } from '../firebase';
import Doggy from '../models/Doggy'
import Loader from '../components/Loader';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import { addDoc, collection } from 'firebase/firestore';

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({name: '', email: '', message: ''})
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('AnimalArmature|Idle');

  const { alert, showAlert, hideAlert } = useAlert();

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  };

  const handleFocus = () => setCurrentAnimation('AnimalArmature|Walk');

  const handleBlur = () => setCurrentAnimation('AnimalArmature|Idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentAnimation('AnimalArmature|Gallop_Jump');
  
    try {

  
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: 'Jecho Torrefranca',
          from_email: form.email,
          to_email: 'jechotorrefranca@gmail.com',
          message: form.message
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );

      await addMessage();
  
      setIsLoading(false);
      showAlert({ show: true, text: 'Message sent successfully!', type: 'success' });
  
      setTimeout(() => {
        hideAlert();
        setCurrentAnimation('AnimalArmature|Idle');
        setForm({ name: '', email: '', message: '' });
      }, 1500);

    } catch (error) {
      setIsLoading(false);
      setCurrentAnimation('AnimalArmature|Death');
      console.log(error);
      showAlert({ show: true, text: 'Something went wrong', type: 'danger' });
  
      setTimeout(() => {
        hideAlert();
        setCurrentAnimation('AnimalArmature|Idle');
      }, 3000);
    }
  };
  
  const addMessage = async () => {
    try {
      await addDoc(collection(db, 'Messages'), { 
        name: form.name,
        email: form.email,
        message: form.message,
        isRead: false });
    } catch (error) {

      console.error('Error adding user:', error);
      throw error;
    }
  };
  

  return (
    <section className='relative flex lg:flex-row flex-col max-container font-sans text-blue-300 h-[100vh]'>

      {alert.show && <Alert {...alert}/>}

      <div className='flex-1 min-w-[50%] flex flex-col'>

        <h1 className='head-text'>Contact Me!</h1>

        <form className='w-full flex flex-col gap-7 mt-14'
          onSubmit={handleSubmit}
        >

          <label className=' font-bold text-xl '>
            Name
            <input type="text" name="name" className='input' placeholder='John Doe' required value={form.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}/><p></p>
          </label>
          

          <label className=' font-bold text-xl '>
            Email
            <input type="email" name="email" className='input' placeholder='JohnDoe@email.com' required value={form.email} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}/><p></p>
          </label>

          <label className='font-bold text-xl'>
            Message
            <textarea name="message" rows={4} className='textarea' placeholder='Your Message' required value={form.message} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}/>
          </label>

          <button type='submit' className='btn' disabled={isLoading} onFocus={handleFocus} onBlur={handleBlur}>
            {isLoading? 'Sending Message...' : 'Send Message'}
          </button>


        </form>

      </div>

      <div className='lg:w1/2 w-full lg:h-auto md:h-[550px] h-[350px]'>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000
          }}
          >
            <directionalLight intensity={4.5} position={[0, 0, 1]}/>
            <ambientLight intensity={1}/>
            <Suspense fallback={<Loader/>}>
              <Doggy
                currentAnimation={currentAnimation}
                position={[0.5, -0.8, 0]} 
                rotation={[13, -0.8, 0]}
                scale={[0.8, 0.8, 0.8]}
              />
            </Suspense>
        </Canvas>
      </div>

    </section>
  )
}

export default Contact