"use client";

import { OrbitControls, Sphere } from "@react-three/drei";
import { Canvas, Vector2, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const RayCaster = ({
  setIntersectionPoint,
}: {
  setIntersectionPoint: React.Dispatch<React.SetStateAction<THREE.Vector3>>;
}) => {
  const intersectionPoint = new THREE.Vector3();
  const planeNormal = new THREE.Vector3();
  const rayCasterRef = useRef<THREE.Raycaster>() as any;
  const plane = new THREE.Plane();
  useFrame(({ mouse, camera, scene }) => {
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    rayCasterRef.current.setFromCamera(mouse, camera);
    rayCasterRef.current.ray.intersectPlane(plane, intersectionPoint);
    setIntersectionPoint(intersectionPoint);
  });
  return (
    <>
      <raycaster ref={rayCasterRef} />
    </>
  );
};

const Tutorial6 = () => {
  const [intersectionPoint, setIntersectionPoint] = useState(
    new THREE.Vector3()
  );
  const [spheresPosition, setSpheresPosition] = useState<THREE.Vector3[]>([]);
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
          position: [0, 6, 6],
        }}
        shadows
        onClick={() => {
          setSpheresPosition([...spheresPosition, intersectionPoint.clone()]);
        }}
      >
        <ambientLight color={0x333333} />
        <directionalLight
          color={0xffffff}
          intensity={0.8}
          position={[0, 50, 0]}
        />
        {spheresPosition.map((position, index) => (
          <Sphere
            key={index}
            args={[0.2, 32, 32]}
            position={position}
            castShadow
          />
        ))}
        <RayCaster setIntersectionPoint={setIntersectionPoint} />
        <axesHelper args={[20]} />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default Tutorial6;
