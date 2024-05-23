import { a } from "@react-spring/three";
import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import islandScene from "../assets/3D/place.glb";

export default function Island({
  isRotating,
  setIsRotating,
  setCurrentStage,
  currentFocusPoint,
  ...props
}) {
  
  const islandRef = useRef();
  const { scene, animations } = useGLTF(islandScene);
  const { actions } = useAnimations(animations, islandRef);
  // Get access to the Three.js renderer and viewport
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  // Use a ref for the last mouse x position
  const lastX = useRef(0);
  // Use a ref for rotation speed
  const rotationSpeed = useRef(0);
  // Define a damping factor to control rotation damping
  const dampingFactor = 0.65;

  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };

  // Handle pointer (mouse or touch) up event
  const handlePointerUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  // Handle pointer (mouse or touch) move event
  const handlePointerMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isRotating) {
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const delta = (clientX - lastX.current) / viewport.width;

      // Update the island's rotation based on the mouse/touch movement
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;

      // Update the reference for the last clientX position
      lastX.current = clientX;

      // Update the rotation speed
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y += 0.010 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y -= 0.010 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  // Touch events for mobile devices
  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  }
  
  const handleTouchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }
  
  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
  
    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;
  
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;
      lastX.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  }

  useEffect(() => {
    // Add event listeners for pointer and keyboard events
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);

    // Remove event listeners when component unmounts
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

  // This function is called on each frame update
  useFrame(() => {
    // If not rotating, apply damping to slow down the rotation (smoothly)
    if (!isRotating) {
      // Apply damping factor
      rotationSpeed.current *= dampingFactor;

      // Stop rotation when speed is very small
      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      islandRef.current.rotation.y += rotationSpeed.current;
    } else {
      // When rotating, determine the current stage based on island's orientation
      const rotation = islandRef.current.rotation.y;

      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.4 && normalizedRotation <= 6.9:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 3.4 && normalizedRotation <= 4.2:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 1.2 && normalizedRotation <= 2.2:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
    }
  });

  useEffect(() => {
      actions['AnimalArmature|Idle'].play();
  },[actions])

  return (
    <a.group ref={islandRef} {...props}>
      <group name="Scene">
        <group
          name="RootNode004"
          position={[0.917, 0.382, -0.532]}
          rotation={[-Math.PI, 0.976, -Math.PI]}
          scale={0.525}>
          <group name="AnimalArmature001" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Body} />
            <primitive object={nodes.IKBackLegL} />
            <primitive object={nodes.IKFrontLegL} />
            <primitive object={nodes.IKBackLegR} />
            <primitive object={nodes.IKFrontLegR} />
          </group>
        </group>
        <group
          name="RootNode005"
          position={[0.917, 0.382, -0.532]}
          rotation={[-Math.PI, 0.976, -Math.PI]}
          scale={0.525}>
          <group name="AnimalArmature002" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Body_1} />
            <primitive object={nodes.IKBackLegL_1} />
            <primitive object={nodes.IKFrontLegL_1} />
            <primitive object={nodes.IKBackLegR_1} />
            <primitive object={nodes.IKFrontLegR_1} />
          </group>
        </group>
        <group
          name="RootNode006"
          position={[0.917, 0.382, -0.532]}
          rotation={[-Math.PI, 0.976, -Math.PI]}
          scale={0.525}>
          <group name="AnimalArmature003" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Body_2} />
            <primitive object={nodes.IKBackLegL_2} />
            <primitive object={nodes.IKFrontLegL_2} />
            <primitive object={nodes.IKBackLegR_2} />
            <primitive object={nodes.IKFrontLegR_2} />
          </group>
        </group>
        <group
          name="RootNode007"
          position={[0.917, 0.382, -0.532]}
          rotation={[-Math.PI, 0.976, -Math.PI]}
          scale={0.525}>
          <group name="AnimalArmature004" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Body_3} />
            <primitive object={nodes.IKBackLegL_3} />
            <primitive object={nodes.IKFrontLegL_3} />
            <primitive object={nodes.IKBackLegR_3} />
            <primitive object={nodes.IKFrontLegR_3} />
          </group>
        </group>
        <group name="cupTea" position={[1.944, 1.435, 2.127]} rotation={[0, 0.041, 0]}>
          <mesh
            name="cupTea_1"
            castShadow
            receiveShadow
            geometry={nodes.cupTea_1.geometry}
            material={materials._defaultMat}
          />
          <mesh
            name="cupTea_1_1"
            castShadow
            receiveShadow
            geometry={nodes.cupTea_1_1.geometry}
            material={materials.brownDarkest}
          />
        </group>
        <mesh
          name="group13306777"
          castShadow
          receiveShadow
          geometry={nodes.group13306777.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group14247407"
          castShadow
          receiveShadow
          geometry={nodes.group14247407.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group15835575"
          castShadow
          receiveShadow
          geometry={nodes.group15835575.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group59390808"
          castShadow
          receiveShadow
          geometry={nodes.group59390808.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group93335299"
          castShadow
          receiveShadow
          geometry={nodes.group93335299.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group156460083"
          castShadow
          receiveShadow
          geometry={nodes.group156460083.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group165613401"
          castShadow
          receiveShadow
          geometry={nodes.group165613401.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group192929773"
          castShadow
          receiveShadow
          geometry={nodes.group192929773.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group213039448"
          castShadow
          receiveShadow
          geometry={nodes.group213039448.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group225002350"
          castShadow
          receiveShadow
          geometry={nodes.group225002350.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group227914780"
          castShadow
          receiveShadow
          geometry={nodes.group227914780.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group238343898"
          castShadow
          receiveShadow
          geometry={nodes.group238343898.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group250223753"
          castShadow
          receiveShadow
          geometry={nodes.group250223753.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group256395068"
          castShadow
          receiveShadow
          geometry={nodes.group256395068.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group257976566"
          castShadow
          receiveShadow
          geometry={nodes.group257976566.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group283918997"
          castShadow
          receiveShadow
          geometry={nodes.group283918997.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group286116515"
          castShadow
          receiveShadow
          geometry={nodes.group286116515.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group370983626"
          castShadow
          receiveShadow
          geometry={nodes.group370983626.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group380733211"
          castShadow
          receiveShadow
          geometry={nodes.group380733211.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group423249565"
          castShadow
          receiveShadow
          geometry={nodes.group423249565.geometry}
          material={materials.mat21}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <group
          name="group430673059"
          position={[0.77, 1.98, 2.66]}
          rotation={[Math.PI, -0.47, Math.PI]}
          scale={0.528}>
          <mesh
            name="mesh430673059"
            castShadow
            receiveShadow
            geometry={nodes.mesh430673059.geometry}
            material={materials['mat17.001']}
          />
          <mesh
            name="mesh430673059_1"
            castShadow
            receiveShadow
            geometry={nodes.mesh430673059_1.geometry}
            material={materials.mat11}
          />
          <mesh
            name="mesh430673059_2"
            castShadow
            receiveShadow
            geometry={nodes.mesh430673059_2.geometry}
            material={materials['mat20.001']}
          />
          <mesh
            name="mesh430673059_3"
            castShadow
            receiveShadow
            geometry={nodes.mesh430673059_3.geometry}
            material={materials.mat10}
          />
          <mesh
            name="mesh430673059_4"
            castShadow
            receiveShadow
            geometry={nodes.mesh430673059_4.geometry}
            material={materials.mat8}
          />
          <mesh
            name="mesh430673059_5"
            castShadow
            receiveShadow
            geometry={nodes.mesh430673059_5.geometry}
            material={materials.mat25}
          />
          <mesh
            name="mesh430673059_6"
            castShadow
            receiveShadow
            geometry={nodes.mesh430673059_6.geometry}
            material={materials.mat15}
          />
          <mesh
            name="mesh430673059_7"
            castShadow
            receiveShadow
            geometry={nodes.mesh430673059_7.geometry}
            material={materials.mat16}
          />
        </group>
        <mesh
          name="group438200932"
          castShadow
          receiveShadow
          geometry={nodes.group438200932.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group505671632"
          castShadow
          receiveShadow
          geometry={nodes.group505671632.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group548630757"
          castShadow
          receiveShadow
          geometry={nodes.group548630757.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group552841683"
          castShadow
          receiveShadow
          geometry={nodes.group552841683.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group611048843"
          castShadow
          receiveShadow
          geometry={nodes.group611048843.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group633143504"
          castShadow
          receiveShadow
          geometry={nodes.group633143504.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group633938376"
          castShadow
          receiveShadow
          geometry={nodes.group633938376.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group634255084"
          castShadow
          receiveShadow
          geometry={nodes.group634255084.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group687955143"
          castShadow
          receiveShadow
          geometry={nodes.group687955143.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group728145106"
          castShadow
          receiveShadow
          geometry={nodes.group728145106.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <group
          name="group742438179"
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}>
          <mesh
            name="mesh742438179"
            castShadow
            receiveShadow
            geometry={nodes.mesh742438179.geometry}
            material={materials.mat21}
          />
          <mesh
            name="mesh742438179_1"
            castShadow
            receiveShadow
            geometry={nodes.mesh742438179_1.geometry}
            material={materials.mat18}
          />
          <mesh
            name="mesh742438179_2"
            castShadow
            receiveShadow
            geometry={nodes.mesh742438179_2.geometry}
            material={materials.mat19}
          />
          <mesh
            name="mesh742438179_3"
            castShadow
            receiveShadow
            geometry={nodes.mesh742438179_3.geometry}
            material={materials.mat17}
          />
          <mesh
            name="mesh742438179_4"
            castShadow
            receiveShadow
            geometry={nodes.mesh742438179_4.geometry}
            material={materials.mat23}
          />
          <mesh
            name="mesh742438179_5"
            castShadow
            receiveShadow
            geometry={nodes.mesh742438179_5.geometry}
            material={materials.mat22}
          />
          <mesh
            name="mesh742438179_6"
            castShadow
            receiveShadow
            geometry={nodes.mesh742438179_6.geometry}
            material={materials.mat20}
          />
        </group>
        <mesh
          name="group751481862"
          castShadow
          receiveShadow
          geometry={nodes.group751481862.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group752053113"
          castShadow
          receiveShadow
          geometry={nodes.group752053113.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group752636525"
          castShadow
          receiveShadow
          geometry={nodes.group752636525.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group802050906"
          castShadow
          receiveShadow
          geometry={nodes.group802050906.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group842451926"
          castShadow
          receiveShadow
          geometry={nodes.group842451926.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group864707251"
          castShadow
          receiveShadow
          geometry={nodes.group864707251.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group875940139"
          castShadow
          receiveShadow
          geometry={nodes.group875940139.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group905252152"
          castShadow
          receiveShadow
          geometry={nodes.group905252152.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group935609718"
          castShadow
          receiveShadow
          geometry={nodes.group935609718.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group937831915"
          castShadow
          receiveShadow
          geometry={nodes.group937831915.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group962457873"
          castShadow
          receiveShadow
          geometry={nodes.group962457873.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group966664866"
          castShadow
          receiveShadow
          geometry={nodes.group966664866.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1003306018"
          castShadow
          receiveShadow
          geometry={nodes.group1003306018.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1011320071"
          castShadow
          receiveShadow
          geometry={nodes.group1011320071.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1011911227"
          castShadow
          receiveShadow
          geometry={nodes.group1011911227.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1017517075"
          castShadow
          receiveShadow
          geometry={nodes.group1017517075.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1019897031"
          castShadow
          receiveShadow
          geometry={nodes.group1019897031.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1034316329"
          castShadow
          receiveShadow
          geometry={nodes.group1034316329.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1048815158"
          castShadow
          receiveShadow
          geometry={nodes.group1048815158.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1052635492"
          castShadow
          receiveShadow
          geometry={nodes.group1052635492.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1138996592"
          castShadow
          receiveShadow
          geometry={nodes.group1138996592.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <group
          name="group1140854425"
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}>
          <mesh
            name="mesh1140854425"
            castShadow
            receiveShadow
            geometry={nodes.mesh1140854425.geometry}
            material={materials.mat20}
          />
          <mesh
            name="mesh1140854425_1"
            castShadow
            receiveShadow
            geometry={nodes.mesh1140854425_1.geometry}
            material={materials.mat23}
          />
          <mesh
            name="mesh1140854425_2"
            castShadow
            receiveShadow
            geometry={nodes.mesh1140854425_2.geometry}
            material={materials.mat22}
          />
          <mesh
            name="mesh1140854425_3"
            castShadow
            receiveShadow
            geometry={nodes.mesh1140854425_3.geometry}
            material={materials.mat19}
          />
          <mesh
            name="mesh1140854425_4"
            castShadow
            receiveShadow
            geometry={nodes.mesh1140854425_4.geometry}
            material={materials.mat18}
          />
          <mesh
            name="mesh1140854425_5"
            castShadow
            receiveShadow
            geometry={nodes.mesh1140854425_5.geometry}
            material={materials.mat17}
          />
          <mesh
            name="mesh1140854425_6"
            castShadow
            receiveShadow
            geometry={nodes.mesh1140854425_6.geometry}
            material={materials.mat21}
          />
        </group>
        <mesh
          name="group1146959302"
          castShadow
          receiveShadow
          geometry={nodes.group1146959302.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1220427099"
          castShadow
          receiveShadow
          geometry={nodes.group1220427099.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1269888978"
          castShadow
          receiveShadow
          geometry={nodes.group1269888978.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1277222791"
          castShadow
          receiveShadow
          geometry={nodes.group1277222791.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1331048207"
          castShadow
          receiveShadow
          geometry={nodes.group1331048207.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1357238172"
          castShadow
          receiveShadow
          geometry={nodes.group1357238172.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1359852237"
          castShadow
          receiveShadow
          geometry={nodes.group1359852237.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1366047388"
          castShadow
          receiveShadow
          geometry={nodes.group1366047388.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1370981756"
          castShadow
          receiveShadow
          geometry={nodes.group1370981756.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1387497183"
          castShadow
          receiveShadow
          geometry={nodes.group1387497183.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1447785718"
          castShadow
          receiveShadow
          geometry={nodes.group1447785718.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1479453844"
          castShadow
          receiveShadow
          geometry={nodes.group1479453844.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1484951833"
          castShadow
          receiveShadow
          geometry={nodes.group1484951833.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1497847545"
          castShadow
          receiveShadow
          geometry={nodes.group1497847545.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1573889920"
          castShadow
          receiveShadow
          geometry={nodes.group1573889920.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1632347617"
          castShadow
          receiveShadow
          geometry={nodes.group1632347617.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1662040012"
          castShadow
          receiveShadow
          geometry={nodes.group1662040012.geometry}
          material={materials.mat18}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1692817625"
          castShadow
          receiveShadow
          geometry={nodes.group1692817625.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1699351704"
          castShadow
          receiveShadow
          geometry={nodes.group1699351704.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1702132102"
          castShadow
          receiveShadow
          geometry={nodes.group1702132102.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1721710528"
          castShadow
          receiveShadow
          geometry={nodes.group1721710528.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1751088038"
          castShadow
          receiveShadow
          geometry={nodes.group1751088038.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1782243135"
          castShadow
          receiveShadow
          geometry={nodes.group1782243135.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1793352265"
          castShadow
          receiveShadow
          geometry={nodes.group1793352265.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1798431221"
          castShadow
          receiveShadow
          geometry={nodes.group1798431221.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1812224903"
          castShadow
          receiveShadow
          geometry={nodes.group1812224903.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1838312899"
          castShadow
          receiveShadow
          geometry={nodes.group1838312899.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1839125294"
          castShadow
          receiveShadow
          geometry={nodes.group1839125294.geometry}
          material={materials.mat22}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1849838348"
          castShadow
          receiveShadow
          geometry={nodes.group1849838348.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1884002018"
          castShadow
          receiveShadow
          geometry={nodes.group1884002018.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1938683590"
          castShadow
          receiveShadow
          geometry={nodes.group1938683590.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1967720642"
          castShadow
          receiveShadow
          geometry={nodes.group1967720642.geometry}
          material={materials.mat21}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1972613599"
          castShadow
          receiveShadow
          geometry={nodes.group1972613599.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1987144854"
          castShadow
          receiveShadow
          geometry={nodes.group1987144854.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group1994798792"
          castShadow
          receiveShadow
          geometry={nodes.group1994798792.geometry}
          material={materials.mat17}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group2006398532"
          castShadow
          receiveShadow
          geometry={nodes.group2006398532.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group2015271255"
          castShadow
          receiveShadow
          geometry={nodes.group2015271255.geometry}
          material={materials.mat23}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group2040108076"
          castShadow
          receiveShadow
          geometry={nodes.group2040108076.geometry}
          material={materials.mat20}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <mesh
          name="group2095556955"
          castShadow
          receiveShadow
          geometry={nodes.group2095556955.geometry}
          material={materials.mat19}
          position={[-0.011, 1.982, 2.064]}
          rotation={[Math.PI, -0.625, Math.PI]}
          scale={0.681}
        />
        <group name="Node" position={[1.831, 0.506, -1.311]} rotation={[0, -0.351, 0]} scale={0.5}>
          <mesh
            name="Node-Mesh"
            castShadow
            receiveShadow
            geometry={nodes['Node-Mesh'].geometry}
            material={materials['mat23.001']}
          />
          <mesh
            name="Node-Mesh_1"
            castShadow
            receiveShadow
            geometry={nodes['Node-Mesh_1'].geometry}
            material={materials['mat15.001']}
          />
          <mesh
            name="Node-Mesh_2"
            castShadow
            receiveShadow
            geometry={nodes['Node-Mesh_2'].geometry}
            material={materials['mat22.001']}
          />
          <mesh
            name="Node-Mesh_3"
            castShadow
            receiveShadow
            geometry={nodes['Node-Mesh_3'].geometry}
            material={materials['mat25.001']}
          />
          <mesh
            name="Node-Mesh_4"
            castShadow
            receiveShadow
            geometry={nodes['Node-Mesh_4'].geometry}
            material={materials.mat4}
          />
          <mesh
            name="Node-Mesh_5"
            castShadow
            receiveShadow
            geometry={nodes['Node-Mesh_5'].geometry}
            material={materials.mat3}
          />
        </group>
        <group
          name="RootNode"
          position={[-0.835, 0.397, -0.717]}
          rotation={[0, -0.351, 0]}
          scale={1.487}>
          <group
            name="Chair"
            position={[-1.115, 0.67, 0.437]}
            rotation={[-Math.PI / 2, 0, 1.643]}
            scale={3.082}>
            <mesh
              name="Chair_1"
              castShadow
              receiveShadow
              geometry={nodes.Chair_1.geometry}
              material={materials['Executive.003']}
            />
            <mesh
              name="Chair_2"
              castShadow
              receiveShadow
              geometry={nodes.Chair_2.geometry}
              material={materials['Executive__1.003']}
            />
            <mesh
              name="Chair_3"
              castShadow
              receiveShadow
              geometry={nodes.Chair_3.geometry}
              material={materials['Executive__2.003']}
            />
            <mesh
              name="Chair_4"
              castShadow
              receiveShadow
              geometry={nodes.Chair_4.geometry}
              material={materials['Executive__3.003']}
            />
          </group>
          <mesh
            name="Computer_mouse"
            castShadow
            receiveShadow
            geometry={nodes.Computer_mouse.geometry}
            material={materials.ComputerMouse_mat1}
            position={[-0.566, 0.92, 0.91]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            scale={2.93}
          />
          <group
            name="Computer_Screen"
            position={[-0.111, 0.919, 0.472]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            scale={154.397}>
            <mesh
              name="Computer_Screen_1"
              castShadow
              receiveShadow
              geometry={nodes.Computer_Screen_1.geometry}
              material={materials.metalDark}
            />
            <mesh
              name="Computer_Screen_2"
              castShadow
              receiveShadow
              geometry={nodes.Computer_Screen_2.geometry}
              material={materials['metal.002']}
            />
          </group>
          <group
            name="Cube002"
            position={[-0.111, 0.945, 1.079]}
            rotation={[-Math.PI / 2, 0, 3.106]}
            scale={[6.489, 9.4, 0.204]}>
            <mesh
              name="Cube003"
              castShadow
              receiveShadow
              geometry={nodes.Cube003.geometry}
              material={materials['Material.009']}
            />
            <mesh
              name="Cube003_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube003_1.geometry}
              material={materials['Material.010']}
            />
          </group>
          <group
            name="Cylinder001"
            position={[-0.094, 1.409, 0.484]}
            rotation={[0, -1.571, 0]}
            scale={6.449}>
            <mesh
              name="Cylinder004"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder004.geometry}
              material={materials['Grey.002']}
            />
            <mesh
              name="Cylinder004_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder004_1.geometry}
              material={materials.Dark}
            />
            <mesh
              name="Cylinder004_2"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder004_2.geometry}
              material={materials.Blue}
            />
            <mesh
              name="Cylinder004_3"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder004_3.geometry}
              material={materials['Material.011']}
            />
          </group>
          <group
            name="Desk-V86Go2rlnq"
            position={[-0.778, 0.916, 0.419]}
            rotation={[-Math.PI, 1.571, 0]}
            scale={[9999.999, 9999.997, 9999.997]}>
            <mesh
              name="Desk-V86Go2rlnq_1"
              castShadow
              receiveShadow
              geometry={nodes['Desk-V86Go2rlnq_1'].geometry}
              material={materials['DarkWood.012']}
            />
            <mesh
              name="Desk-V86Go2rlnq_2"
              castShadow
              receiveShadow
              geometry={nodes['Desk-V86Go2rlnq_2'].geometry}
              material={materials['Wood.013']}
            />
          </group>
          <mesh
            name="Keyboard-aPwr5p1dluw"
            castShadow
            receiveShadow
            geometry={nodes['Keyboard-aPwr5p1dluw'].geometry}
            material={materials['Mat.065']}
            position={[-0.552, 0.919, 0.416]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            scale={0.625}
          />
          <group
            name="Laptop_bag"
            position={[-0.556, 0.009, -0.604]}
            rotation={[-1.407, 0, Math.PI]}
            scale={0}>
            <mesh
              name="Laptop_bag_1"
              castShadow
              receiveShadow
              geometry={nodes.Laptop_bag_1.geometry}
              material={materials['02___Default.049']}
            />
            <mesh
              name="Laptop_bag_2"
              castShadow
              receiveShadow
              geometry={nodes.Laptop_bag_2.geometry}
              material={materials['03___Default.025']}
            />
            <mesh
              name="Laptop_bag_3"
              castShadow
              receiveShadow
              geometry={nodes.Laptop_bag_3.geometry}
              material={materials['_crayfishdiffuse.049']}
            />
            <mesh
              name="Laptop_bag_4"
              castShadow
              receiveShadow
              geometry={nodes.Laptop_bag_4.geometry}
              material={materials['_crayfishdiffuse-2.012']}
            />
          </group>
          <group
            name="Light_Desk"
            position={[-0.135, 1.162, -0.245]}
            rotation={[-Math.PI / 2, 0, 2.301]}
            scale={[8561.475, 8561.474, 8561.471]}>
            <mesh
              name="Light_Desk_1"
              castShadow
              receiveShadow
              geometry={nodes.Light_Desk_1.geometry}
              material={materials['Black.097']}
            />
            <mesh
              name="Light_Desk_2"
              castShadow
              receiveShadow
              geometry={nodes.Light_Desk_2.geometry}
              material={materials['LightMetal.027']}
            />
            <mesh
              name="Light_Desk_3"
              castShadow
              receiveShadow
              geometry={nodes.Light_Desk_3.geometry}
              material={materials['White.053']}
            />
          </group>
          <mesh
            name="Mousepad002"
            castShadow
            receiveShadow
            geometry={nodes.Mousepad002.geometry}
            material={materials['Mousepad.001']}
            position={[-0.561, 0.919, 0.771]}
            scale={[1175.398, 15.54, 1430.879]}
          />
          <group
            name="Office_Phone002"
            position={[-0.328, 0.973, -0.086]}
            rotation={[Math.PI, 1.424, 0]}
            scale={626.776}>
            <mesh
              name="Office_Phone002_1"
              castShadow
              receiveShadow
              geometry={nodes.Office_Phone002_1.geometry}
              material={materials['Light grey']}
            />
            <mesh
              name="Office_Phone002_2"
              castShadow
              receiveShadow
              geometry={nodes.Office_Phone002_2.geometry}
              material={materials['Grey Plastic']}
            />
            <mesh
              name="Office_Phone002_3"
              castShadow
              receiveShadow
              geometry={nodes.Office_Phone002_3.geometry}
              material={materials.Screen}
            />
            <mesh
              name="Office_Phone002_4"
              castShadow
              receiveShadow
              geometry={nodes.Office_Phone002_4.geometry}
              material={materials['Dark Grey Plastic']}
            />
          </group>
          <group
            name="System_unit001"
            position={[-0.4, 0.244, -0.257]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            scale={0.162}>
            <mesh
              name="System_unit001_1"
              castShadow
              receiveShadow
              geometry={nodes.System_unit001_1.geometry}
              material={materials.lambert3SG}
            />
            <mesh
              name="System_unit001_2"
              castShadow
              receiveShadow
              geometry={nodes.System_unit001_2.geometry}
              material={materials.initialShadingGroup}
            />
          </group>
        </group>
        <group
          name="RootNode001"
          position={[1.657, 0.385, -2.273]}
          rotation={[-Math.PI, 0.056, -Math.PI]}
          scale={1.802}>
          <mesh
            name="Mailbox"
            castShadow
            receiveShadow
            geometry={nodes.Mailbox.geometry}
            material={materials['Material.012']}
            position={[-0.044, 0, -0.05]}
            rotation={[0, -0.697, 0]}
            scale={133.035}
          />
        </group>
        <group
          name="RootNode002"
          position={[1.251, 0.959, 0.497]}
          rotation={[0, 0.061, 0]}
          scale={0.685}>
          <mesh
            name="Environment_Cabinet_Shelves"
            castShadow
            receiveShadow
            geometry={nodes.Environment_Cabinet_Shelves.geometry}
            material={materials['Atlas.001']}
            position={[-0.075, 0, 2.762]}
            rotation={[0, 0.393, 0]}
            scale={100}
          />
        </group>
        <group
          name="RootNode003"
          position={[0.917, 0.382, -0.532]}
          rotation={[-Math.PI, 0.976, -Math.PI]}
          scale={0.525}>
          <group name="AnimalArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <group name="ShibaInu">
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
            <primitive object={nodes.Body_4} />
            <primitive object={nodes.IKBackLegL_4} />
            <primitive object={nodes.IKFrontLegL_4} />
            <primitive object={nodes.IKBackLegR_4} />
            <primitive object={nodes.IKFrontLegR_4} />
          </group>
        </group>
        <group
          name="rugRound"
          position={[4.932, 0.338, -2.166]}
          rotation={[0, -0.351, 0]}
          scale={8.387}>
          <mesh
            name="rugRound_2"
            castShadow
            receiveShadow
            geometry={nodes.rugRound_2.geometry}
            material={materials.carpet}
          />
          <mesh
            name="rugRound_2_1"
            castShadow
            receiveShadow
            geometry={nodes.rugRound_2_1.geometry}
            material={materials.carpetDarker}
          />
        </group>
        <group
          name="Cylinder"
          position={[-0.013, 0.246, 0.046]}
          rotation={[0, -0.351, 0]}
          scale={[4.807, 0.072, 4.807]}>
          <mesh
            name="Cylinder001_1"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder001_1.geometry}
            material={materials['Material.006']}
          />
          <mesh
            name="Cylinder001_2"
            castShadow
            receiveShadow
            geometry={nodes.Cylinder001_2.geometry}
            material={materials['Material.008']}
          />
        </group>
      </group>
    </a.group>
  );
}