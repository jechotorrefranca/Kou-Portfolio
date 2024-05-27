import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../firebase';
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc, addDoc } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import CTA from '../components/CTA';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';

const Projects = () => {
  
  const [deleteProjectsId, setDeleteProjectsId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectImage, setnewProjectImage] = useState(null);
  const [newProjectName, setnewProjectName] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectDetails, setEditProjectDetails] = useState({
    name: '',
    description: '',
    link: ''
  });

  const handleEditProjects = (project) => {
    setEditProjectId(project.id);
    setEditProjectDetails({
      name: project.name,
      description: project.description,
      link: project.link
    });
  };

  const handleSaveProject = async () => {
    if (!editProjectId) return;

    try {
      await updateDoc(doc(db, 'Projects', editProjectId), {
        name: editProjectDetails.name,
        description: editProjectDetails.description,
        link: editProjectDetails.link
      });

      setEditProjectId(null);
    } catch (error) {
      console.error("Error updating project: ", error);
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
    const unsubscribe = onSnapshot(collection(db, 'Projects'), (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);
    }, (error) => {
        console.error("Error fetching projects collection: ", error);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteProject = async (project) => {
    const { id } = project;
  
    try {
        await deleteDoc(doc(db, 'Projects', id));
        setDeleteProjectsId(null);
    } catch (error) {
        console.error("Error deleting project: ", error);
    }
  };

  const handleAddProjectSubmit = async () => {
    if (newProjectImage) {
      try {
        const storageRef = ref(storage, `Projects_Picture/${newProjectImage.name}`);
        await uploadBytes(storageRef, newProjectImage);
        const downloadURL = await getDownloadURL(storageRef);
        await addDoc(collection(db, 'Projects'), {
          name: newProjectName,
          imageUrl: downloadURL,
          description: projectDescription,
          link: projectLink,
        });

        setnewProjectImage(null);
        setnewProjectName('');
        setProjectDescription('');
        setProjectLink('');
        setShowAddProjectModal(false);
      } catch (error) {
        console.error("Error adding project: ", error);
      }
    }
  };

  return (
    <section className='max-container'>
      <h1 className='head-text text-white'>
        My <span className='rainbow-gradient_text drop-shadow-sm'>Projects</span>
      </h1>

      <div className='mt-5 flex flex-col gap-3 text-blue-100'>
        <p className='font-sans text-m'>
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
              {editProjectId === project.id ? (
                <>
                  <textarea 
                    rows={3} 
                    value={editProjectDetails.name} 
                    onChange={(e) => setEditProjectDetails({ ...editProjectDetails, name: e.target.value })} 
                    className="text-area p-2 bg-transparent border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-blue-300 font-cocogoose text-xl mb-5"
                  />
                  <textarea 
                    rows={6} 
                    value={editProjectDetails.description} 
                    onChange={(e) => setEditProjectDetails({ ...editProjectDetails, description: e.target.value })}  
                    className="text-area p-2 bg-transparent border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-blue-300 font-sans mb-5"
                  />
                  <textarea 
                    rows={3} 
                    value={editProjectDetails.link} 
                    onChange={(e) => setEditProjectDetails({ ...editProjectDetails, link: e.target.value })} 
                    className="text-area p-2 bg-transparent border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-blue-300 font-sans  mb-5"
                  />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {user && (
              <div className='flex justify-center items-center'>
                <div 
                  className='bg-red-400 rounded-full w-[15%] aspect-square justify-center items-center flex cursor-pointer mt-10' 
                  onClick={() => setDeleteProjectsId({ id: project.id })}
                >
                  <FontAwesomeIcon icon={faTrash} color='#330000'/>
                </div>
              </div>
            )}

            {user && (
              <div className='flex justify-center mt-5'>
                {editProjectId === project.id ? (
                  <div className='bg-red-400 flex-row flex justify-center items-center py-2 px-10 rounded-full cursor-pointer' onClick={handleSaveProject}>
                    <p className='pr-2 font-sans font-bold text-[#330000]'>Update</p>
                    <FontAwesomeIcon icon={faUpload} color='#330000'/>
                  </div>
                ) : (
                  <div className='bg-red-400 flex-row flex justify-center items-center py-2 px-10 rounded-full cursor-pointer' onClick={() => handleEditProjects(project)}>
                    <p className='pr-2 font-sans font-bold text-[#330000]'>Edit</p>
                    <FontAwesomeIcon icon={faPencil} color='#330000'/>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {deleteProjectsId && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-cocogoose z-10 text-darkBlue-500">
            <div className="bg-darkBlue-500 p-5 rounded shadow-lg">
              <p className="text-center mb-4 text-blue-300">Do you want to proceed?</p>
              <div className="flex justify-around">
                <button 
                  className="bg-red-500 text-white                   py-2 px-4 rounded" 
                  onClick={() => handleDeleteProject(deleteProjectsId)}
                >
                  Proceed
                </button>
                <button 
                  className="bg-gray-300 py-2 px-4 rounded" 
                  onClick={() => setDeleteProjectsId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddProjectModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-cocogoose z-10 text-darkBlue-500">
            <div className="bg-darkBlue-500 p-5 rounded shadow-lg w-[75%]">
              <h2 className="text-center text-blue-300 mb-4">Add New Project</h2>
              <div className="flex flex-col gap-4">

                <input 
                  type="file" 
                  onChange={(e) => setnewProjectImage(e.target.files[0])}
                  className="file-input bg-blue-300 rounded-xl p-3 font-sans font-bold"
                />

                <textarea 
                  rows={3} 
                  value={newProjectName} 
                  onChange={(e) => setnewProjectName(e.target.value)} 
                  placeholder="Name"
                  className="text-area p-2 bg-transparent border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-blue-300 font-sans font-bold"
                />

                <textarea 
                  rows={3} 
                  value={projectDescription} 
                  onChange={(e) => setProjectDescription(e.target.value)} 
                  placeholder="Description"
                  className="text-area p-2 bg-transparent border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-blue-300 font-sans font-bold"
                />

                <textarea 
                  rows={3} 
                  value={projectLink} 
                  onChange={(e) => setProjectLink(e.target.value)} 
                  placeholder="Link"
                  className="text-area p-2 bg-transparent border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-blue-300 font-sans font-bold"
                />

                <div className="flex justify-between">
                  <button 
                    className="bg-gray-300 py-2 px-4 rounded" 
                    onClick={() => setShowAddProjectModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="bg-red-500 text-white py-2 px-4 rounded" 
                    onClick={handleAddProjectSubmit}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {user && (
        <div className='flex mt-5 items-center justify-center mb-10'>
          <div className='bg-red-400 flex-row flex justify-center items-center py-2 px-10 rounded-full cursor-pointer' onClick={() => setShowAddProjectModal(true)}>
            <p className='pr-2 font-sans font-bold text-[#330000]'>Add Project</p>
            <FontAwesomeIcon icon={faPlus} color='#330000'/>
          </div>
        </div>
      )}

      <hr className='border-blue-300'/>
      <CTA/>

    </section>
  )
}

export default Projects;

