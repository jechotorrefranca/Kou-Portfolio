import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import CTA from '../components/CTA';

const About = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log(currentUser.email);
      } else {
        console.log("User is null");
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  const [skillInfo, setSkillInfo] = useState([]);
  const [adminInfo, setAdminInfo] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [editAdmin, setEditAdmin] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newInfo, setNewInfo] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Skills'), (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSkillInfo(data);
    }, (error) => {
        console.error("Error fetching info collection: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Achievements'), (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAchievements(data);
    }, (error) => {
        console.error("Error fetching info collection: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const docRef = doc(db, 'Admin', 'v5NvvGA5zOcQVo7Oyzszq5ALoKd2');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setAdminInfo(docSnap.data());
          setNewTitle(docSnap.data().title);
          setNewInfo(docSnap.data().info);
        } else {
            console.log('No such document!');
        }
    });

    return () => {
        unsubscribe();
    };
  }, []);

  const handleEditAdmin = async () => {
    if (!editAdmin) {
      try {
        const docRef = doc(db, 'Admin', 'v5NvvGA5zOcQVo7Oyzszq5ALoKd2');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const adminData = docSnap.data();
          setNewTitle(adminData.title);
          setNewInfo(adminData.info);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching admin info: ", error);
      }
    } else {
      try {
        await updateDoc(doc(db, 'Admin', 'v5NvvGA5zOcQVo7Oyzszq5ALoKd2'), {
          title: newTitle,
          info: newInfo
        });
      } catch (error) {
        console.error("Error updating admin info: ", error);
      }
    }
    setEditAdmin(!editAdmin);
  };


  return (
    <section className='max-container'>

      <div className='flex items-center'>
        <img src={adminInfo.pfp} alt="pfp" className='w-[25%] aspect-square object-cover rounded-full mr-12'/>
        {editAdmin ? (
          <>
            <input 
              type="text" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              className='head-text text-white bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500'/>
          </>
        ) : (
          <h1 className='head-text text-white'>
            Hello, I'm <span className='rainbow-gradient_text drop-shadow-sm'>{adminInfo.title}</span>
          </h1>
        )}
      </div>

      {!editAdmin ? (
        <div className='mt-5 flex flex-col gap-3 text-blue-100'>
          <p className='font-sans text-m'>
            {adminInfo.info}
          </p>
        </div>
      ) : (
        <div className='mt-5 flex flex-col gap-3 text-blue-100'>
          <textarea rows={6}
            value={newInfo} 
            onChange={(e) => setNewInfo(e.target.value)} 
            className='font-sans text-m bg-transparent border border-blue-300 rounded p-2 focus:outline-none focus:border-blue-500 '/>
        </div>
      )}

      {user && (
        <div className='flex justify-center mt-5'>
          <div className='bg-red-400 flex-row flex justify-center items-center py-2 px-10 rounded-full cursor-pointer' onClick={handleEditAdmin}>
            <p className='pr-2 font-sans font-bold text-[#330000]'>
              {editAdmin ? 'Update' : 'Edit'}
            </p>
            <FontAwesomeIcon icon={editAdmin ? faUpload : faPencil} color='#330000'/>
          </div>
        </div>
      )}



      <div className='py-10 flex flex-col text-white'>
        <h3 className='subhead-text rainbow-gradient_text'>My Skills</h3>

        <div className='mt-16 flex flex-wrap gap-12'> 
          {skillInfo.map((skill) => (

            <div  key={skill.id}>

              <div className='block-container w-20 h-20'>

                <div className='btn-back rounded-xl'/>
                  <div className='btn-front rounded-xl flex justify-center items-center'>
                    <img src={skill.imageUrl} alt={skill.name} className='w-1/2 h-1/2 object-contain'/>
                  </div>
                </div>
                
                

                <div className='flex justify-center items-center'>
                  <div className='bg-red-400 rounded-full mt-4 w-[40%] aspect-square justify-center items-center flex cursor-pointer'>
                    <FontAwesomeIcon icon={faTrash} color='#330000'/>
                  </div>
                </div>

            </div>
          ))}
        </div>
        
        <div className='flex justify-center mt-5'>
          <div className='bg-red-400 flex-row flex justify-center items-center w-[10%] py-2 px-10 rounded-full cursor-pointer'>
            <p className='pr-2 font-sans font-bold text-[#330000]'>Add</p>
            <FontAwesomeIcon icon={faPlus} color='#330000'/>
          </div>

        </div>

      </div>

      <div className='py-16'>
        <h3 className='subhead-text rainbow-gradient_text'>Achievements</h3>

        <div className='mt-5 flex flex-col gap-3 text-blue-100'>

        <p className=' font-sans text-m'>
        Over the course of my life, I have had the privilege of achieving 
        several milestones that have significantly contributed to my personal 
        and professional growth. Each of these accomplishments reflects my dedication, 
        perseverance, and continuous pursuit of excellence.
        </p>

      </div>

      <div className='flex justify-center mt-5'>
        <div className='bg-red-400 flex-row flex justify-center items-center py-2 px-10 rounded-full cursor-pointer'>
          <p className='pr-2 font-sans font-bold text-[#330000]'>Edit</p>
          <FontAwesomeIcon icon={faPencil} color='#330000'/>
        </div>
      </div>

      <div className='mt-12 flex'>
        <VerticalTimeline>
          {achievements.map((achievement) => (
            <VerticalTimelineElement
            key={achievement.id}
            date={achievement.date}
            icon={<div className='flex justify-center items-center w-full h-full'>
              <img src={achievement.icon} alt={achievement.title} 
              className='w-[60%] h-60% object-contain'/>
            </div>}
            iconStyle={{ background: '#c4d9ed'}}
            contentStyle={{
              borderBottom: '8px',
              borderStyle: 'solid',
              borderBottomColor: '#c4d9ed',
              backgroundColor: '#13293e',
              boxShadow: 'none',

            }}
            dateClassName="text-white font-sans" 
            >
              <div className='font-cocogoose'>
                <h3 className='text-blue-300 text-xl '>
                  {achievement.title}
                </h3>

                <p className='text-blue-100 font-base' style={{margin: 0}}>
                  {achievement.place}
                </p>
              </div>

              <ul className='my-5 list-disc ml-5 space-y-2 font-poppins'>
                  <li className='text-white front-normal pl-1 text-sm font-semibold'>
                    {achievement.info}
                  </li>
              </ul>

              <div className='flex justify-center mt-5'>
                <div className='bg-red-400 flex-row flex justify-center items-center px-10 py-2 rounded-full cursor-pointer font-sans font-bold text-red-950'>
                  Edit
                  <FontAwesomeIcon icon={faPencil} color='#330000' className='ml-2'/>
                </div>
              </div>

            </VerticalTimelineElement>

            
          ))}
        </VerticalTimeline>


      </div>

      </div>

      <hr className='border-blue-300'/>

      <CTA/>
      
    </section>

    
  )
}

export default About