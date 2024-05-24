import React, { useRef, useState } from 'react'

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({name: '', message: ''})
  const [email, setEMail] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})

  };

  const handleFocus = () => {

  };

  const handleBlur = () => {

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

  };

  return (
    <section className='relative flex lg:flex-row flex-col max-container font-sans text-blue-300'>

      <div className='flex-1 min-w-[50%] flex flex-col'>

        <h1 className='head-text text-blue-300'>Contact Me!</h1>

        <form className='w-full flex flex-col gap-7 mt-14'
          onSubmit={handleSubmit}
        >

          <label className=' font-bold text-xl '>
            Name
            <input type="text" name="name" className='input' placeholder='John Doe' required value={form.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}/><p></p>
            <p>{form.name}</p>
          </label>
          
          <label className=' font-bold text-xl'>
            Email: {email}

          </label>

          <label className='font-bold text-xl'>
            Message
            <textarea name="message" rows={4} className='textarea' placeholder='Your Message' required value={form.message} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}/>
            <p>{form.message}</p>
          </label>

          <button type='submit' className='btn' disabled={isLoading} onFocus={handleFocus} onBlur={handleBlur}>
            {isLoading? 'Sending Message...' : 'Send Message'}
          </button>


        </form>

      </div>

    </section>
  )
}

export default Contact