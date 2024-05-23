import React, { useEffect, useRef } from 'react'

import character from '../assets/3D/Animated Platformer Character.glb'
import { useAnimations, useGLTF } from '@react-three/drei'

const Person = ({ isRotating, ...props }) => {
  const ref = useRef();
    const { scene, animations } = useGLTF(character);
    const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if(isRotating) {
      actions['CharacterArmature|Run'].play();
      actions['CharacterArmature|Idle'].stop();
    } else {
      actions['CharacterArmature|Run'].stop();
      actions['CharacterArmature|Idle'].play();
    }

  },[actions, isRotating])

  return (
    <mesh {...props} ref={ref}>
        <primitive object={scene}/>
    </mesh>
  )
}

export default Person 