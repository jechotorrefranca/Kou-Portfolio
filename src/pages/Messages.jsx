import { collection, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const Messages = () => {
  const [message, setMessage] = useState([]);
  const [readData, setReadData] = useState([]);
  const [istoggled, setIstoggled] = useState(true);

  useEffect(() => {
    // Create a query to filter messages where isRead is false
    const messagesQuery = query(collection(db, 'Messages'), where('isRead', '==', false));

    // Subscribe to the query
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessage(data);
    }, (error) => {
      console.error("Error fetching messages collection: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Create a query to filter messages where isRead is false
    const messagesQuery = query(collection(db, 'Messages'), where('isRead', '==', true));

    // Subscribe to the query
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReadData(data);
    }, (error) => {
      console.error("Error fetching messages collection: ", error);
    });

    return () => unsubscribe();
  }, []);

  const handleSetRead = async (id) => {
    const messageRef = doc(db, 'Messages', id);
    try {
      await updateDoc(messageRef, {
        isRead: true
      });
      console.log(`Message with ID: ${id} marked as read`);
    } catch (error) {
      console.error("Error updating message: ", error);
    }
  };

  return (
    <section className='max-container h-full'>
      <div className=''>
        <div className='bg-black-500 h-[85vh] rounded-xl'>
          <div className='flex justify-center items-center'>
            <p className='font-cocogoose p-10 absolute mt-[75px] text-[40px] text-blue-300'>MESSAGES</p>
          </div>
          <div className='flex justify-around mt-5'>
            <div className='bg-blue-300 py-4 px-10 rounded-full font-cocogoose mt-10 cursor-pointer' onClick={() => setIstoggled(true)}>
              <p>Unread</p>
            </div>

            <div className='bg-blue-300 py-4 px-10 rounded-full font-cocogoose mt-10 cursor-pointer' onClick={() => setIstoggled(false)}>
              <p>Read</p> 
            </div>

          </div>
          <div className='flex mt-5 items-center justify-center'>
            <div className='bg-blue-300 w-[90%] h-[65vh] rounded-xl justify-center overflow-scroll'>


            {istoggled ? message.map((msg) => (
                                <div className='m-4 pr-2 bg-blue-600 w-[95%] h-[200px] rounded-2xl py-3 px-10 justify-start items-center font-cocogoose text-darkBlue-500' key={msg.id}>
                                <div className='flex-row flex items-center justify-between'>
                                  <div className='bg-blue-100 w-fit px-4 py-2 rounded-md z-10'>
                                    <p className=''>{msg.name}</p>
                                    <p className='font-sans font-semibold text-sm'>{msg.email}</p>
                                  </div>
            
              
                                      <div className='mr-10'>
              
                                      <div className='btn cursor-pointer' onClick={() => handleSetRead(msg.id)}>
                                      <p className='text-[10px]'>Mark as read</p>
                                      </div>
                                      </div>

                                </div>
                                <div className='ml-8 font-sans font-semibold bg-slate-100 p-2 rounded-sm h-[100px] overflow-scroll'>
                                  <p>{msg.message}</p>
                                </div>
                              </div>
            
            )) : readData.map((msg) => (
                <div className='m-4 pr-2 bg-blue-600 w-[95%] h-[200px] rounded-2xl py-3 px-10 justify-start items-center font-cocogoose text-darkBlue-500' key={msg.id}>
                <div className='flex-row flex items-center justify-between'>
                  <div className='bg-blue-100 w-fit px-4 py-2 rounded-md z-10'>
                    <p className=''>{msg.name}</p>
                    <p className='font-sans font-semibold text-sm'>{msg.email}</p>
                  </div>
                </div>
                <div className='ml-8 font-sans font-semibold bg-slate-100 p-2 rounded-sm h-[100px] overflow-scroll'>
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Messages;
