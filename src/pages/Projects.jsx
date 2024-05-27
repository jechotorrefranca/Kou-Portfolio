import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { collection, doc, onSnapshot } from "firebase/firestore"; 
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import CTA from '../components/CTA';

const Projects = () => {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Projects'), (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);
    }, (error) => {
        console.error("Error fetching info collection: ", error);
    });

    return () => unsubscribe();
  }, []);



  return (
    <section className='max-container'>
      <h1 className='head-text text-white'>
        My <span className='rainbow-gradient_text drop-shadow-sm'>Projects</span>
      </h1>

      <div className='mt-5 flex flex-col gap-3 text-blue-100'>
        <p className=' font-sans text-m'>
          Throughout my educational journey, I have been involved in a variety of projects, 
          ranging from simple console applications to fully functional mobile applications. 
          Here are some of the most notable and impactful projects that I have contributed to 
          or developed independently.
        </p>
      </div>

      <div className='flex flex-wrap my-20 gap-16'>
        {projects.map((project) => (
          
          <div className='lg:w-[400px] w-full bg-[#13293e] p-16 rounded-xl' key={project.id}>
            <div className='block-containerr'>

              <div className='btn-frontt rounded-xl flex justify-center items-center'>
                <img src={project.imageUrl} alt={project.name} className='image'/>
              </div>
            </div>

            <div className='mt-5 flex flex-col'>
              <h4 className='text-2xl font-cocogoose text-blue-300'>
                {project.name}
              </h4>
              <p className='mt-2 font-sans text-blue-100'>
                {project.description}
              </p>
              
                <Link to={project.link} target='_blank' rel='noopener noreferrer' 
                className='font-cocogoose text-sm mt-5 flex items-center justify-center gap-2 bg-blue-800 w-fit py-3 px-5 rounded-xl text-blue-100'>
                      Link to Project
                    <FontAwesomeIcon icon={faArrowRight} color='rgb(219 234 254)'/>

                </Link>

            </div>

          </div>



        ))}

      </div>

      <hr className='border-blue-300'/>

      <CTA/>

    </section>
  )
}

export default Projects