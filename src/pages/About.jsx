import React from 'react'

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import { skills, experiences } from '../constants'

const About = () => {
  return (
    <section className='max-container'>
      <h1 className='head-text text-white'>
        Hello, I'm <span className='rainbow-gradient_text pl-3 drop-shadow-sm'> Kou</span>
      </h1>

      <div className='mt-5 flex flex-col gap-3 text-blue-100'>
        <p className=' font-sans text-m'>
        My name is Jecho Torrefranca, and I am a second-year Computer Science 
        student with aspirations of becoming an indie game developer. 
        I go by the username "Kou" in various games and platforms, 
        a moniker derived from "Kouji" which is a play on my real name.
        <br />
        I am dedicated to exploring a wide range of fields to prepare myself for a successful future in game development. I consistently strive to deliver my best performance in every task assigned to me, demonstrating my commitment to excellence and continuous improvement.
        </p>
      </div>

      <div className='py-10 flex flex-col text-white'>
        <h3 className='subhead-text rainbow-gradient_text'>My Skills</h3>

        <div className='mt-16 flex flex-wrap gap-12'> 
          {skills.map((skill) => (
            <div className='block-container w-20 h-20'>
              <div className='btn-back rounded-xl'/>
              <div className='btn-front rounded-xl flex justify-center items-center'>
                <img src={skill.imageUrl} alt={skill.name} className='w-1/2 h-1/2 object-contain'/>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className='py-16'>
        <h3 className='subhead-text rainbow-gradient_text'>Work Experience</h3>

        <div className='mt-5 flex flex-col gap-3 text-blue-100'>

        <p className=' font-sans text-m'>
        Over the course of my life, I have had the privilege of achieving 
        several milestones that have significantly contributed to my personal 
        and professional growth. Each of these accomplishments reflects my dedication, 
        perseverance, and continuous pursuit of excellence.
        </p>

      </div>

      <div className='mt-12 flex'>
        <VerticalTimeline>
          {experiences.map((experience) => (
            <VerticalTimelineElement>
              <div>
                <p>cdsn,s</p>
              </div>

            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>


      </div>

      </div>
      
    </section>

    
  )
}

export default About