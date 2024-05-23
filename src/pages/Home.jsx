import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Loader from '../components/Loader'
import Island from '../models/Island'
import Sky from '../models/Sky'
import Person from '../models/Person'
import HomeInfo from '../components/HomeInfo'

const Home = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);

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

    if(window.innerWidth < 768) {
      screenScale = [0.33, 0.33, 0.33];
      screenPosition = [-0.7, -1.4, -1.8];
    } else {
      screenScale = [1, 1, 1];
      screenPosition = [-1.9, -2, -3.9]; //x y z
    }

    return [screenScale, screenPosition]
  }

  const [islandScale, islandPosition] = adjustIslandForScreenSize();
  const [charScale, charPosition] = adjustCharacterForScreenSize();

  return (
    <section className='w-full h-screen relative'>

    <div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center'>
      {currentStage && <HomeInfo currentStage={currentStage}/>}
    </div>

      <Canvas className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`} 
        camera={{near: 0.1, far: 1000}}>

        <Suspense fallback={<Loader />}>
          <directionalLight position={[-100, 150, -100]} intensity={1}/>
          <ambientLight intensity={1.5}/>
          {/* <pointLight />
          <spotLight/> */}
          <hemisphereLight skyColor='#b1e1ff' groundColor='#000000' intensity={2}/>

          <Sky isRotating={isRotating}/>
          
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

    </section>
  )
}

export default Home