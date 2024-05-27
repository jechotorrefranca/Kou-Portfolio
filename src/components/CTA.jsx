import React from 'react'
import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <section className='cta font-cocogoose'>
        <p className='cta-text'>Want to reach out to me?
        <br className='sm:block hidden'/>
        Send me a Message!

        </p>
        <Link to="/contact" className='btn'>
            Contact
        </Link>
    </section>
  )
}

export default CTA