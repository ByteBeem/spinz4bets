// src/Cup.js
import React from 'react';
import { useSpring, a } from 'react-spring/three';

const Cup = ({ position, depth, animateProps }) => {
  const { x, scale } = useSpring(animateProps);

  return (
    <a.mesh position={position} position-z={depth} scale={scale}>
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      <meshStandardMaterial color="red" />
    </a.mesh>
  );
};

export default Cup;
