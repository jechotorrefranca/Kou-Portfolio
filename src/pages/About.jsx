import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc, addDoc } from "firebase/firestore"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faUpload, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import CTA from '../components/CTA';

const About = () => {
  const [file, setFile] = useState("");
  const [user, setUser] = useState(null);
  const [skillInfo, setSkillInfo] = useState([]);
  const [adminInfo, setAdminInfo] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [editAdmin, setEditAdmin] = useState(false);
  const [editAchievements, setEditAchievements] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newInfo, setNewInfo] = useState('');
  const [deleteSkillId, setDeleteSkillId] = useState(null);
  const [deleteAchievementId, setdeleteAchievementId] = useState(null);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillImage, setNewSkillImage] = useState(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newAchievementInfoTwo, setNewAchievementInfoTwo] = useState('');
  const [newAchievementInfo, setNewAchievementInfo] = useState('');
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);
  const [newAchievementTitle, setNewAchievementTitle] = useState('');
  const [newAchievementPlace, setNewAchievementPlace] = useState('');
  const [newAchievementData, setNewAchievementData] = useState('');
  const [editedAchievement, setEditedAchievement] = useState({
    id: '', // Initialize with an empty string
    title: '',
    info: '',
    place: '',
    date: ''
  });

  const [editedAchievementId, setEditedAchievementId] = useState(null);


  const handleEditAchievements = async () => {
    if (!editAchievements) {
      // Switch to edit mode
      setEditAchievements(true);
    } else {
      // Switch to submit mode
      try {
        // Update the achievementInfo in Firestore
        await updateDoc(doc(db, 'Admin', 'v5NvvGA5zOcQVo7Oyzszq5ALoKd2'), {
          achievementInfo: newAchievementInfo
        });
        // Exit submit mode and switch back to edit mode
        setEditAchievements(false);
      } catch (error) {
        console.error("Error updating achievements: ", error);
      }
    }
  };
  

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

  useEffect(() => {
    const docRef = doc(db, 'Admin', 'v5NvvGA5zOcQVo7Oyzszq5ALoKd2');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const adminData = docSnap.data();
        setAdminInfo(adminData);
        setNewTitle(adminData.title);
        setNewInfo(adminData.info);
        setNewAchievementInfo(adminData.achievementInfo); // Set newAchievementInfo here
      } else {
        console.log('No such document!');
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  

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

  const handleEditAchievement = async (achievementId) => {
    // Find the achievement being edited
    const achievementToEdit = achievements.find((achievement) => achievement.id === achievementId);
    // Set the achievement being edited in state
    setEditedAchievement(achievementToEdit);
    // Toggle edit mode for this achievement
    setEditedAchievementId(achievementId);
  };

  const handleUpdateAchievement = async () => {
    try {
      // Update the achievement in Firestore
      await updateDoc(doc(db, 'Achievements', editedAchievementId), {
        title: editedAchievement.title,
        info: editedAchievement.info,
        place: editedAchievement.place,
        date: editedAchievement.date
      });
      // Clear the edited achievement and edited achievement ID from state
      setEditedAchievement(null);
      setEditedAchievementId(null);
    } catch (error) {
      console.error("Error updating achievement: ", error);
    }
  };

  const handleAchievementFieldChange = (field, value) => {
    // Update the edited achievement with the new value
    setEditedAchievement((prevAchievement) => ({
      ...prevAchievement,
      [field]: value
    }));
  };

  const handleChangePic = async () => {
    console.log("skillimg", newSkillImage);

    if (newSkillImage) {
        try {

            // Create a reference to the location where the file should be uploaded
            const storageRef = ref(storage, newSkillImage.name);

            // Upload file to Firebase Storage
            await uploadBytes(storageRef, newSkillImage);

            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(storageRef);

            // Add skill to Firestore with the download URL
            await updateDoc(doc(db, 'Admin', 'v5NvvGA5zOcQVo7Oyzszq5ALoKd2'), {
                pfp: downloadURL
            });

            setNewSkillImage(null);
        } catch (error) {
            console.error("Error adding skill: ", error);
        }
    }
};

  const handleDelete = async (skill) => {
    const { id, name } = skill;

    console.log('please work', name);
    try {
        // Delete document from Firestore
        await deleteDoc(doc(db, 'Skills', id));
        
        // Delete picture from Firebase Storage
        const pictureRef = ref(storage, `Skills_Picture/${name}`);
        
        try {
            await deleteObject(pictureRef);
            console.log(`Picture for skill ${name} deleted successfully.`);
        } catch (storageError) {
            if (storageError.code === 'storage/object-not-found') {
                console.log(`Picture for skill ${name} already deleted or does not exist.`);
            } else {
                throw storageError; // Re-throw other storage errors
            }
        }
        
        setDeleteSkillId(null);
    } catch (error) {
        console.error("Error deleting skill: ", error);
    }
};

const handleDeleteAchievement = async (achievement) => {
  const { id } = achievement;

  try {
      // Delete document from Firestore
      await deleteDoc(doc(db, 'Achievements', id));

      setdeleteAchievementId(null);
      
  } catch (error) {
      console.error("Error deleting skill: ", error);
  }
};

  const handleAddSkills = () => {
    setShowAddSkillModal(true);
  };
  
  const handleAddSkillSubmit = async () => {
    console.log("skillimg", newSkillImage);

    if (newSkillImage) {
        try {

            // Create a reference to the location where the file should be uploaded
            const storageRef = ref(storage, `Skills_Picture/${newSkillImage.name}`);

            // Upload file to Firebase Storage
            await uploadBytes(storageRef, newSkillImage);

            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(storageRef);

            // Add skill to Firestore with the download URL
            await addDoc(collection(db, 'Skills'), {
                name: newSkillImage.name,
                imageUrl: downloadURL
            });

            setNewSkillImage(null);
            setNewSkillName('');
            setShowAddSkillModal(false);
        } catch (error) {
            console.error("Error adding skill: ", error);
        }
    }
};

const handleAddAchievements = async () => {

  console.log(newSkillImage);

  if (newSkillImage) {
      try {

          // Create a reference to the location where the file should be uploaded
          const storageRef = ref(storage, `Achievements_Picture/${newSkillImage.name}`);

          // Upload file to Firebase Storage
          await uploadBytes(storageRef, newSkillImage);

          // Get the download URL of the uploaded image
          const downloadURL = await getDownloadURL(storageRef);

          // Add skill to Firestore with the download URL
          await addDoc(collection(db, 'Achievements'), {
              icon: downloadURL,
              date: newAchievementData, 
              info: newAchievementInfoTwo,
              place: newAchievementPlace,
              title: newAchievementTitle
          });

          setNewSkillImage(null);
          setShowAddAchievementModal(false)
          setNewAchievementTitle('');
          setNewAchievementInfoTwo('');
          setNewAchievementPlace('');
          setNewAchievementData('');

      } catch (error) {
          console.error("Error adding skill: ", error);
      }
  }
};

const handleAddMoreAchievements = () => {
  setShowAddAchievementModal(true);
};


  return (
    <section className='max-container'>
              {user &&(

              <div className='mb-12'>
                <p className='font-cocogoose text-blue-300'>Change Profile Picture</p>
                
                <input 
                type="file" 
                onChange={(e) => {
                  setNewSkillImage(e.target.files[0]);
                  handleChangePic();
                }}
                className="file-input bg-blue-300 rounded-xl p-3 font-sans font-bold"
              />
                
              </div>
              )}


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
            <div key={skill.id}>
              <div className='block-container w-20 h-20'>
                <div className='btn-back rounded-xl'/>
                <div className='btn-front rounded-xl flex justify-center items-center'>
                  <img src={skill.imageUrl} alt={skill.name} className='w-1/2 h-1/2 object-contain'/>
                </div>
              </div>

              {user &&(
                <div className='flex justify-center items-center'>
                  <div 
                    className='bg-red-400 rounded-full mt-4 w-[40%] aspect-square justify-center items-center flex cursor-pointer' 
                    onClick={() => setDeleteSkillId({ id: skill.id, name: skill.name })}


                  >
                    <FontAwesomeIcon icon={faTrash} color='#330000'/>
                  </div>
                </div>
              )}
            </div>
          ))}
          
        </div>

        {user && (
          <div className='flex justify-center mt-5'>
            <div className='bg-red-400 flex-row flex justify-center items-center py-2 px-10 rounded-full cursor-pointer' onClick={handleAddSkills}>
              <p className='pr-2 font-sans font-bold text-[#330000]'>Add Skill</p>
              <FontAwesomeIcon icon={faPlus} color='#330000'/>
            </div>
          </div>
        )}
      </div>

      {deleteSkillId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-cocogoose z-10 text-darkBlue-500">
          <div className="bg-darkBlue-500 p-5 rounded shadow-lg">
            <p className="text-center mb-4 text-blue-300">Do you want to proceed?</p>
            <div className="flex justify-around">
              <button 
                className="bg-red-500 text-white py-2 px-4 rounded" 
                onClick={() => handleDelete(deleteSkillId)}
              >
                Proceed
              </button>
              <button 
                className="bg-gray-300 py-2 px-4 rounded" 
                onClick={() => setDeleteSkillId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddSkillModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-cocogoose z-10 text-darkBlue-500">
          <div className="bg-darkBlue-500 p-5 rounded shadow-lg w-[75%]">
            <h2 className="text-center text-blue-300 mb-4">Add New Skill</h2>
            <div className="flex flex-col gap-4">

              <input 
                type="file" 
                onChange={(e) => setNewSkillImage(e.target.files[0])}
                className="file-input bg-blue-300 rounded-xl p-3 font-sans font-bold"
              />

              <textarea 
                rows={3} 
                value={newSkillName} 
                onChange={(e) => setNewSkillName(e.target.value)} 
                placeholder="Enter skill name"
                className="text-area p-2 bg-transparent border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-blue-300 font-sans font-bold"
              />
              
              <div className="flex justify-between">
                <button 
                  className="bg-gray-300 py-2 px-4 rounded" 
                  onClick={() => setShowAddSkillModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="bg-red-500 text-white py-2 px-4 rounded" 
                  onClick={handleAddSkillSubmit}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='py-16'>
        <h3 className='subhead-text rainbow-gradient_text'>Achievements</h3>

        {!editAchievements ? (
  <div className='mt-5 flex flex-col gap-3 text-blue-100'>
    <p className=' font-sans text-m'>
      {adminInfo.achievementInfo}
    </p>
  </div>
) : (
  <div className='mt-5 flex flex-col gap-3 text-blue-100'>
    <textarea
      rows={6}
      value={newAchievementInfo}
      onChange={(e) => setNewAchievementInfo(e.target.value)}
      className='font-sans text-m bg-transparent border border-blue-300 rounded p-2 focus:outline-none focus:border-blue-500 '
    />
  </div>
)}

{user && (
  <div className='flex justify-center mt-5'>
    <div className='bg-red-400 flex-row flex justify-center items-center py-2 px-10 rounded-full cursor-pointer' onClick={handleEditAchievements}>
      <p className='pr-2 font-sans font-bold text-[#330000]'>
        {editAchievements ? 'Update' : 'Edit'}
      </p>
      <FontAwesomeIcon icon={editAchievements ? faUpload : faPencil} color='#330000'/>
    </div>
  </div>
)}


<div className='mt-12 flex'>
        <VerticalTimeline>
          {achievements.map((achievement) => (
            <VerticalTimelineElement
              key={achievement.id}
              date={editedAchievement && editedAchievement.id === achievement.id ? (

                <textarea
                  value={editedAchievement.date}
                  onChange={(e) => handleAchievementFieldChange('date', e.target.value)}
                  className='font-sans bg-transparent border border-blue-300 rounded p-2 focus:outline-none focus:border-blue-500'
                />
              ) : (
                achievement.date
              )}
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
                <h3 className='text-blue-300 text-xl'>
                  {editedAchievementId === achievement.id ? (
                    <textarea
                      value={editedAchievement.title}
                      onChange={(e) => handleAchievementFieldChange('title', e.target.value)}
                      className='font-sans bg-transparent border border-blue-300 rounded p-2 focus:outline-none focus:border-blue-500'
                    />
                  ) : (
                    achievement.title
                  )}
                </h3>
                <p className='text-blue-100 font-base' style={{ margin: 0 }}>
                  {editedAchievementId === achievement.id ? (
                    <textarea
                      value={editedAchievement.place}
                      onChange={(e) => handleAchievementFieldChange('place', e.target.value)}
                      className='font-sans bg-transparent border border-blue-300 rounded p-2 focus:outline-none focus:border-blue-500'
                    />
                  ) : (
                    achievement.place
                  )}
                </p>
              </div>

              <ul className='my-5 list-disc ml-5 space-y-2 font-poppins'>
                <li className='text-white front-normal pl-1 text-sm font-semibold'>
                  {editedAchievementId === achievement.id ? (
                    <textarea
                      value={editedAchievement.info}
                      onChange={(e) => handleAchievementFieldChange('info', e.target.value)}
                      className='font-sans bg-transparent border border-blue-300 rounded p-2 focus:outline-none focus:border-blue-500'
                    />
                  ) : (
                    achievement.info
                  )}
                </li>
              </ul>

              

              {user && (
                <div className='flex justify-center mt-5'>
                  {editedAchievementId === achievement.id ? (
                    <div
                      className='bg-red-400 flex-row flex justify-center items-center px-10 py-2 rounded-full cursor-pointer font-sans font-bold text-red-950'
                      onClick={handleUpdateAchievement}
                    >
                      Update
                      <FontAwesomeIcon icon={faUpload} color='#330000' className='ml-2' />
                    </div>
                  ) : (
                    <div
                      className='bg-red-400 flex-row flex justify-center items-center px-10 py-2 rounded-full cursor-pointer font-sans font-bold text-red-950'
                      onClick={() => handleEditAchievement(achievement.id)}
                    >
                      Edit
                      <FontAwesomeIcon icon={faPencil} color='#330000' className='ml-2' />
                    </div>
                  )}
                </div>
              )}

              {user &&(
                <div className='flex justify-center items-center'>
                  <div 
                    className='bg-red-400 rounded-full mt-4 w-[10%] aspect-square justify-center items-center flex cursor-pointer' 
                    onClick={() => setdeleteAchievementId({ id: achievement.id })}


                  >
                    <FontAwesomeIcon icon={faTrash} color='#330000'/>
                  </div>
                </div>
              )}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
      </div>

      {deleteAchievementId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-cocogoose z-10 text-darkBlue-500">
          <div className="bg-darkBlue-500 p-5 rounded shadow-lg">
            <p className="text-center mb-4 text-blue-300">Do you want to proceed?</p>
            <div className="flex justify-around">
              <button 
                className="bg-red-500 text-white py-2 px-4 rounded" 
                onClick={() => handleDeleteAchievement(deleteAchievementId)}
              >
                Proceed
              </button>
              <button 
                className="bg-gray-300 py-2 px-4 rounded" 
                onClick={() => setdeleteAchievementId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {user && (
          <div className='flex justify-center mb-12'>
            <div className='bg-red-400 flex-row flex justify-center items-center py-2 px-10 rounded-full cursor-pointer' onClick={handleAddMoreAchievements}>
              <p className='pr-2 font-sans font-bold text-[#330000]'>Add Achievements</p>
              <FontAwesomeIcon icon={faPlus} color='#330000'/>
            </div>
          </div>
        )}

      <div className='text-blue-300 items-center justify-center font-cocogoose mb-6 bg-black-500 p-5 rounded-2xl'>
        <div className='items-center justify-center'>
                <p className='p-5 text-center'>For further details about my professional background and experience, please view my Curriculum Vitae.</p>
        </div>
                
  
        <div className='justify-center items-center flex'>
          <a href="https://firebasestorage.googleapis.com/v0/b/kouportofilio.appspot.com/o/KouCV.pdf?alt=media&token=7bf48749-62df-4f46-a087-7d2972796520" target='_blank'>
            <FontAwesomeIcon icon={faFileInvoice} color='#330000' className='btn size-7'/>
          </a>

        </div>
        
      </div>
      {showAddAchievementModal && (
        <div className='flex fixed inset-0 items-center justify-center bg-black bg-opacity-50 z-50 font-cocogoose  text-blue-300'>
          <div className='bg-darkBlue-500 p-8 rounded-lg shadow-lg w-[90vh]'>
            <div className='flex justify-center'>
              <h2 className='text-xl mb-4'>Add New Achievement</h2>

            </div>
            <input
              type="file"
              onChange={(e) => setNewSkillImage(e.target.files[0])}
              className='mb-4 bg-blue-300 p-4 w-[100%] text-darkBlue-500 rounded-2xl'
            />
            <input
              type='text'
              placeholder='Title'
              value={newAchievementTitle}
              onChange={(e) => setNewAchievementTitle(e.target.value)}
              className='mb-4 p-2 border rounded w-full bg-darkBlue-500 font-poppins font-bold'
            />
            <textarea
              placeholder='Info'
              value={newAchievementInfoTwo}
              onChange={(e) => setNewAchievementInfoTwo(e.target.value)}
              className='mb-4 p-2 border rounded w-full bg-darkBlue-500 font-poppins font-bold'
            />
            <input
              type='text'
              placeholder='Place'
              value={newAchievementPlace}
              onChange={(e) => setNewAchievementPlace(e.target.value)}
              className='mb-4 p-2 border rounded w-full bg-darkBlue-500 font-poppins font-bold'
            />
            <input
              type='text'
              placeholder='Date'
              value={newAchievementData}
              onChange={(e) => setNewAchievementData(e.target.value)}
              className='mb-4 p-2 border rounded w-full bg-darkBlue-500 font-poppins font-bold'
            />
            
            <div className='flex justify-between'>
              <button
                className='bg-gray-500 text-white px-4 py-2 rounded mr-2'
                onClick={() => setShowAddAchievementModal(false)}
              >
                Cancel
              </button>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded'
                onClick={handleAddAchievements}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <hr className='border-blue-300'/>


      <CTA/>
    </section>
  );
};

export default About;
