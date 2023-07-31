"use client";

import {
  Physics,
  useBox,
  useContactMaterial,
  useSphere,
} from "@react-three/cannon";
import { OrbitControls, Plane, Sphere } from "@react-three/drei";
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

const PlaneObj = () => {
  const [ref, api] = useBox(() => ({
    type: "Static",
    args: [10, 10, 0.00001],
    rotation: [-Math.PI / 2, -0.05, 0],
    position: [0, 0, 0],
    material: "groundMaterial",
  })) as any;

  return (
    <Plane args={[10, 10]} ref={ref} receiveShadow>
      <meshStandardMaterial
        attach="material"
        color={0x0000ff}
        // wireframe
        side={2}
      />
    </Plane>
  );
};

const SphereObj = ({
  position,
  color,
}: {
  position: THREE.Vector3;
  color: number;
}) => {
  const [ref, api] = useSphere(() => ({
    mass: 10,
    args: [0.2],
    position: position.toArray(),
    linearDamping: 0.31,
    material: "sphereMaterial",
  })) as any;
  useContactMaterial("groundMaterial", "sphereMaterial", {
    restitution: 0.7,
  });
  return (
    <Sphere args={[0.2]} ref={ref} castShadow>
      <meshStandardMaterial
        attach="material"
        // wireframe
        color={color}
        metalness={0.5}
        roughness={0.5}
      />
    </Sphere>
  );
};

const Tutorial7 = () => {
  const [intersectionPoint, setIntersectionPoint] = useState(
    new THREE.Vector3()
  );
  const [colors, setColors] = useState<number[]>([]);
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
          const color = Math.random() * 0xffffff;
          setColors([...colors, color]);
        }}
      >
        <ambientLight color={0x333333} intensity={1} />
        <directionalLight
          color={0xffffff}
          intensity={2.5}
          position={[10, 10, 0]}
          castShadow
        />
        <Physics>
          <PlaneObj />
          {spheresPosition.map((position, index) => (
            <SphereObj key={index} position={position} color={colors[index]} />
          ))}
        </Physics>
        <RayCaster setIntersectionPoint={setIntersectionPoint} />
        <axesHelper args={[20]} />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default Tutorial7;
