import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

import scene from '../assets/3D/Shiba Inu.glb'

const Doggy = ({ currentAnimation, ...props }) => {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF(scene)
  const { actions } = useAnimations(animations, group);

    useEffect(() => {
        Object.values(actions).forEach((action) => action.stop());

        if(actions[currentAnimation]){
            actions[currentAnimation].play();
        }


    }, [actions, currentAnimation])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group name="AnimalArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Body} />
            <primitive object={nodes.IKBackLegL} />
            <primitive object={nodes.IKFrontLegL} />
            <primitive object={nodes.IKBackLegR} />
            <primitive object={nodes.IKFrontLegR} />
          </group>
          <group
            name="ShibaInu"
            position={[0, 0, 0.062]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}>
            <skinnedMesh
              name="ShibaInu_1"
              geometry={nodes.ShibaInu_1.geometry}
              material={materials.Main}
              skeleton={nodes.ShibaInu_1.skeleton}
            />
            <skinnedMesh
              name="ShibaInu_2"
              geometry={nodes.ShibaInu_2.geometry}
              material={materials.Main_Light}
              skeleton={nodes.ShibaInu_2.skeleton}
            />
            <skinnedMesh
              name="ShibaInu_3"
              geometry={nodes.ShibaInu_3.geometry}
              material={materials.Black}
              skeleton={nodes.ShibaInu_3.skeleton}
            />
            <skinnedMesh
              name="ShibaInu_4"
              geometry={nodes.ShibaInu_4.geometry}
              material={materials.Eyes_White}
              skeleton={nodes.ShibaInu_4.skeleton}
            />
            <skinnedMesh
              name="ShibaInu_5"
              geometry={nodes.ShibaInu_5.geometry}
              material={materials.Eyes_Pupil}
              skeleton={nodes.ShibaInu_5.skeleton}
            />
            <skinnedMesh
              name="ShibaInu_6"
              geometry={nodes.ShibaInu_6.geometry}
              material={materials.Eyes_Black}
              skeleton={nodes.ShibaInu_6.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

export default Doggy