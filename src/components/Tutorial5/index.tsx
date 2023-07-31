"use client";

import { Box, OrbitControls, Plane, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import {
  Physics,
  useBox,
  useContactMaterial,
  usePlane,
  useSphere,
} from "@react-three/cannon";

const PlaneObj = () => {
  const [ref, api] = useBox(() => ({
    type: "Static",
    args: [30, 30, 0.00001],
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: "groundMaterial",
  })) as any;

  return (
    <Plane args={[30, 30]} ref={ref}>
      <meshBasicMaterial
        attach="material"
        color={0x0000ff}
        wireframe
        side={2}
      />
    </Plane>
  );
};

const BoxObj = () => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    args: [2, 2, 2],
    position: [5, 20, 0],
    angularVelocity: [0, 10, 0],
    angularDamping: 0.5,
    material: "boxMaterial",
  })) as any;
  return (
    <Box args={[2, 2, 2]} ref={ref}>
      <meshBasicMaterial attach="material" color={0x00ff00} wireframe />
    </Box>
  );
};

const SphereObj = () => {
  const [ref, api] = useSphere(() => ({
    mass: 10,
    args: [2],
    position: [0, 15, 0],
    linearDamping: 0.31,
    material: "sphereMaterial",
  })) as any;
  return (
    <Sphere args={[2]} ref={ref}>
      <meshBasicMaterial attach="material" color={0xff0000} wireframe />
    </Sphere>
  );
};

const ContactHandler = () => {
  useContactMaterial("boxMaterial", "groundMaterial", {
    friction: 0.04,
  });
  useContactMaterial("sphereMaterial", "groundMaterial", {
    restitution: 0.7,
  });
  return <></>;
};

const Tutorial5 = () => {
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
          position: [0, 20, -30],
        }}
        shadows
      >
        {/* <axesHelper args={[5]} /> */}
        <OrbitControls />
        <Physics gravity={[0, -9.81, 0]} stepSize={1 / 60}>
          <PlaneObj />
          <BoxObj />
          <SphereObj />
          <ContactHandler />
        </Physics>
      </Canvas>
    </>
  );
};

export default Tutorial5;
