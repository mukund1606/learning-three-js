"use client";

import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SceneBackground = () => {
  const { scene } = useThree();
  scene.background = new THREE.Color(0xa3a3a3);
  return <></>;
};

const GLTFModel = ({ modelUrl }: { modelUrl: string }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(modelUrl, true);
  const { actions, mixer, clips } = useAnimations(animations, group);
  useFrame((state, delta) => {
    clips.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  });

  return <primitive ref={group} object={scene} dispose={null} />;
};

const Tutorial3 = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          aspect: width / height,
          near: 0.1,
          far: 1000,
          position: [10, 10, 10],
        }}
        color="0xa3a3a3"
        shadows
      >
        <SceneBackground />
        <GLTFModel modelUrl="/assets/doggo2.glb" />

        <gridHelper args={[30, 10]} />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default Tutorial3;
