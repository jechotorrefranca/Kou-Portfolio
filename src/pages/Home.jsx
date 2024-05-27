import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Loader from '../components/Loader'
import Island from '../models/Island'
import Sky from '../models/Sky'
import Person from '../models/Person'
import HomeInfo from '../components/HomeInfo'
import music from '../assets/music/massobeats - lush (freetouse.com).mp3'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeXmark, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
  const audioRef = useRef(new Audio(music));
  audioRef.current.volume = 0.2;
  audioRef.current.loop = true;

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;

    const handleInteraction = () => {
      if (isPlayingMusic) {
        audio.play().catch(error => {
          console.log('Autoplay failed:', error);
        });
      }
      document.removeEventListener('click', handleInteraction);
    };

    if (isPlayingMusic) {
      audio.play().catch(error => {
        console.log('Autoplay failed, waiting for user interaction:', error);
        document.addEventListener('click', handleInteraction);
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      document.removeEventListener('click', handleInteraction);
    };
  }, [isPlayingMusic]);

  const adjustIslandForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [3, 3, 3];
      screenPosition = [0, -6.5, -43.4];
    } else {
      screenScale = [5, 5, 5];
      screenPosition = [1, -4.5, -43.4];
    }

    return [screenScale, screenPosition];
  };

  const adjustCharacterForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.33, 0.33, 0.33];
      screenPosition = [-0.7, -1.4, -1.8];
    } else {
      screenScale = [1, 1, 1];
      screenPosition = [-1.9, -2, -3.9]; //x y z
    }

    return [screenScale, screenPosition];
  };

  const [islandScale, islandPosition] = adjustIslandForScreenSize();
  const [charScale, charPosition] = adjustCharacterForScreenSize();

  return (
    <section className='w-full h-screen relative'>
      <div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center'>
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[-100, 150, -100]} intensity={1} />
          <ambientLight intensity={1.5} />
          <hemisphereLight skyColor='#b1e1ff' groundColor='#000000' intensity={2} />

          <Sky isRotating={isRotating} />

          <Person
            isRotating={isRotating}
            scale={charScale}
            position={charPosition}
            rotation={[0, 20.2, 6.5]}
          />

          <Island
            position={islandPosition}
            scale={islandScale}
            setCurrentStage={setCurrentStage}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            rotation={[0.1, 4.7077, 0]}
          />
        </Suspense>
      </Canvas>

      <div className='absolute bottom-2 left-2'>
        <div
          className='bg-[#00060c] rounded-full p-6 flex justify-center items-center cursor-pointer object-contain'
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
        >
          {isPlayingMusic ? (
            <FontAwesomeIcon icon={faVolumeHigh} className='w-6 h-6 text-blue-300' />
          ) : (
            <FontAwesomeIcon icon={faVolumeXmark} className='w-6 h-6 text-blue-300' />
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
