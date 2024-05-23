import React from 'react'

import character from '../assets/3D/Animated Platformer Character.glb'
import { useGLTF } from '@react-three/drei'

const Person = ({ isRotating, ...props }) => {
    const { scene, animations } = useGLTF(character);
  return (
    <mesh {...props}>
        <primitive object={scene}/>
    </mesh>
  )
}

export default Person 