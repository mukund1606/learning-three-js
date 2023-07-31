"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, useHelper } from "@react-three/drei";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import stars from "./img/stars.jpg";
import nebula from "./img/nebula.jpg";

const Box = () => {
  const [isHovered, setIsHovered] = useState(false);
  const boxRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (isHovered) {
      boxRef.current?.scale.set(1.5, 1.5, 1.5);
      if (boxRef.current?.material instanceof THREE.MeshBasicMaterial) {
        boxRef.current?.material.color.set(0xff0000);
      }
    } else {
      boxRef.current?.scale.set(1, 1, 1);
      if (boxRef.current?.material instanceof THREE.MeshBasicMaterial) {
        boxRef.current?.material.color.set(0x00ff00);
      }
    }
  }, [isHovered]);
  return (
    <mesh
      scale={5}
      ref={boxRef}
      onPointerEnter={(e) => {
        setIsHovered(true);
      }}
      onPointerLeave={(e) => {
        setIsHovered(false);
      }}
    >
      <boxGeometry />
      <meshBasicMaterial color={0x00ff00} />
    </mesh>
  );
};

const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color={0xffffff} side={2} />
    </mesh>
  );
};

const DirLight = () => {
  const dirLight = useRef<THREE.DirectionalLight>(
    null
  ) as MutableRefObject<THREE.DirectionalLight>;
  const cameraHelper = useRef<THREE.OrthographicCamera>(
    null
  ) as MutableRefObject<THREE.OrthographicCamera>;
  useHelper(dirLight, THREE.DirectionalLightHelper, 5, "white");
  // useHelper(cameraHelper, THREE.CameraHelper);

  return (
    <>
      <directionalLight
        color={0xffffff}
        intensity={5}
        position={[-30, 50, 0]}
        // ref={dirLight}
        castShadow
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach="shadow-camera"
          ref={cameraHelper}
          args={[-10, 10, 10, -10]}
        />
      </directionalLight>
    </>
  );
};

const SpotLight = () => {
  const spotLight = useRef<THREE.SpotLight>(
    null
  ) as MutableRefObject<THREE.SpotLight>;
  const cameraHelper = useRef<THREE.CameraHelper>(
    null
  ) as MutableRefObject<THREE.CameraHelper>;
  useHelper(spotLight, THREE.SpotLightHelper, "white");
  return (
    <>
      <spotLight
        color={0xffffff}
        intensity={99999}
        position={[-100, 100, 0]}
        castShadow
        angle={0.2}
        ref={spotLight}
      ></spotLight>
    </>
  );
};

const Box2 = () => {
  const myBox = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  useFrame(() => {
    if (myBox.current && !isHovered) {
      myBox.current.rotation.y += 0.01;
    }
  });
  const [starsMap, nebulaMap] = useLoader(THREE.TextureLoader, [
    "/stars.jpg",
    "/nebula.jpg",
  ]);
  starsMap.encoding = THREE.SRGBColorSpace;
  nebulaMap.encoding = THREE.SRGBColorSpace;
  return (
    <mesh
      position={[0, 5, 5]}
      scale={5}
      castShadow
      ref={myBox}
      onPointerOver={() => {
        setIsHovered(true);
      }}
      onPointerOut={() => {
        setIsHovered(false);
      }}
    >
      <boxGeometry />
      <meshBasicMaterial attach="material-0" map={nebulaMap} />
      <meshBasicMaterial attach="material-1" map={nebulaMap} />
      <meshBasicMaterial attach="material-2" map={starsMap} />
      <meshBasicMaterial attach="material-3" map={starsMap} />
      <meshBasicMaterial attach="material-4" map={starsMap} />
      <meshBasicMaterial attach="material-5" map={starsMap} />
    </mesh>
  );
};

const SceneTexture = () => {
  const { scene } = useThree();
  const cubeTexture = new THREE.CubeTextureLoader().load([
    "/nebula.jpg",
    "/nebula.jpg",
    "/stars.jpg",
    "/stars.jpg",
    "/stars.jpg",
    "/stars.jpg",
  ]);
  cubeTexture.colorSpace = THREE.SRGBColorSpace;
  scene.background = cubeTexture;
  return <></>;
};

const Tutorial1 = () => {
  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 1000,
          position: [-10, 30, 30],
        }}
        shadows
      >
        <SceneTexture />
        {/* <meshBasicMaterial attach="background" map={starsMap} /> */}
        {/* <axesHelper args={[50]} /> */}
        <ambientLight color={0x333333} intensity={20} />
        <DirLight />
        {/* <SpotLight /> */}
        {/* <fog attach="fog" color={0xffffff} near={0.1} far={1000} /> */}
        {/* <fogExp2 attach="fog" args={[0xffffff, 0.005]} /> */}
        <OrbitControls />
        <Box />
        <Box2 />
        <Plane />
        <Sphere args={[4, 50, 50]} position={[-10, 10, 0]} castShadow>
          <meshStandardMaterial color={0xff0000} />
        </Sphere>
        {/* <gridHelper args={[30, 10]} /> */}
      </Canvas>
    </>
  );
};

export default Tutorial1;
