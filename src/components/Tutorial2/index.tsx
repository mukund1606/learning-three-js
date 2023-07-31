"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SceneBackground = () => {
  const { scene } = useThree();
  scene.background = new THREE.CubeTextureLoader().load([
    "./solarsystem/stars.jpg",
    "./solarsystem/stars.jpg",
    "./solarsystem/stars.jpg",
    "./solarsystem/stars.jpg",
    "./solarsystem/stars.jpg",
    "./solarsystem/stars.jpg",
  ]);
  return <></>;
};

const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;
  const sunTexture = useLoader(THREE.TextureLoader, "./solarsystem/sun.jpg");
  useFrame(() => {
    if (sunRef.current?.rotateY) {
      sunRef.current.rotateY(0.004);
    }
  });
  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[16, 30, 30]} />
      <meshBasicMaterial map={sunTexture} />
    </mesh>
  );
};

const Planet = ({
  planetName,
  planetImage,
  orbitRadius,
  rotationSpeed,
  size,
}: {
  planetName: string;
  planetImage: string;
  orbitRadius: number;
  rotationSpeed: number;
  size: number;
}) => {
  const planetRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;
  const planetTexture = useLoader(THREE.TextureLoader, planetImage);
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.name = planetName;
      planetRef.current.position.x = orbitRadius;
      planetRef.current.rotateY(rotationSpeed);
    }
  });
  return (
    <mesh ref={planetRef}>
      <sphereGeometry args={[size, 30, 30]} />
      <meshStandardMaterial map={planetTexture} />
    </mesh>
  );
};

const Rings = ({
  ringArgs,
  ringImage,
  orbitRadius,
}: {
  ringArgs: [number, number, number];
  ringImage: string;
  orbitRadius: number;
}) => {
  const ringRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.position.x = orbitRadius;
      ringRef.current.rotation.x = -0.5 * Math.PI;
    }
  });
  const ringTexture = useLoader(THREE.TextureLoader, ringImage);
  return (
    <mesh ref={ringRef}>
      <ringGeometry args={ringArgs} />
      <meshStandardMaterial map={ringTexture} side={THREE.DoubleSide} />
    </mesh>
  );
};

const PlanetWithRings = ({
  planetName,
  planetImage,
  orbitRadius,
  rotationSpeed,
  size,
}: {
  planetName: string;
  planetImage: string;
  orbitRadius: number;
  rotationSpeed: number;
  size: number;
}) => {
  const planetRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;
  const planetTexture = useLoader(THREE.TextureLoader, planetImage);
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.name = planetName;
      planetRef.current.position.x = orbitRadius;
      planetRef.current.rotateY(rotationSpeed);
    }
  });
  return (
    <mesh ref={planetRef}>
      <sphereGeometry args={[size, 30, 30]} />
      <meshStandardMaterial map={planetTexture} />
    </mesh>
  );
};

const PlanetObject = ({
  planetName,
  planetImage,
  orbitRadius,
  rotationSpeed,
  orbitSpeed,
  size,
  hasRings,
  ringDetails,
}: {
  planetName: string;
  planetImage: string;
  orbitRadius: number;
  rotationSpeed: number;
  size: number;
  orbitSpeed: number;
  hasRings?: boolean;
  ringDetails?: {
    ringArgs: [number, number, number];
    ringsImage: string;
  };
}) => {
  const Ref = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;
  useFrame(() => {
    if (Ref.current?.rotateY) {
      Ref.current.rotateY(orbitSpeed);
    }
  });
  return (
    <mesh ref={Ref}>
      <object3D />
      {!hasRings ? (
        <Planet
          planetImage={planetImage}
          planetName={planetName}
          orbitRadius={orbitRadius}
          rotationSpeed={rotationSpeed}
          size={size}
        />
      ) : (
        <>
          <PlanetWithRings
            planetImage={planetImage}
            planetName={planetName}
            size={size}
            orbitRadius={orbitRadius}
            rotationSpeed={rotationSpeed}
          />
          {ringDetails !== undefined && (
            <Rings
              ringArgs={ringDetails.ringArgs}
              ringImage={ringDetails.ringsImage}
              orbitRadius={orbitRadius}
            />
          )}
        </>
      )}
    </mesh>
  );
};

const Tutorial2 = () => {
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
          position: [-90, 140, 140],
        }}
        shadows
      >
        <SceneBackground />
        <ambientLight color={0x333333} intensity={5} />
        <pointLight args={[0xffffff, 99999, 300]} />
        <OrbitControls />
        <Sun />
        <PlanetObject
          planetName="Mercury"
          planetImage="./solarsystem/mercury.jpg"
          orbitRadius={28}
          size={3.2}
          rotationSpeed={0.004}
          orbitSpeed={0.04}
        />
        <PlanetObject
          planetName="Venus"
          planetImage="./solarsystem/venus.jpg"
          orbitRadius={44}
          size={5.8}
          rotationSpeed={0.004}
          orbitSpeed={0.015}
        />
        <PlanetObject
          planetName="Earth"
          planetImage="./solarsystem/earth.jpg"
          orbitRadius={62}
          size={6}
          rotationSpeed={0.02}
          orbitSpeed={0.01}
        />
        <PlanetObject
          planetName="Mars"
          planetImage="./solarsystem/mars.jpg"
          orbitRadius={78}
          size={4}
          rotationSpeed={0.018}
          orbitSpeed={0.008}
        />
        <PlanetObject
          planetName="Jupiter"
          planetImage="./solarsystem/jupiter.jpg"
          orbitRadius={100}
          size={12}
          rotationSpeed={0.04}
          orbitSpeed={0.002}
        />
        <PlanetObject
          planetName="Saturn"
          planetImage="./solarsystem/saturn.jpg"
          orbitRadius={138}
          size={10}
          rotationSpeed={0.0038}
          orbitSpeed={0.0009}
          hasRings
          ringDetails={{
            ringArgs: [10, 20, 32],
            ringsImage: "./solarsystem/saturn ring.png",
          }}
        />
        <PlanetObject
          planetName="Uranus"
          planetImage="./solarsystem/uranus.jpg"
          orbitRadius={176}
          size={7}
          rotationSpeed={0.03}
          orbitSpeed={0.0004}
          hasRings
          ringDetails={{
            ringArgs: [7, 12, 32],
            ringsImage: "./solarsystem/uranus ring.png",
          }}
        />
        <PlanetObject
          planetName="Neptune"
          planetImage="./solarsystem/neptune.jpg"
          orbitRadius={200}
          size={7}
          rotationSpeed={0.032}
          orbitSpeed={0.0001}
        />
        <PlanetObject
          planetName="Pluto"
          planetImage="./solarsystem/pluto.jpg"
          orbitRadius={216}
          size={2.8}
          rotationSpeed={0.008}
          orbitSpeed={0.00007}
        />
      </Canvas>
    </>
  );
};

export default Tutorial2;
