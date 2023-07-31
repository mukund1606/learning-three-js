"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

const Geometry = ({
  width,
  height,
  devicePixelRatio,
  uniforms,
}: {
  width: number;
  height: number;
  devicePixelRatio: number;
  uniforms: any;
}) => {
  const vertexShader = `
  uniform float u_time;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float newX = sin(position.x * u_time) * sin(position.y * u_time);
    vec3 newPosition = vec3(newX, position.y, position.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position  , 1.0);
  }
  `;
  const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform sampler2D image;
  varying vec2 vUv;
  void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec4 texture = texture2D(image, vUv);
    float effect = abs(sin(u_time + texture.x));
    gl_FragColor = vec4(vec3(effect), 1.0);
  }
  `;
  useFrame(({ clock }) => {
    uniforms.u_time.value = clock.getElapsedTime();
  });
  return (
    <mesh>
      <planeGeometry args={[10, 10, 30, 30]} />
      <shaderMaterial
        // wireframe
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const Tutorial4 = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [devicePixelRatio, setdevicePixelRatio] = useState(0);
  const uniforms = {
    u_time: { type: "f", value: 0.0 },
    u_resolution: {
      type: "v2",
      value: new THREE.Vector2(width, height).multiplyScalar(devicePixelRatio),
    },
    u_mouse: { type: "v2", value: new THREE.Vector2(0, 0) },
    image: { type: "t", value: new THREE.TextureLoader().load("/nebula.jpg") },
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setdevicePixelRatio(window.devicePixelRatio);
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
          position: [0, 0, 12],
        }}
        shadows
        onPointerMove={(e) => {
          uniforms.u_mouse.value.set(e.screenX / width, e.screenY / height);
        }}
      >
        <Geometry
          width={width}
          height={height}
          devicePixelRatio={devicePixelRatio}
          uniforms={uniforms}
        />
        <gridHelper args={[30, 10]} />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default Tutorial4;
